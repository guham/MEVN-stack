<template>
  <div>
    <h1>Fetch a value from the server</h1>
    <p class="p-2">>> {{ value }}</p>
  </div>
</template>

<script>
import TestService from '@/services/TestService';

export default {
  name: 'test',
  data() {
    return {
      value: 'Waiting for value...',
    };
  },
  mounted() {
    this.fetchValueFromServer();
  },
  methods: {
    fetchValueFromServer() {
      TestService.fetchValueFromServer()
        .then((response) => {
          this.value = response.data.value;
        }).catch((error) => {
          this.value = error.message;
        });
    },
  },
};
</script>
