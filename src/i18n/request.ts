import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const locale = hasLocale(routing.locales, requestLocale)
    ? requestLocale
    : routing.locales[1];
    
  const currentLocale = await requestLocale.then((res) => res)
  
  return {
    locale,
    messages: (await import(`../../messages/${currentLocale}.json`)).default
  };
});