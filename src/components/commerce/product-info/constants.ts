export enum ProductInfoStockStatus {
    IN_STOCK = "IN_STOCK",
    LOW_STOCK = "LOW_STOCK",
    OUT_OF_STOCK = "OUT_OF_STOCK",
}

export const STOCK_STATUS_COLORS: Record<ProductInfoStockStatus, string> = {
    [ProductInfoStockStatus.IN_STOCK]: "text-green-600",
    [ProductInfoStockStatus.LOW_STOCK]: "text-amber-500", 
    [ProductInfoStockStatus.OUT_OF_STOCK]: "text-destructive",
};
