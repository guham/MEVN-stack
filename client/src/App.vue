<!-- eslint-disable max-len -->
<template>
  <div id="app">
    <nav
      v-click-outside="closeMenu"
      class="flex items-center bg-white border-b border-grey-lighter justify-between flex-wrap fixed pin-t pin-x z-10 p-3 lg:p-4">
      <div class="flex items-center flex-no-shrink text-white mr-6">
        <img
          src="./assets/logo.png"
          class="h-8 w-8 mr-2"
          alt="Client logo">
        <router-link
          to="/"
          class="font-semibold text-xl tracking-tight text-grey-darker">Client</router-link>
      </div>
      <div class="flex block lg:hidden">
        <div
          :id="[ menuIsVisible ? 'menu-close' : 'menu-open' ]">
          <button
            class="flex items-center px-3 py-2 border rounded text-green border-green hover:text-green-lighter hover:border-green-light"
            aria-label="Toggle navigation"
            @click="toogleMenu()">
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                v-if="!menuIsVisible"
                d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
              <path
                v-else
                d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/>
            </svg>
          </button>
        </div>
      </div>
      <div
        :class="{ hidden: !menuIsVisible }"
        class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow text-left lg:text-center px-2">
          <router-link
            to="/"
            class="link">{{ $t('home') }}</router-link>
          <template v-if="isAuthenticated">
            <span class="hidden lg:inline">|</span>
            <router-link
              to="/test"
              class="link">Test</router-link>
            <span class="hidden lg:inline">|</span>
            <router-link
              to="/foo"
              class="link">Foo</router-link>
          </template>
        </div>
        <div class="text-sm text-left lg:text-center px-2 lg:px-0">
          <router-link
            to="/parameters"
            class="link">{{ $t('parameters') }}</router-link>
          <google-sign-in-button
            class="ml-2 lg:ml-0 mt-4 lg:mt-0"
            @signIn="closeMenu()"/>
        </div>
      </div>
    </nav>
    <div class="min-h-screen pt-24 px-6 pb-6">
      <router-view/>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "home": "Home",
    "parameters": "Parameters"
  },
  "fr": {
    "home": "Accueil",
    "parameters": "Paramètres"
  },
  "es": {
    "home": "Inicio",
    "parameters": "Parámetros"
  }
}
</i18n>

<script>
import { createNamespacedHelpers } from 'vuex';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue';
/* eslint-disable-next-line */
import logo from '@/assets/logo.png';

const { mapGetters } = createNamespacedHelpers('user');

export default {
  metaInfo: {
    titleTemplate: '%s - MEVN-stack',
    title: 'Client',
    meta: [
      { name: 'Description', content: 'MEVN stack' },
      { property: 'og:title', content: 'MEVN stack - client' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${process.env.VUE_APP_CLIENT_URL}${logo}` },
      { property: 'og:url', content: process.env.VUE_APP_CLIENT_URL },
      { property: 'og:description', content: 'MEVN stack' },
    ],
  },
  components: {
    GoogleSignInButton,
  },
  data: () => ({
    menuIsVisible: false,
  }),

  computed: {
    ...mapGetters([
      'isAuthenticated',
    ]),
  },

  watch: {
    $route(to, from) {
      from.name && this.closeMenu();
    },
  },

  methods: {
    toogleMenu() {
      this.menuIsVisible = !this.menuIsVisible;
    },
    closeMenu() {
      this.menuIsVisible = false;
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
a {
  color: #1a4731;
}
a.router-link-exact-active {
  color: #1f9d55;
}
</style>
