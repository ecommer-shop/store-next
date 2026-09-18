import { NextResponse } from 'next/server';
import { calculateDeliveryCostQuote } from '@/app/[locale]/checkout/actions';


export async function POST() {
  try {
    const quote = await calculateDeliveryCostQuote();
    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudo calcular el envío' },
      { status: 400 },
    );
  }
}