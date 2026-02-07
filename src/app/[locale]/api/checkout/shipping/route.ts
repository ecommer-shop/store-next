import { setShippingMethod } from '@/app/[locale]/checkout/actions';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const { shippingMethodId } = await req.json();

  await setShippingMethod(shippingMethodId);

  return NextResponse.json({ ok: true });
}
