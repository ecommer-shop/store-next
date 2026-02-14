import 'server-only';

import type { TadaDocumentNode } from 'gql.tada';
import { getAuthToken } from '@/lib/vendure/server/auth';
import { getVendureLanguageCode } from '@/lib/vendure/server/locale';
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

  // Obtener el código de idioma actual si no se proporciona explícitamente
  const languageCode = options?.languageCode || await getVendureLanguageCode();

  return executeVendureRequest(
    document,
    variables,
    { ...options, languageCode },
    authToken
  );
}

export const mutate = query;
