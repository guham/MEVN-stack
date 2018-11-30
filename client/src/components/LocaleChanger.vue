<template>
  <div class="inline-block relative w-24 mr-2 ">
    <select
      id="locale-changer"
      v-model="$i18n.locale"
      class="select-standard w-full"
    >
      <option
        v-for="(lang, i) in locales"
        :key="`Lang${i}`"
        :value="lang"
      >
        {{ lang.toUpperCase() }}
      </option>
    </select>
    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
</template>

<script>
import { locales } from '@/i18n';
import { setLocaleCookie } from '@/services/cookies';

export default {
  name: 'LocaleChanger',
  data: () => ({
    locales,
  }),

  watch: {
    '$i18n.locale': function change(locale) {
      setLocaleCookie(locale);
    },
  },
};
</script>
