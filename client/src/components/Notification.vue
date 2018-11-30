<!-- eslint-disable max-len -->
<template>
  <div class="fixed pin-b pin-x bg-white p-4 text-grey-darkest border-t border-grey-light">
    <div class="flex w-full justify-between items-center">
      <div class="hidden lg:flex" />
      <div class="flex mr-6">
        <span
          :class="{ 'text-red': notification.type === 'error' }"
          class="mr-2"
        >
          {{ $t(notification.type) }}
        </span>{{ $t(notification.text) }}
      </div>
      <div class="flex self-start">
        <button
          class="flex items-center px-3 py-2 text-grey-dark"
          aria-label="Close notification"
          @click="removeNotification()"
        >
          <svg
            class="fill-current h-4 w-4"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "error": "Error",
    "%SOMETHING_WENT_WRONG%": "Something went wrong. Please try again."
  },
  "fr": {
    "error": "Erreur",
    "%SOMETHING_WENT_WRONG%": "Une erreur est survenue. Merci de réessayer."
  },
  "es": {
    "error": "Error",
    "%SOMETHING_WENT_WRONG%": "Ha ocurrido un error. Por favor, inténtalo de nuevo."
  }
}
</i18n>

<script>
export default {
  name: 'Notification',
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },

  methods: {
    removeNotification() {
      this.$emit('removeNotification');
    },
  },
};
</script>
