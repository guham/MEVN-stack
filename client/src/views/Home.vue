<template>
  <div class="text-center">
    <img
      src="../assets/logo.png"
      alt=""
    >
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  metaInfo: {
    title: 'Home',
  },
  components: {
    HelloWorld,
  },
};
</script>
