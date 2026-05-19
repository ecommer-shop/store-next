import type { FragmentOf } from '@/graphql';
import { CurrencyCode } from '@/graphql/generated';
import type { ProductCardFragment } from '@/lib/vendure/shared/fragments';

type CatalogProduct = {
    id: string;
    name: string;
    slug: string;
    featuredAsset?: { id: string; preview: string } | null;
    variants?: Array<{ priceWithTax: number; currencyCode: CurrencyCode }>;
};

/** Convierte `products` del Shop API al shape de {@link ProductCardFragment} (SearchResult). */
export function mapCatalogProductToProductCard(product: CatalogProduct): FragmentOf<typeof ProductCardFragment> {
    const firstVariant = product.variants?.[0];
    return {
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        productAsset: product.featuredAsset
            ? {
                  id: product.featuredAsset.id,
                  preview: product.featuredAsset.preview,
              }
            : null,
        priceWithTax: {
            __typename: 'SinglePrice' as const,
            value: firstVariant?.priceWithTax ?? 0,
        },
        currencyCode: (firstVariant?.currencyCode ?? CurrencyCode.Cop) as CurrencyCode,
    } as FragmentOf<typeof ProductCardFragment>;
}
