<template>
  <div class="block lg:inline-block">
    <RouterLink
      :to="to"
      :class="classes"
    >
      {{ label }}
    </RouterLink>
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
