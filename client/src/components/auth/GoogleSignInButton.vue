<template>
  <button
    v-if="isAuthenticated"
    id="btn-signout"
    class="btn btn-grey"
    type="button"
    @click="signOutAndRedirect()"
  >
    {{ $t('signout') }}
  </button>
  <button
    v-else
    id="btn-signin"
    class="btn btn-green"
    type="button"
    @click="signInAction()"
  >
    {{ $t('signin') }}
  </button>
</template>

<i18n>
{
  "en": {
    "signin": "Sign In",
    "signout": "Sign Out"
  },
  "fr": {
    "signin": "Se connecter",
    "signout": "Déconnexion"
  },
  "es": {
    "signin": "Iniciar sesión",
    "signout": "Cerrar sesión"
  }
}
</i18n>

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
    async signInAction() {
      await this.signIn();
      this.$emit('signIn');
    },
    async signOutAndRedirect() {
      await this.signOut();
      this.$router.replace({ name: 'Home' });
    },
  },
};
</script>
