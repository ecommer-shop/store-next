'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { mutate } from '@/lib/vendure/server/api';
import { clearVendureAuth, setAuthToken } from '@/lib/vendure/server/auth';
import { AuthenticateWithClerk, DeleteMyAccountMutation } from '@/lib/vendure/shared/mutations';
type DeleteAccountActionResult = {
	success: boolean;
	message: string;
};

export async function deleteAccountAction(): Promise<DeleteAccountActionResult> {
	const { userId, sessionId } = await auth();
	let token: string | undefined;
	
	if (!userId) {
		return {
			success: false,
			message: 'No active Clerk session found.',
		};
	}

	if (!sessionId) {
		return {
			success: false,
			message: 'No active Clerk session ID found.',
		};
	}

	// Refresh the Vendure session token from the current Clerk session so
	// deleteMyAccount receives a session associated with the current clerkId.
	try {
		const client = await clerkClient();
		const vendureTemplateToken = await client.sessions.getToken(sessionId, 'vendure');
		const login = await mutate(AuthenticateWithClerk, {
			token: vendureTemplateToken?.jwt,
		});

		if (login.token) {
			token = login.token;
			await setAuthToken(login.token);
		}
	} catch {
		// Continue with current token as fallback.
	}

	let deleteResult: DeleteAccountActionResult;
	try {
		const result = await mutate(
			DeleteMyAccountMutation,
			({ input: { clerkId: userId } } as unknown) as never,
			{ token, useAuthToken: true }
		);
		deleteResult = result.data.deleteMyAccount as DeleteAccountActionResult;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error deleting account.';
		return {
			success: false,
			message,
		};
	}

	if (!deleteResult.success) {
		return deleteResult;
	}

	try {
		const client = await clerkClient();
		await client.users.deleteUser(userId);
	} catch (error) {
		await clearVendureAuth();
		return {
			success: false,
			message: `Vendure account deleted, but Clerk deletion failed: ${(error as Error).message}`,
		};
	}

	await clearVendureAuth();

	return deleteResult;
}