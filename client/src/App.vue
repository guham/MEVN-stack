<template>
  <div id="app">
    <div class="flex items-center p-4">
      <div class="flex-1"/>
      <div
        id="nav"
        class="flex-1">
        <router-link to="/">Home</router-link>
        <template v-if="isAuthenticated">
          | <router-link to="/test">Test</router-link>
          | <router-link to="/foo">Foo</router-link>
        </template>
      </div>
      <div class="flex-1 text-right">
        <google-sign-in-button/>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue';

const { mapGetters } = createNamespacedHelpers('user');

export default {
  components: {
    GoogleSignInButton,
  },
  data: () => ({}),

  computed: {
    ...mapGetters([
      'isAuthenticated',
    ]),
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
