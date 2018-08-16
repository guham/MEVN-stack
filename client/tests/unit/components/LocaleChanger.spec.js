import LocaleChanger from '@/components/LocaleChanger.vue';
import factory from '../factory';

describe('LocaleChanger.vue', () => {
  test('should change locale as expected', () => {
    const wrapper = factory(LocaleChanger);
    expect(wrapper.vm.$i18n.locale).toBe('en');
    const options = wrapper.find('select').findAll('option');
    options.at(1).setSelected();
    expect(wrapper.vm.$i18n.locale).toBe('fr');
  });

  test('has the expected html structure', () => {
    const wrapper = factory(LocaleChanger);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
