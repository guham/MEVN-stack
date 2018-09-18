<template>
  <div class="flex flex-col border-b border-b-2 border-green py-2 w-full">
    <div class="flex">
      <input
        v-model="name"
        :placeholder="placeholder"
        class="bg-transparent w-full text-grey-darker mr-3 py-1 px-2 leading-tight"
        type="text"
        @keyup.enter="addFoo()">
      <button
        class="btn btn-green px-4"
        type="button"
        @click="addFoo()">{{ $t('add') }}</button>
    </div>
    <div
      v-if="hasError"
      id="error"
      class="pt-2">
      <p class="text-red text-sm text-left italic">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "add": "Add",
    "default-placeholder": "Default placeholder"
  },
  "fr": {
    "add": "Ajouter",
    "default-placeholder": "Placeholder par défaut"
  },
  "es": {
    "add": "Agregar",
    "default-placeholder": "Placeholder por defecto"
  }
}
</i18n>

<script>
import { createNamespacedHelpers } from 'vuex';
import * as types from '@/store/mutation-types';

const { mapMutations, mapActions, mapGetters } = createNamespacedHelpers('foos');

export default {
  name: 'AddFoo',
  props: {
    placeholder: {
      type: String,
      default() {
        return this.$t('default-placeholder');
      },
    },
  },

  computed: {
    name: {
      get() {
        return this.$store.state.foos.name;
      },
      set(name) {
        this[types.UPDATE_FOO_NAME](name);
      },
    },
    ...mapGetters([
      'hasError',
      'errorMessage',
    ]),
  },

  methods: {
    ...mapMutations([
      types.UPDATE_FOO_NAME,
    ]),
    ...mapActions([
      'addFoo',
    ]),
  },
};
</script>
