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
import { Truck, Store } from 'lucide-react';

interface ProductCardProps {
  product: FragmentOf<typeof ProductCardFragment>;
  /** Store name to display. Defaults to "Ecommer" for products with no seller. */
  storeName?: string;
}

export function ProductCard({ product: productProp, storeName = 'Ecommer' }: ProductCardProps) {
  const router = useRouter();
  const product = readFragment(ProductCardFragment, productProp);
  const previewSrc = normalizeVendureAssetUrl(product.productAsset?.preview) ?? '';

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

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={handleSelectItem}
      className="group block rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1a1a3e] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen */}
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

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        {/* Nombre */}
        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.productName}
        </p>

        {/* Precio actual */}
        <p className="text-sm sm:text-base font-bold" style={{ color: "#12123F" }}>
          <span className="dark:text-[#6BB8FF]">
            <Suspense fallback={<span className="h-4 w-16 bg-gray-200 rounded inline-block" />}>
              <Price value={rawPrice} />
            </Suspense>
          </span>
        </p>

        {/* Nombre de la tienda */}
        <div className="flex items-center gap-1 mt-0.5">
          <Store size={11} className="text-purple-400 flex-shrink-0" />
          <span className="text-[10px] font-semibold text-purple-500 dark:text-purple-400 truncate">
            {storeName}
          </span>
        </div>

        {/* Etiqueta envío */}
        <div className="flex items-center gap-1">
          <Truck size={11} className="text-green-500 flex-shrink-0" />
          <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">
            Envío gratis
          </span>
        </div>

        {/* Botón comprar (solo desktop) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSelectItem();
            router.push(`/product/${product.slug}`);
          }}
          className="hidden lg:flex mt-2 w-full items-center justify-center rounded-lg py-2 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(90deg, #6BB8FF, #9969F8)" }}
        >
          Comprar
        </button>
      </div>
    </Link>
  );
}
