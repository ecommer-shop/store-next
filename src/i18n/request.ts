import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(({requestLocale}) => {
  const locale = hasLocale(routing.locales, requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: require(`../../messages/${locale}.json`)
  };
});
