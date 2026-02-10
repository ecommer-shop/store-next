'use client';

import type { TadaDocumentNode } from 'gql.tada';
import {
  executeVendureRequest,
  VendureRequestOptions,
} from '../core';

const VENDURE_URL =
  process.env.VENDURE_SHOP_API_URL || '';

//const VENDURE_URL = process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || '';

console.log('🔥 VENDURE_URL:', VENDURE_URL);

export async function query<T>(
  document: TadaDocumentNode<T, any>,
  variables?: any,
  options?: { authToken?: string }
) {
  console.log('🔥 Haciendo query a:', VENDURE_URL);
  console.log('🔥 Variables:', variables); 
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (options?.authToken) {
    headers.Authorization = `Bearer ${options.authToken}`;
  }

  return fetch(VENDURE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: document, variables }),
  }).then(res => res.json());
}


export const mutate = query;
