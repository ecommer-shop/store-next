import 'server-only';

import type { TadaDocumentNode } from 'gql.tada';
import { getAuthToken } from '@/lib/vendure/server/auth';
import {
  executeVendureRequest,
  VendureRequestOptions,
} from '../core';

export async function query<TResult, TVariables>(
  document: TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options?: VendureRequestOptions & { useAuthToken?: boolean }
) {
  let authToken = options?.token;

  if (options?.useAuthToken && !authToken) {
    authToken = await getAuthToken();
  }

  return executeVendureRequest(
    document,
    variables,
    options || {},
    authToken
  );
}

export const mutate = query;
