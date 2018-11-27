<template>
  <div class="overlay absolute pin z-20">
    <div class="flex items-center justify-center w-full h-full">
      <div class="progress-square w-12 h-12 relative border-solid border-4 border-green-light">
        <div class="loader w-full inline-block align-top bg-green-light opacity-100" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style scoped>
.overlay {
  background-color:rgba(0, 0, 0, 0.6);
}

.progress-square {
  animation: loader 3s infinite ease;
}

.loader {
  animation: loader-inner 3s infinite ease-in;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(180deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loader-inner {
  0% {
    height: 0%;
  }

  25% {
    height: 0%;
  }

  50% {
    height: 100%;
  }

  75% {
    height: 100%;
  }

  100% {
    height: 0%;
  }
}
</style>
