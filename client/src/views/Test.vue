<template>
  <div>
    <h1>Fetch a value from the server</h1>
    <p>{{ value }}</p>
  </div>
</template>

<script>
import TestService from '@/services/TestService'

export default {
  name: 'test',
  data () {
    return {
      value: 'Waiting for value...'
    }
  },
  mounted () {
    this.fetchValueFromServer()
  },
  methods: {
    async fetchValueFromServer () {
      const response  = await TestService.fetchValueFromServer()
      this.value = response.data.value
    }
  }
}
</script>
