<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <p class="grey--text" v-if="CHATS.length === 0">
      У вас пока нет чатов
    </p>
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
      if ([0, 1].includes(store.getters['chat/GET_CHATS'].length)) {
        store.dispatch('chat/FEED_CHATS')
      }
    }
  }
</script>
