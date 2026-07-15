

import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import sharp from 'sharp';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const imageUrl = searchParams.get('image');

    if (!slug) {
        return NextResponse.json({ error: 'slug requerido' }, { status: 400 });
    }

    const productUrl = `https://ecommer.shop/es/product/${slug}`;

    try {
        // Generar QR como PNG en buffer
        const qrBuffer = await QRCode.toBuffer(productUrl, {
            width: 200,
            margin: 1,
            color: { dark: '#12123F', light: '#FFFFFF' },
        });

        let baseImage: sharp.Sharp;

        if (imageUrl) {
            // Descargar imagen del producto
            const res = await fetch(imageUrl);
            if (!res.ok) throw new Error('No se pudo descargar la imagen');
            const imageBuffer = Buffer.from(await res.arrayBuffer());

            // Redimensionar imagen del producto a 600x600
            baseImage = sharp(imageBuffer).resize(600, 600, { fit: 'cover' });
        } else {
            // Fondo sólido azul oscuro si no hay imagen
            baseImage = sharp({
                create: { width: 600, height: 600, channels: 4, background: '#12123F' },
            });
        }

        // Superponer QR en esquina inferior derecha con padding
        const qrResized = await sharp(qrBuffer).resize(150, 150).toBuffer();

        const finalImage = await baseImage
            .composite([{
                input: qrResized,
                gravity: 'southeast',
                blend: 'over',
            }])
            .png()
            .toBuffer();

        return new NextResponse(new Uint8Array(finalImage), {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="producto-${slug}.png"`,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (err) {
        console.error('Error generando QR:', err);
        return NextResponse.json({ error: 'Error generando imagen' }, { status: 500 });
    }
}