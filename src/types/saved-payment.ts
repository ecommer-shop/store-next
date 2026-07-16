export interface SavedPaymentMethod {
    id: string;
    type: string;
    wompiPaymentSourceId: string;
    lastFour: string;
    brand: string;
    expiryMonth: string;
    expiryYear: string;
    cardHolderName?: string;
    isDefault: boolean;
    createdAt: string;
}
