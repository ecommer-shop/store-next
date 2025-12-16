import Image from 'next/image';
import {FragmentOf, readFragment} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';
import {Price} from '@/components/commerce/price'; 
import {Suspense} from "react"; 
import Link from "next/link"; 
import {Avatar, Button, Card, CloseButton, Link as HLink} from "@heroui/react";

interface ProductCardProps { product: FragmentOf<typeof ProductCardFragment>; }

export function ProductCard({ product: productProp }: ProductCardProps) {
  const product = readFragment(ProductCardFragment, productProp);

  return (
    <div className="relative group">
      
      {/* Link full-card SOLO mobile / tablet */}
      <Link
        href={`/product/${product.slug}`}
        className="
          absolute inset-0 z-10
          lg:hidden
        "
        aria-label={`Ver ${product.productName}`}
      />

      <Card
        className="
          p-0 relative w-full rounded-sm
          h-[150px]
          min-[400px]:h-[170px]
          sm:h-[300px]
          md:h-[240px]
          lg:h-[280px]
          xl:h-[320px]
        "
      >
        {/* Imagen */}
        <img
          alt={product.productName}
          className="absolute inset-0 h-full w-full object-cover"
          src={product.productAsset?.preview}
        />

        <Card.Footer
          className="
            mt-auto relative z-20
            flex items-end justify-between p-3 sm:p-4
            bg-gradient-to-t from-black/70 via-black/50 to-transparent
          "
        >
          <div>
            <div className="text-sm font-bold text-white sm:text-base md:text-lg">
              {product.productName}
            </div>

            <Suspense fallback={<div className="h-6 w-24 bg-white/20 rounded" />}>
              <p className="text-base font-semibold text-white sm:text-lg">
                <Price value={
                  product.priceWithTax.__typename === 'SinglePrice'
                    ? product.priceWithTax.value
                    : product.priceWithTax.min
                } />
              </p>
            </Suspense>
          </div>

          {/* Botón SOLO desktop */}
          <Button
            className="
              hidden lg:flex
              mb-2 bg-white/95 text-black shadow-lg
              min-w-[90px] h-10
            "
          >
            <Link
              href={`/product/${product.slug}`}
              className="font-semibold text-sm"
            >
              Comprar
            </Link>
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
