import {query} from './server/api';
import {GetActiveChannelQuery, GetAvailableCountriesQuery, GetTopCollectionsQuery} from './shared/queries';
import { getVendureLanguageCode } from './server/locale';


/**
 * Get top-level collections.
 */
export const getTopCollections = async () => {
    const locale = await getVendureLanguageCode();
    const result = await query(GetTopCollectionsQuery, undefined, { languageCode: locale });
    return result.data.collections.items;
}

export const getActiveChannelCached = async () => {
    const result = await query(GetActiveChannelQuery);
    return result.data.activeChannel;
}

export const getAvailableCountriesCached = async () => {
    const result = await query(GetAvailableCountriesQuery);
    return result.data.availableCountries || [];
}
