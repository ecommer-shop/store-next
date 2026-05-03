import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const VENDURE_ADMIN_API_URL = process.env.VENDURE_ADMIN_API_URL || process.env.VENDURE_SHOP_API_URL;
const VENDURE_SHOP_API_URL = process.env.VENDURE_SHOP_API_URL;
const VENDURE_CHANNEL_TOKEN = process.env.VENDURE_CHANNEL_TOKEN || process.env.NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN;
const VENDURE_CHANNEL_TOKEN_HEADER = process.env.VENDURE_CHANNEL_TOKEN_HEADER!;
const VENDURE_AUTH_TOKEN_HEADER = process.env.VENDURE_AUTH_TOKEN_HEADER || 'vendure-auth-token';
const VENDURE_SUPERADMIN_USERNAME = process.env.VENDURE_SUPERADMIN_USERNAME!;
const VENDURE_SUPERADMIN_PASSWORD = process.env.VENDURE_SUPERADMIN_PASSWORD!;
const WEBHOOK_DEBUG = process.env.NODE_ENV !== 'production' || process.env.CLERK_WEBHOOK_DEBUG === 'true';

function logDebug(..._args: unknown[]) {}

async function getVendureAdminToken() {
	if (!VENDURE_ADMIN_API_URL) {
		throw new Error('Vendure admin API URL missing');
	}

	const loginMutation = `
		mutation AdminLogin($username: String!, $password: String!) {
			login(username: $username, password: $password) {
				__typename
				... on CurrentUser { id }
				... on ErrorResult { errorCode message }
			}
		}
	`;

	const response = await fetch(VENDURE_ADMIN_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(VENDURE_CHANNEL_TOKEN ? { [VENDURE_CHANNEL_TOKEN_HEADER]: VENDURE_CHANNEL_TOKEN } : {}),
		},
		body: JSON.stringify({
			query: loginMutation,
			variables: {
				username: VENDURE_SUPERADMIN_USERNAME,
				password: VENDURE_SUPERADMIN_PASSWORD,
			},
		}),
	});

	if (!response.ok) {
		throw new Error(`Vendure admin login HTTP ${response.status}`);
	}

	const token = response.headers.get(VENDURE_AUTH_TOKEN_HEADER);
	const result = await response.json();
	const loginResult = result?.data?.login;

	if (loginResult?.__typename === 'ErrorResult') {
		throw new Error(loginResult.message || 'Vendure admin login failed');
	}

	if (!token) {
		throw new Error('Vendure admin token missing');
	}

	return token;
}

async function vendureAdminRequest<T>(query: string, variables: Record<string, unknown>) {
	if (!VENDURE_ADMIN_API_URL) {
		throw new Error('Vendure admin API URL missing');
	}

	const token = await getVendureAdminToken();

	const response = await fetch(VENDURE_ADMIN_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
			...(VENDURE_CHANNEL_TOKEN ? { [VENDURE_CHANNEL_TOKEN_HEADER]: VENDURE_CHANNEL_TOKEN } : {}),
		},
		body: JSON.stringify({ query, variables }),
	});

	if (!response.ok) {
		const responseText = await response.text();
		throw new Error(`Vendure admin HTTP ${response.status}: ${responseText}`);
	}

	const result = await response.json();

	if (result.errors?.length) {
		const messages = result.errors.map((err: { message: string }) => err.message).join(', ');
		throw new Error(`Vendure admin GraphQL error: ${messages}`);
	}

	return result.data as T;
}

async function vendureShopRequest<T>(query: string, variables: Record<string, unknown>) {
	if (!VENDURE_SHOP_API_URL) {
		throw new Error('Vendure shop API URL missing');
	}

	const response = await fetch(VENDURE_SHOP_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(VENDURE_CHANNEL_TOKEN ? { [VENDURE_CHANNEL_TOKEN_HEADER]: VENDURE_CHANNEL_TOKEN } : {}),
		},
		body: JSON.stringify({ query, variables }),
	});

	if (!response.ok) {
		const responseText = await response.text();
		throw new Error(`Vendure shop HTTP ${response.status}: ${responseText}`);
	}

	const result = await response.json();

	if (result.errors?.length) {
		const messages = result.errors.map((err: { message: string }) => err.message).join(', ');
		throw new Error(`Vendure shop GraphQL error: ${messages}`);
	}

	return result.data as T;
}

async function findVendureCustomerByEmail(email: string): Promise<string | null> {
	const findCustomerQuery = `
		query FindCustomerByEmail($email: String!) {
			customers(options: { filter: { emailAddress: { eq: $email } }, take: 1 }) {
				items { id }
			}
		}
	`;

	type FindResponse = { customers: { items: Array<{ id: string }> } };
	const customerResult = await vendureAdminRequest<FindResponse>(findCustomerQuery, { email });
	return customerResult.customers.items[0]?.id ?? null;
}

