<template>
  <div>
    <h1 class="pb-2 text-center">FooPanel</h1>
    <p class="py-2 text-center">{{ $t('total') }} {{ $tc('count', count, { count: count }) }}</p>
    <add-foo :placeholder="$t('placeholder')"/>
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
