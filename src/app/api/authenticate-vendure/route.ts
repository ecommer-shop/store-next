import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { mutate } from '@/lib/vendure/server/api';
import { setAuthToken } from '@/lib/vendure/server/auth';
import { AuthenticateWithClerk } from '@/lib/vendure/shared/mutations';

/**
 * POST /api/authenticate-vendure
 * 
 * Autentica al usuario con Vendure usando su sesión de Clerk.
 * Vendure automáticamente fusiona el carrito anónimo con la cuenta del usuario.
 * 
 * Este endpoint debe llamarse después del primer login exitoso de Clerk.
 */
export async function POST() {
  try {
    const { userId, sessionId } = await auth();

    if (!userId || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated with Clerk' },
        { status: 401 }
      );
    }

    // Obtener el token de Vendure desde Clerk
    const client = await clerkClient();
    const vendureToken = await client.sessions.getToken(sessionId, 'vendure');

    if (!vendureToken?.jwt) {
      return NextResponse.json(
        { success: false, error: 'Failed to get Vendure token from Clerk' },
        { status: 500 }
      );
    }

    // Autenticar con Vendure usando el token de Clerk
    // Esto automáticamente fusiona el carrito anónimo si existe
    const result = await mutate(AuthenticateWithClerk, {
      token: vendureToken.jwt,
    });

    const authResult = result.data.authenticate;

    if (authResult.__typename === 'CurrentUser') {
      // Guardar el token de Vendure en cookies para futuras requests
      if (result.token) {
        await setAuthToken(result.token);
      }

      return NextResponse.json({
        success: true,
        userId: authResult.id,
        message: 'Authenticated with Vendure, cart merged if applicable'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Vendure authentication failed', result: authResult },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[authenticate-vendure] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
