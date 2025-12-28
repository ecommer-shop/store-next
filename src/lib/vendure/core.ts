// src/lib/vendure/core.ts
import type { TadaDocumentNode } from 'gql.tada';
import { print } from 'graphql';

export const VENDURE_API_URL =
  process.env.VENDURE_SHOP_API_URL ||
  process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL;

export const VENDURE_CHANNEL_TOKEN =
  process.env.VENDURE_CHANNEL_TOKEN ||
  process.env.NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN ||
  '__default_channel__';

export const VENDURE_AUTH_TOKEN_HEADER =
  process.env.VENDURE_AUTH_TOKEN_HEADER || 'vendure-auth-token';

export const VENDURE_CHANNEL_TOKEN_HEADER =
  process.env.VENDURE_CHANNEL_TOKEN_HEADER || 'vendure-token';

if (!VENDURE_API_URL) {
  throw new Error('VENDURE_SHOP_API_URL is not set');
}

export interface VendureRequestOptions {
  token?: string;
  channelToken?: string;
  fetch?: RequestInit;
  tags?: string[];
}

export interface VendureResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export function extractAuthToken(headers: Headers): string | null {
  return headers.get(VENDURE_AUTH_TOKEN_HEADER);
}

export async function executeVendureRequest<TResult, TVariables>(
  document: TadaDocumentNode<TResult, TVariables>,
  variables: TVariables | undefined,
  options: VendureRequestOptions,
  authToken?: string
): Promise<{ data: TResult; token?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.fetch?.headers as Record<string, string>),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  headers[VENDURE_CHANNEL_TOKEN_HEADER] =
    options.channelToken || VENDURE_CHANNEL_TOKEN;

  const response = await fetch(VENDURE_API_URL!, {
    ...options.fetch,
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: print(document),
      variables: variables || {},
    }),
    ...(options.tags && { next: { tags: options.tags } }),
  });

  if (!response.ok) {
    throw new Error(`Vendure HTTP ${response.status}`);
  }

  const result: VendureResponse<TResult> = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors.map(e => e.message).join(', '));
  }

  if (!result.data) {
    throw new Error('No data returned from Vendure');
  }

  return {
    data: result.data,
    token: extractAuthToken(response.headers) ?? undefined,
  };
}
