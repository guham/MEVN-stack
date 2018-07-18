<template>
  <div>
    <h1>Fetch a value from the server</h1>
    <p class="p-2"><span>>></span> {{ value }}</p>
  </div>
</template>

<script>
import testClient from '@/api/test';

export default {
  name: 'Test',
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
          this.value = error.message;
        });
    },
  },
};
</script>
