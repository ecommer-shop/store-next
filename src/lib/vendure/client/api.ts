'use client';

import type { TadaDocumentNode } from 'gql.tada';
import { print } from 'graphql';
import { VENDURE_AUTH_TOKEN_HEADER } from '@/lib/vendure/core';

const VENDURE_URL = process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || '';

if (!VENDURE_URL) {
  console.error('❌ NEXT_PUBLIC_VENDURE_SHOP_API_URL no está configurada');
}

export async function query<T>(
  document: TadaDocumentNode<T, any>,
  variables?: any,
  options?: { authToken?: string }
) {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (options?.authToken) {
      headers[VENDURE_AUTH_TOKEN_HEADER] = options.authToken;
    }

    const queryString = print(document);
    
    // Debug - ver qué se está enviando
    console.log('🔍 Query:', queryString.substring(0, 100) + '...');
    console.log('🔍 Variables:', variables);
    console.log('🔍 URL:', VENDURE_URL);

    const response = await fetch(VENDURE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        query: queryString,
        variables 
      }),
      credentials: 'include', // ← Importante para cookies de sesión
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    // Manejar errores de GraphQL
    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    console.log('✅ Query exitoso');
    return result;

  } catch (error) {
    console.error('❌ Error en query():', error);
    throw error;
  }
}

export const mutate = query;