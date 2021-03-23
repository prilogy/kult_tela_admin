<template>
  <v-list-item
    v-if="user && chatf"
    :to="link"
    :class="{'blue lighten-4': chatf.lastMessage && chatf.lastMessage.user_id !== chatf.currentUserId && chat.last_seen_message_id < chatf.lastMessage.id}"
  >
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <nuxt-link :to="user ? '/public/user/' + user.id : ''">
          <v-list-item-avatar v-on="chatf.avatar.src ? on : ''" class="mr-0 user-avatar">
            <v-img :src="chatf.avatar.src || 'v.png'"></v-img>
          </v-list-item-avatar>
        </nuxt-link>
      </template>
      <span>Перейти в профиль</span>
    </v-tooltip>


    <v-list-item-content>
      <v-layout>
        <v-col class="pa-0 ml-3">
          <v-list-item-title v-text="chatf.name"></v-list-item-title>
          <v-list-item-subtitle
            v-text="chatf.lastMessageText"></v-list-item-subtitle>
        </v-col>
        <v-btn icon>
          <v-icon color="blue">mdi-message</v-icon>
        </v-btn>
      </v-layout>

    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    props: {
      chat: { type: Object, required: true }
    },
    computed: {
      link() {
        if (this.chat.conversation) return '/messages/c' + this.chat.id
        else {
          return '/messages/' + this.user.id
        }
      },
      chatf() {
        const chat = this.chat
        const user =
          chat &&
          chat.users.filter(
            e => e.id !== this.$store.getters['user/GET_USER'].id
          )[0]

        const currentUserId = this.$store.getters['user/GET_USER'].id

        const lastMessage =
          chat.messages && chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : null

        const adminMark =
          user && typeof user.admin_role_id === 'number' ? true : null

        return {
          adminMark,
          avatar: {
            admin_role_id:
              !chat.conversation &&
              user && user.admin_role_id && typeof user.admin_role_id === 'number',
            src: chat.conversation
              ? chat.image_src || null
              : user
                ? user.avatar_src
                : null
          },
          name: chat.name || user.name,
          date: lastMessage ? lastMessage.date : null,
          lastMessageText: lastMessage
            ? (lastMessage.user_id === currentUserId
            ? 'Вы: '
            : chat.conversation
              ? chat.users.filter(e => e.id === lastMessage.user_id)[0].name +
              ': '
              : '') + lastMessage.text
            : 'Нет сообщений',
          lastMessage,
          currentUserId,
          showUnreadMessages:
            (user &&
              lastMessage &&
              lastMessage.user_id !== currentUserId &&
              chat.last_seen_message_id !== lastMessage.id) ||
            null
        }
      },
      user() {
        return this.chat.conversation
          ? null
          : this.chat.users.filter(
            e => e.id !== this.$store.getters['user/GET_USER'].id
          )[0]
      }
    }
  }
</script>
