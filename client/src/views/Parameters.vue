<template>
  <div class="text-center">
    <h1 class="pb-2">{{ $t('parameters') }}</h1>
    <div class="flex justify-center pt-6">
      <form class="w-full max-w-xs">
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label
              class="block font-bold md:text-right mb-1 md:mb-0 pr-4"
              for="locale-changer">{{ $t('language') }}</label>
          </div>
          <div class="md:w-2/3">
            <locale-changer/>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "parameters": "Parameters",
    "language": "Language"
  },
  "fr": {
    "parameters": "Paramètres",
    "language": "Langue"
  },
  "es": {
    "parameters": "Parámetros",
    "language": "Idioma"
  }
}
</i18n>

<script>
import LocaleChanger from '@/components/LocaleChanger.vue';

export default {
  name: 'Parameters',
  components: {
    LocaleChanger,
  },
};
</script>
