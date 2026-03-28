import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: {
      HomePage: (await import(`../translations/HomePage/${locale}.json`)).default,
      Navigation: (await import(`../translations/Navigation/${locale}.json`)).default,
      Garage: (await import(`../translations/Garage/${locale}.json`)).default,
      Auth: (await import(`../translations/Auth/${locale}.json`)).default,
    }
  };
});
