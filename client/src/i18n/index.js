import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export const locale = 'en';
export const fallbackLocale = 'en';
export const locales = ['en', 'fr', 'es'];

const i18n = new VueI18n({
  locale,
  fallbackLocale,
});

export default i18n;
