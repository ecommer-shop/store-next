"use client";

import Image from 'next/image';
import {FragmentOf, readFragment} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/shared/fragments';
import {Price} from '@/components/commerce/price';
import { normalizeVendureAssetUrl } from '@/lib/vendure/shared/asset-url'; 
import {Suspense} from "react"; 
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { trackSelectItem } from '@/lib/analytics/events';
import { Store } from 'lucide-react';

interface ProductCardProps {
  product: FragmentOf<typeof ProductCardFragment>;
  /** Store name to display. Defaults to "Ecommer" for products with no seller. */
  storeName?: string;
  /** Store channel code for linking to the store page. */
  storeChannelCode?: string;
}

export function ProductCard({ product: productProp, storeName = 'Ecommer', storeChannelCode }: ProductCardProps) {
  const router = useRouter();
  const product = readFragment(ProductCardFragment, productProp);
  const previewSrc = normalizeVendureAssetUrl(product.productAsset?.preview) ?? '';

  // DEBUG: Verificar qué productos tienen channelCode
  if (storeName && storeName !== 'Ecommer') {
    console.log('ProductCard Debug:', {
      productName: product.productName,
      storeName,
      storeChannelCode,
      hasChannelCode: !!storeChannelCode
    });
  }

  const rawPrice =
    product.priceWithTax.__typename === 'SinglePrice'
      ? product.priceWithTax.value
      : product.priceWithTax.min;

  const handleSelectItem = () => {
    trackSelectItem({
      item_id: product.productId,
      item_name: product.productName,
      price: rawPrice,
    });
  };

  const productHref = `/product/${product.slug}`;
  
  // Si no hay storeChannelCode pero hay storeName (no es "Ecommer"), crear un slug del nombre
  let storeHref: string | undefined = undefined;
  if (storeChannelCode) {
    storeHref = `/store/${storeChannelCode}`;
  } else if (storeName && storeName !== 'Ecommer') {
    // Fallback: usar el storeName como slug (normalizado)
    const storeSlug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    storeHref = `/store/${storeSlug}`;
  }

  return (
    // div contenedor — no es Link para evitar anidamiento de elementos interactivos
    <div className="group rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1a1a3e] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

      {/* Imagen — clickeable al producto */}
      <Link href={productHref} onClick={handleSelectItem} prefetch={false} className="block">
        <div className="relative bg-gray-50 dark:bg-[#12123F] aspect-square overflow-hidden">
          {previewSrc ? (
            <Image
              alt={product.productName}
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              src={previewSrc}
              width={400}
              height={400}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
              Sin imagen
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">

        {/* Nombre — clickeable al producto */}
        <Link href={productHref} onClick={handleSelectItem} className="block">
          <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.productName}
          </p>
        </Link>

        {/* Precio actual */}
        <p className="text-sm sm:text-base font-bold" style={{ color: "#12123F" }}>
          <span className="dark:text-[#6BB8FF]">
            <Suspense fallback={<span className="h-4 w-16 bg-gray-200 rounded inline-block" />}>
              <Price value={rawPrice} />
            </Suspense>
          </span>
        </p>

        {/* Nombre de la tienda — Link cuando hay storeHref */}
        <div className="flex items-center gap-1 mt-0.5">
          <Store size={11} className="text-purple-400 flex-shrink-0" />
          {storeHref ? (
            <Link
              href={storeHref}
              prefetch={false}
              className="text-[10px] font-semibold text-purple-500 dark:text-purple-400 truncate hover:underline hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              {storeName}
            </Link>
          ) : (
            <span className="text-[10px] font-semibold text-purple-500 dark:text-purple-400 truncate">
              {storeName}
            </span>
          )}
        </div>

        {/* Botón comprar (solo desktop) */}
        <button
          onClick={() => {
            handleSelectItem();
            router.push(productHref);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6BB8FF')}
          className="hidden lg:flex mt-2 w-full items-center justify-center rounded-lg py-2 text-xs font-bold text-white transition-colors duration-200 active:scale-95 cursor-pointer"
          style={{ backgroundColor: '#6BB8FF' }}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}
