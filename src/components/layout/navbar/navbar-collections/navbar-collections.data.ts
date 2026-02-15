import { unstable_cache } from 'next/cache';
import { getTopCollections } from '@/lib/vendure/cached';

/*export const getNavbarCollections = unstable_cache(
  async () => {
    return getTopCollections();
  },
  ['navbar-collections'],
  {
    revalidate: 72 * 3600,
  }
);*/

export const getNavbarCollections =
  async () => {
    return getTopCollections();
  }
