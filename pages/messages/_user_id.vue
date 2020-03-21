<template>
  <v-layout class="fill-height" column v-if="CHAT && chatf">
    <v-toolbar flat color="blue darken-3">
      <v-row class="px-2" align="center">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <nuxt-link :to="!CHAT.conversation ? '/public/user/' + user.id : ''">
              <v-list-item-avatar v-on="!CHAT.conversation ? on : ''" class="mr-0 user-avatar">
                <v-img :src="chatf.avatar_src || '/v.png'"></v-img>
              </v-list-item-avatar>
            </nuxt-link>
          </template>
          <span>Перейти в профиль</span>
        </v-tooltip>

        <v-col>
          <p class="mb-0 white--text">{{chatf.name}}</p>
          <p style="opacity: 0.7"
             :class="{'mb-0':true, 'body-2':true, 'white--text': true}">
            {{chatf.status.text }}</p>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-container ref="messages" fluid class="chat-section pa-0 blue lighten-5 fill-height">
      <div class="chat-section__inner pa-2">
        <ul class="pa-0 col-12">
          <li v-show="!history_is_full">
            <v-row class="mb-2 mx-0 px-0" justify="center">
              <v-btn @click="loadHistory" color="blue" class="white--text">
                <v-icon class="mr-1">mdi-history</v-icon>
                Загрузить историю
              </v-btn>
            </v-row>

          </li>
          <template v-for="(message, index) in CHAT.messages">
            <li>
              <MessageBox :user="CHAT.users.filter(e => e.id === message.user_id)[0]"
                          :conversation="CHAT.conversation || false" :message="message">
              </MessageBox>
              <div
                class="messages__date mx-n2 px-2"
                v-if="
            CHAT.messages[index + 1] &&
              CHAT.messages[index].date.date !==
                CHAT.messages[index + 1].date.date
          "
              >
                <p class="font-weight-bold grey--text text--darken-2">
                  {{ getAlias(CHAT.messages[index + 1].date.date) }}
                </p>
              </div>
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
  import dateFuncs from '../../mixins/dateFuncs'

  export default {
    mixins: [dateFuncs],
    components: { MessageBox },
    data() {
      return {
        message: '',
        history_is_full: false
      }
    },
    methods: {
      sendMessage() {
        this.$store.dispatch('chat/SEND_MESSAGE', {
          text: this.message,
          to_user_id: this.user ? this.user.id : null,
          room_id: this.CHAT.id,
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
        if (this.CHAT.history_is_full)
          this.history_is_full = true
        if (!this.CHAT.history_is_full)
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
      chatf() {
        const chat = this.CHAT
        const user = this.user
        return {
          name: chat.name || user.name,
          avatar_src: user
            ? user.avatar_src
            : chat.conversation
              ? chat.image_src || null
              : null,
          status: {
            text: user
              ? user.status
                ? 'онлайн'
                : 'не в сети'
              : chat.conversation
                ? chat.user_ids.length + ' участников'
                : '',
            bool: user ? user.status : false
          }
        }
      },
      user() {
        return this.CHAT && !this.CHAT.conversation
          ? this.CHAT.users.filter(e => e.id !== this.ME.id)[0]
          : null
      },
      ...mapGetters({
        CHAT: 'chat/GET_CURRENT_CHAT',
        ME: 'user/GET_USER'
      })
    },
    async fetch({ store, params, redirect }) {
      let user_id = params.user_id,
        conversation = false

      if (user_id.toString().indexOf('c') !== -1) {
        user_id = parseInt(user_id.slice(1))
        conversation = true
      } else user_id = parseInt(user_id)

      const index = store.state.chat.chats
        .map(item => item.user_id)
        .indexOf(user_id)
      try {
        if (index === -1 || store.state.chat.chats[index].messages.length <= 20) {
          await store.dispatch('chat/FEED_CHAT_WITH_USER_ID', {
            id: user_id,
            setAsCurrent: true,
            conversation
          })
        } else {
          let id
          if (conversation) id = user_id
          else {
            id = this.$store.getters['chat/GET_CHATS'].filter(
              e => e.user_ids.includes(user_id) && e.user_ids.length === 2
            )[0].id
          }
          await store.dispatch('chat/SET_CURRENT_CHAT_FROM_CHATS', id)
        }
      } catch (e) {
        redirect('/messages')
      }
    },
    watch: {
      CHAT: {
        deep: true,
        handler() {
          if (this.CHAT.history_is_full)
            this.history_is_full = true
          this.$nextTick(() => {
            if (this.shouldScrollToBottom())
              this.scrollTo({ toBottom: true })
          })
        }
      }
    },
    async mounted() {
      if (this.CHAT && this.CHAT.history_is_full)
        this.history_is_full = true
      this.$nextTick(() => {
        this.scrollTo({ toBottom: true })
      })
      document.addEventListener('keypress', () => {
        this.focusOnMessageInput()
      })
      await this.$store.dispatch('chat/SET_LAST_SEEN_MESSAGE')
    },
    destroyed() {
      this.$store.dispatch('chat/RETURN_CURRENT_CHAT')
    }
  }
</script>

<style scoped>
  .messages__date {
    margin: 0;
    width: 100%;
    text-align: center;
  }

  .messages__date p {
    font-weight: 500 !important;
  }

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
