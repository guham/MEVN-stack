<template>
  <div>
    <h1 class="pb-2">FooPanel</h1>
    <p class="py-2">{{ $t('total') }} {{ $tc('count', count, { count: count }) }}</p>
    <div class="flex">
      <div class="sm:w-px lg:w-2/3"/>
      <add-foo :placeholder="$t('placeholder')"/>
      <div class="sm:w-px lg:w-2/3"/>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "placeholder": "Foo's name",
    "total": "Total:",
    "count": "no foos | one foo | {count} foos"
  },
  "fr": {
    "placeholder": "Nom",
    "total": "Total :",
    "count": "aucun foo | un foo | {count} foos"
  },
  "es": {
    "placeholder": "Nombre del Foo",
    "total": "Total:",
    "count": "ningún foo | un foo | {count} foos"
  }
}
</i18n>

<script>
import { createNamespacedHelpers } from 'vuex';
import AddFoo from '@/components/AddFoo.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('foos');

export default {
  name: 'FooPanel',
  components: {
    AddFoo,
  },
  data: () => ({}),

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
