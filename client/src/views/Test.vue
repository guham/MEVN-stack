<template>
  <div class="text-center">
    <h1>{{ $t('title') }}</h1>
    <p class="p-2">
      <span>>></span> {{ value }}
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Example: fetch a data from the API"
  },
  "fr": {
    "title": "Exemple : récupérer une donnée à partir de l'API"
  },
  "es": {
    "title": "Ejemplo: obtener un dato del API"
  }
}
</i18n>

<script>
import testClient from '@/api/test';
import _get from 'lodash/get';

export default {
  name: 'Test',
  metaInfo: {
    title: 'Test',
  },
  data: () => ({
    value: 'Waiting for value...',
  }),
  mounted() {
    this.fetchValueFromServer();
  },
  methods: {
    fetchValueFromServer() {
      return testClient.fetchValueFromServer()
        .then((response) => {
          this.value = response.data.data;
        }).catch((error) => {
          this.value = _get(error, 'data.message', _get(error, 'message', ''));
        });
    },
  },
};
</script>
