import Cookies from 'js-cookie';

export function setLocaleCookie(locale) {
  Cookies.set('locale', locale, { expires: 7, secure: process.env.NODE_ENV === 'production' });
}

export const getLocaleCookie = () => Cookies.get('locale');
