<template>
  <div>
    <h1 class="pb-2">FooPanel</h1>
    <p class="py-2">Count: {{ count }}</p>
    <div class="flex">
      <div class="sm:w-px lg:w-2/3"/>
      <add-foo placeholder="Foo name"/>
      <div class="sm:w-px lg:w-2/3"/>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import AddFoo from '@/components/AddFoo.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('foos');

export default {
  name: 'FooPanel',
  components: {
    AddFoo,
  },
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

