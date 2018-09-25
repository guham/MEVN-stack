import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { getLocaleCookie, setLocaleCookie } from '@/services/cookies';

Vue.use(VueI18n);

export const defaultLocale = 'en';
export const fallbackLocale = 'en';
export const locales = ['en', 'fr', 'es'];

let locale = getLocaleCookie();
if (!locale || !locales.includes(locale)) {
  setLocaleCookie(defaultLocale);
  locale = defaultLocale;
}

const i18n = new VueI18n({
  locale,
  fallbackLocale,
});

export default i18n;
