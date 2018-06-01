<template>
  <div>
    <h1>FooPanel</h1>
    <p>Count: {{ count }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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

