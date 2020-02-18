<template>
  <v-layout column>
    <v-toolbar flat color="blue lighten-5">
      <v-row align="center">
        <v-list-item-avatar>
          <v-img :src="CHAT.user.avatar_src"></v-img>
        </v-list-item-avatar>
      </v-row>
    </v-toolbar>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    methods: {
      messagesScrolled(scrollPos) {
        if (scrollPos < 1000) {
          this.$store.dispatch('chat/LOAD_MESSAGES_HISTORY')
        }
      },
      sendMessage(text) {
        this.$store.dispatch('chat/SEND_MESSAGE', {
          text,
          to_user_id: this.CHAT.user_id
        })
      },
      scrollTo({ height, toBottom }) {
        const el = this.$refs.messages
        el.scrollTop = toBottom
          ? (el.scrollTop = el.childNodes[0].clientHeight)
          : height
      },
    },
    computed: {
      ...mapGetters({
        CHAT: 'chat/GET_CURRENT_CHAT',
        ME: 'user/GET_USER'
      })
    },
    async fetch({ store, params, redirect }) {
      const user_id = parseInt(params.user_id)
      console.log(user_id)
      const index = store.state.chat.chats
        .map(item => item.user_id)
        .indexOf(user_id)
      try {
        if (index === -1 || store.state.chat.chats[index].messages.length <= 20) {
          await store.dispatch('chat/FEED_CHAT_WITH_USER_ID', {
            id: user_id,
            setAsCurrent: true
          })
        } else {
          await store.dispatch('chat/SET_CURRENT_CHAT_FROM_CHATS', user_id)
        }
      } catch (e) {
        redirect('/messages')
      }
    },
    async mounted() {
      this.$nextTick(() => {
        //this.scrollTo({ toBottom: true })
      })
      document.addEventListener('keypress', () => {
        this.focusOnMessageInputArea()
      })

      // const el = this.$refs.messages
      //
      // let debounce_timer
      // el.addEventListener('scroll', () => {
      //   if (debounce_timer) {
      //     clearTimeout(debounce_timer)
      //   }
      //
      //   debounce_timer = setTimeout(() => {
      //     this.messagesScrolled(el.scrollTop)
      //   }, 100)
      // })

      await this.$store.dispatch('chat/SET_LAST_SEEN_MESSAGE')
    },
    destroyed() {
      document.removeEventListener('keypress', () => {
      })
      this.$store.dispatch('chat/RETURN_CURRENT_CHAT')
    }
  }
</script>
