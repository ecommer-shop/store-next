import { NextResponse } from 'next/server';
import { setShippingMethod, calculateAndSetDeliveryCost } from '@/app/[locale]/checkout/actions';


export async function POST(req: Request) {
  try {
    const { shippingMethodId, isEnvia, isOwnDelivery } = await req.json();

    if (!shippingMethodId) {
        return NextResponse.json(
            { ok: false, error: 'Falta el método de envío a asignar' },
            { status: 400 },
        );
    }

    await setShippingMethod(shippingMethodId);
    if (!isEnvia && !isOwnDelivery) {
        await calculateAndSetDeliveryCost();
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'No se pudo establecer el método de envío',
      },
      { status: 400 },
    );
  }
}