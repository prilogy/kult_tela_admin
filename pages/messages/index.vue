<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <p class="grey--text" v-if="CHATS.length === 0">
      У вас пока нет чатов
    </p>
    <v-container fluid class="pa-0" v-else>
      <v-list class="pt-0">
        <template v-for="(chat, index) in CHATS">
          <v-divider
            v-if="index !== 0"
            :key="index"
            inset
          ></v-divider>
          <chat-box :chat="chat"></chat-box>
        </template>
      </v-list>
    </v-container>

  </v-layout>
</template>

<script>
  import { ChatBox } from '../../components/pages/messages'

  export default {
    components: { ChatBox },
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
