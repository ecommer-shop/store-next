import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies } from '@/lib/vendure/server/auth';
import { GetEligibleShippingMethodsQuery } from '@/lib/vendure/shared/queries';
import { ALLOWED_SHIPPING_METHOD_CODES } from '@/lib/checkout/shipping-methods';

export async function POST() {
  try {
    const cookiesStore = await cookies();
    const token = getAuthTokenFromCookies(cookiesStore);
    if (!token) {
      return NextResponse.json(
        { error: 'AUTH_REQUIRED' },
        { status: 401 },
      );
    }

    const result = await query(GetEligibleShippingMethodsQuery, {}, { token, useAuthToken: true });
    const methods = (result.data.eligibleShippingMethods || [])
      .filter(method => ALLOWED_SHIPPING_METHOD_CODES.includes(method.code))
      .filter((method, index, arr) => arr.findIndex(m => m.code === method.code) === index);

    return NextResponse.json({ methods });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudieron cargar los métodos de envío' },
      { status: 400 },
    );
  }
}