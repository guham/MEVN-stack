/* eslint-disable import/no-named-as-default-member */
import i18n, { locales } from '@/i18n';

describe('i18n', () => {
  test('default locale should be `en`', () => {
    expect(i18n.locale).toBe('en');
  });

  test('fallback locale should be `en`', () => {
    expect(i18n.fallbackLocale).toBe('en');
  });

  test('available locales should be `en`, `fr` and `es`', () => {
    expect(locales).toEqual(['en', 'fr', 'es']);
  });
});
