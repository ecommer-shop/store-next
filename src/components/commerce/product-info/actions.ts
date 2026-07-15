"üse client";
import { GetProductVariantStockQuery } from '@/lib/vendure/shared/queries';
import { query } from '@/lib/vendure/client/api';
export async function GetProductVariantStock(id: String | number) {
    const productStock = await query(GetProductVariantStockQuery, { id: String(id) }, );
    console.log('Product stock for variant', id, productStock);
    return productStock;
}