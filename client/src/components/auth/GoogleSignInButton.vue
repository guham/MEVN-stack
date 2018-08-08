<template>
  <button
    v-if="isAuthenticated"
    id="btn-signout"
    class="btn btn-grey"
    type="button"
    @click="signOutAndRedirect()">
    Sign Out
  </button>
  <button
    v-else
    id="btn-signin"
    class="btn btn-green"
    type="button"
    @click="signIn()">
    Sign In
  </button>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('user');

export default {
  name: 'GoogleSignInButton',

  computed: {
    ...mapGetters([
      'isAuthenticated',
    ]),
  },

  methods: {
    ...mapActions([
      'signIn',
      'signOut',
    ]),
    async signOutAndRedirect() {
      await this.signOut();
      this.$router.replace({ name: 'Home' });
    },
  },
};
</script>
