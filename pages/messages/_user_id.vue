<template>
  <v-layout column v-if="CHAT">
    <v-toolbar flat color="blue darken-3">
      <v-row class="px-2" align="center">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-list-item-avatar v-on="on" class="mr-0 user-avatar">
              <v-img @click="$router.push('/public/user/' + CHAT.user.id)" :src="CHAT.user.avatar_src"></v-img>
            </v-list-item-avatar>
          </template>
          <span>Перейти в профиль</span>
        </v-tooltip>

        <v-col>
          <p class="mb-0 white--text">{{CHAT.user.name}}</p>
          <p style="opacity: 0.7"
             :class="{'mb-0':true, 'body-2':true, 'white--text': !CHAT.user.status, 'green--text': CHAT.user.status}">
            {{CHAT.user.status ? 'Онлайн' : 'Не в сети'}}</p>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-container ref="messages" fluid class="chat-section pa-0 blue lighten-5 fill-height">
      <div class="chat-section__inner pa-2">
        <ul class="pa-0 col-12">
          <li>
            <v-row class="mb-2" justify="center">
              <v-btn @click="loadHistory" color="blue" class="white--text">
                <v-icon class="mr-1">mdi-history</v-icon>
                Загрузить историю
              </v-btn>
            </v-row>

          </li>
          <template v-for="message in CHAT.messages">
            <li>
              <MessageBox :message="message"></MessageBox>
            </li>

          </template>
        </ul>
      </div>

    </v-container>
    <v-container fluid class="message-input">
      <v-row class="mx-0">
        <v-textarea ref="message_input" v-model="message" rows="1" outlined auto-grow>
        </v-textarea>
        <v-btn @click="sendMessage" :disabled="!message" icon>
          <v-icon color="blue">mdi-send</v-icon>
        </v-btn>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MessageBox from '../../components/pages/messages/MessageBox'

  export default {
    components: { MessageBox },
    data() {
      return {
        message: ''
      }
    },
    methods: {
      sendMessage() {
        this.$store.dispatch('chat/SEND_MESSAGE', {
          text: this.message,
          to_user_id: this.CHAT.user_id
        })
        this.message = ''
      },
      scrollTo({ height, toBottom }) {
        const el = this.$refs.messages
        el.scrollTop = toBottom
          ? el.childNodes[0].childNodes[0].clientHeight
          : height
      },
      focusOnMessageInput() {
        if (this.$refs.message_input)
          this.$refs.message_input.focus()
      },
      loadHistory() {
        this.$store.dispatch('chat/LOAD_MESSAGES_HISTORY')
      },
      shouldScrollToBottom() {
        const el = this.$refs.messages
        const msgs = el.childNodes[0].childNodes[0]

        const scrollTop = this.$refs.messages.scrollTop + 640
        return scrollTop >= msgs.clientHeight - 300
      }
    },
    computed: {
      ...mapGetters({
        CHAT: 'chat/GET_CURRENT_CHAT',
        ME: 'user/GET_USER'
      })
    },
    async fetch({ store, params, redirect }) {
      const user_id = parseInt(params.user_id)
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
    watch: {
      CHAT: {
        deep: true,
        handler() {
          this.$nextTick(() => {
            if (this.shouldScrollToBottom())
              this.scrollTo({ toBottom: true })
          })
        }
      }
    },
    async mounted() {
      this.$nextTick(() => {
        this.scrollTo({ toBottom: true })
      })
      document.addEventListener('keypress', () => {
        this.focusOnMessageInput()
      })
      await this.$store.dispatch('chat/SET_LAST_SEEN_MESSAGE')
    },
    destroyed() {
      document.removeEventListener('keypress', () => {
      })
      this.$store.dispatch('chat/RETURN_CURRENT_CHAT')
    }
  }
</script>

<style scoped>
  .chat-message {
    border-radius: 5px;
  }

  .chat-section {
    position: relative;
    overflow-y: scroll;

  }

  .chat-section__inner {
    position: absolute;
    width: 100%;
    height: 100%;
  }


  .chat-section::-webkit-scrollbar {
    display: none;
  }

  .user-avatar {
    cursor: pointer;
  }

  .user-avatar:hover {
    box-shadow: 0 2px 10px #00000022;
  }

  .message-input >>> .v-text-field__details {
    display: none !important;
  }

  .message-input >>> .v-input__slot {
    margin: 0;
  }
</style>
