import {unstable_cache} from 'next/cache';
import {query} from './server/api';
import {GetActiveChannelQuery, GetAvailableCountriesQuery, GetTopCollectionsQuery} from './shared/queries';

/**
 * Get the active channel with caching enabled.
 * Channel configuration rarely changes, so we cache it for 1 hour.
 */
export const getActiveChannelCached = () =>
    unstable_cache(
        async () => {
            const result = await query(GetActiveChannelQuery);
        return result.data.activeChannel;
        },
        [],
        {
            revalidate: 120 * 60
        }
)()

/**
 * Get available countries with caching enabled.
 * Countries list never changes, so we cache it with max duration.
 */
export const getAvailableCountriesCached = () =>
    unstable_cache(
        async () => {
            const result = await query(GetAvailableCountriesQuery);
            return result.data.availableCountries || [];
        },
        ["countries"],
        {
            revalidate: false
        }
)()
    


/**
 * Get top-level collections with caching enabled.
 * Collections rarely change, so we cache them for 1 day.
 */
export const getTopCollections = () => 
    unstable_cache(
        async () => {
            const result = await query(GetTopCollectionsQuery);
            return result.data.collections.items;
        },
        ["collections"],
        {
            revalidate: 72 * 3600
        }
)()


    

