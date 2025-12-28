'use client';

import type { TadaDocumentNode } from 'gql.tada';
import {
  executeVendureRequest,
  VendureRequestOptions,
} from '../core';

export async function query<TResult, TVariables>(
  document: TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options?: VendureRequestOptions
) {
  return executeVendureRequest(
    document,
    variables,
    options || {}
  );
}

export const mutate = query;
