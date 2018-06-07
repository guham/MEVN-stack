<template>
  <div>
    <h1>FooPanel</h1>
    <p>Count: {{ count }}</p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('foos');

export default {
  name: 'FooPanel',
  data() {
    return {};
  },

  computed: {
    ...mapGetters([
      'count',
    ]),
  },

  created() {
    this.fetchFoos();
  },

  methods: {
    ...mapActions([
      'fetchFoos',
    ]),
  },
};
</script>

