import { getTopCollections } from '@/lib/vendure/cached';

export const getNavbarCollections = async () => {
    return getTopCollections();
}
