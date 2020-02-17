<template>
  <v-app>
    <Notifier></Notifier>
    <nuxt></nuxt>
  </v-app>
</template>

<script>
  import { Notifier } from '../components/'

  export default {
    middleware: 'requireNonAuth',
    components: { Notifier }
  }
</script>
