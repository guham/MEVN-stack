<template>
  <div>
    <h1>Fetch a value from the server</h1>
    <p class="p-2"><span>>></span> {{ value }}</p>
  </div>
</template>

<script>
import TestService from '@/services/TestService';

export default {
  name: 'Test',
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
      return TestService.fetchValueFromServer()
        .then((response) => {
          this.value = response.data.data;
        }).catch((error) => {
          this.value = error.message;
        });
    },
  },
};
</script>
