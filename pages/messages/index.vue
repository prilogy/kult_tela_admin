<template>
  <v-layout
    column
    justify-center
    align-center
  >
  </v-layout>
</template>

<script>
  export default {
    computed: {
      CHATS() {
        return this.$store.getters['chat/GET_CHATS']
      },
    },
    fetch({ store }) {
      console.log('ere')
      if ([0, 1].includes(store.getters['chat/GET_CHATS'].length)) {
        store.dispatch('chat/FEED_CHATS')
      }
    }
  }
</script>
