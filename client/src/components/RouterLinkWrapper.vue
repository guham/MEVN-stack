<template>
  <div class="block lg:inline-block">
    <router-link
      :to="to"
      :class="classes">{{ label }}</router-link>
  </div>
</template>

<script>
export default {
  name: 'RouterLinkWrapper',
  props: {
    to: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    classes: {
      type: String,
      default: 'link',
    },
  },
};
</script>