async function updateVendureCustomerClerkId(customerId: string, clerkId: string) {
	const updateMutation = `
		mutation UpdateCustomerClerkId($input: UpdateCustomerInput!) {
			updateCustomer(input: $input) {
				__typename
				... on Customer {
					id
				}
			}
		}
	`;

	type UpdateResponse = { updateCustomer: { __typename: string; id?: string } };
	return vendureAdminRequest<UpdateResponse>(updateMutation, {
		input: {
			id: customerId,
			customFields: {
				clerkId: clerkId,
			},
		},
	});
}

async function createVendureCustomer(email: string, firstName: string, lastName: string, clerkId: string) {
	const createMutation = `
		mutation AdminCreateCustomer($input: CreateCustomerInput!) {
			createCustomer(input: $input) {
				__typename
				... on Customer { id emailAddress }
				... on ErrorResult { errorCode message }
			}
		}
	`;

	type CreateResponse = { createCustomer: { __typename: string; id?: string; errorCode?: string; message?: string } };
	const result = await vendureAdminRequest<CreateResponse>(createMutation, {
		input: {
			emailAddress: email,
			firstName,
			lastName,
			customFields: {
				clerkId: clerkId,
			},
		},
	});
	return result.createCustomer;
}

function getPrimaryEmail(eventData: any): string | null {
	const primaryId = eventData?.primary_email_address_id as string | undefined;
	const emailFromArray = eventData?.email_addresses?.find((email: any) => email.id === primaryId)?.email_address;

	if (emailFromArray) return emailFromArray;
	if (eventData?.email_addresses?.length) return eventData.email_addresses[0].email_address;
	if (eventData?.email_address) return eventData.email_address;

	return null;
}

export async function POST(req: Request) {
	logDebug('POST handler reached');

	const body = await req.text();
	const headerList = await headers();

	const svixId = headerList.get('svix-id');
	const svixTimestamp = headerList.get('svix-timestamp');
	const svixSignature = headerList.get('svix-signature');

	if (!svixId || !svixTimestamp || !svixSignature) {
		logDebug('Missing svix headers');
		return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
	}

	if (!CLERK_WEBHOOK_SECRET) {
		console.error('[Clerk Webhook] Missing CLERK_WEBHOOK_SECRET env var');
		return NextResponse.json({ error: 'Missing Clerk webhook secret' }, { status: 500 });
	}

	const wh = new Webhook(CLERK_WEBHOOK_SECRET);
	let evt: { type: string; data: any };

	try {
		evt = wh.verify(body, {
			'svix-id': svixId,
			'svix-timestamp': svixTimestamp,
			'svix-signature': svixSignature,
		}) as { type: string; data: any };
	} catch (err) {
		logDebug('Signature verification failed:', (err as Error).message);
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
	}

	logDebug('Verified event type:', evt.type);

	if (evt.type === 'user.created') {
		const email = getPrimaryEmail(evt.data);
		const clerkId = evt.data.id as string | undefined;
		if (email) {
			const firstName = (evt.data.first_name as string) || '';
			const lastName = (evt.data.last_name as string) || '';
			try {
				if (!clerkId) {
					logDebug('user.created received without Clerk ID');
				} else {
					const created = await createVendureCustomer(email, firstName, lastName, clerkId);
					if (created.__typename === 'Customer') {
						logDebug('Vendure customer created:', created);
					} else if (created.errorCode === 'EMAIL_ADDRESS_CONFLICT_ERROR') {
						const existingCustomerId = await findVendureCustomerByEmail(email);
						if (existingCustomerId) {
							await updateVendureCustomerClerkId(existingCustomerId, clerkId);
							logDebug('Linked existing Vendure customer to Clerk ID:', existingCustomerId);
						}
					} else {
						logDebug('createVendureCustomer note:', created.message || created.errorCode);
					}
				}
			} catch (err) {
				console.error('[Clerk Webhook] user.created sync failed:', (err as Error).message);
			}
		}
	}

	const shouldDelete =
		evt.type === 'user.deleted' ||
		evt.type === 'user.removed' ||
		evt.type === 'user.scheduled_for_deletion';

	if (shouldDelete) {
		const clerkId = evt.data.id as string | undefined;

		if (!clerkId) {
			logDebug('No Clerk user ID in deletion event');
			return NextResponse.json({ received: true, skipped: 'no user id in payload' });
		}

		try {
			logDebug('Deleting Vendure customer by Clerk ID:', clerkId);
			const deleteMutation = `
				mutation DeleteMyAccount($input: DeleteMyAccountInput!) {
					deleteMyAccount(input: $input) {
						success
						message
					}
				}
			`;

			type DeleteByClerkIdResponse = { deleteMyAccount: { success: boolean; message: string } };
			const deleteResult = await vendureShopRequest<DeleteByClerkIdResponse>(deleteMutation, {
				input: { clerkId },
			});
			logDebug('Vendure delete result:', deleteResult.deleteMyAccount);
		} catch (err) {
			console.error('[Clerk Webhook] ❌ Vendure delete error:', (err as Error).message);
			return NextResponse.json({ error: 'Failed to delete Vendure customer', details: (err as Error).message }, { status: 500 });
		}
	}

	return NextResponse.json({ received: true });
}
