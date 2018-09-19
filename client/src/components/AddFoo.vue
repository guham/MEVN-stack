<template>
  <div class="flex justify-center pt-6">
    <form
      class="w-full max-w-xs"
      @submit.prevent>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            for="add-foo"
            class="block text-grey font-bold md:text-right mb-1 md:mb-0 pr-4">Foo</label>
        </div>
        <div class="md:w-2/3">
          <input
            id="add-foo"
            v-model="name"
            :placeholder="placeholder"
            class="input"
            type="text"
            @keyup.enter="addFoo()">
        </div>
      </div>
      <div
        v-if="hasError"
        id="error"
        class="md:flex md:items-center mb-6">
        <p class="text-red text-sm text-justify italic">{{ errorMessage }}</p>
      </div>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3"/>
        <div class="md:w-2/3">
          <button
            class="btn btn-green px-4"
            type="button"
            @click="addFoo()">{{ $t('add') }}</button>
        </div>
      </div>
    </form>
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
