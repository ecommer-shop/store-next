import { query } from "@/lib/vendure/server/api";
import { GetActiveOrderQuery } from "@/lib/vendure/shared/queries";

export const getActiveOrderQueryForCart = async (token: string | undefined) => {
    let cart = null;
    if (token) {
        try {
            return cart = await query(
                GetActiveOrderQuery,
                {},
                {
                    token,
                    useAuthToken: true,
                    tags: ['cart'],
                }
            );
        } catch (err) {
            // Fallback to default language if the current locale lacks translations
            return cart = await query(
                GetActiveOrderQuery,
                {},
                {
                    token,
                    useAuthToken: true,
                    tags: ['cart'],
                    languageCode: 'en',
                }
            );
        }
    }
}