<template>
  <Transition
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </Transition>
</template>

<script>
import anime from 'animejs';

export default {
  name: 'TransitionSlideUp',
  props: {
    duration: {
      type: Number,
      required: true,
    },
  },
  methods: {
    beforeEnter(el) {
      el.style.transform = 'translateY(100%)';
    },
    enter(el, done) {
      anime({
        targets: el,
        translateY: 0,
        duration: this.duration,
        easing: 'easeOutQuad',
        complete: done,
      });
    },
    leave(el, done) {
      anime({
        targets: el,
        translateY: '100%',
        duration: this.duration,
        easing: 'easeInQuad',
        complete: done,
      });
    },
  },
};
</script>
