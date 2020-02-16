<template>
  <v-app>
    <nuxt></nuxt>
  </v-app>
</template>

<script>
  export default {
    middleware: 'requireNonAuth'
  }
</script>
