<template>
  <div id="app">
    <div class="w-full">
      <div
        id="nav"
        class="inline-block w-4/5">
        <router-link to="/">Home</router-link> |
        <router-link to="/test">Test</router-link> |
        <router-link to="/foo">Foo</router-link>
      </div>
      <div class="inline-block w-1/5">
        <google-sign-in-button/>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue';

export default {
  components: {
    GoogleSignInButton,
  },
  data() {
    return {};
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
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
