<template>
  <div class="flex flex-col w-1/3 border-b border-b-2 border-green py-2">
    <div class="flex">
      <input
        v-model="name"
        :placeholder="placeholder"
        class="bg-transparent w-full text-grey-darker mr-3 py-1 px-2 leading-tight"
        type="text"
        @keyup.enter="addFoo()">
      <button
        class="btn btn-green"
        type="button"
        @click="addFoo()">
        Add
      </button>
    </div>
    <div
      v-if="hasError"
      id="error"
      class="pt-2">
      <p class="text-red text-sm text-left italic">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import * as types from '@/store/mutation-types';

const { mapMutations, mapActions, mapGetters } = createNamespacedHelpers('foos');

export default {
  name: 'AddFoo',
  props: {
    placeholder: {
      type: String,
      default: 'Default placeholder',
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
