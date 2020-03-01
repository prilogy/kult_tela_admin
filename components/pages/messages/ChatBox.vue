<template>
  <v-list-item
    @click="$router.push('/messages/'+chat.user_id)"
    :key="chat.user.name"
    :class="{'blue lighten-4': chat.messages[chat.messages.length - 1].user_id !== $store.getters['user/GET_USER'].id && chat.last_seen_message_id < chat.messages[chat.messages.length - 1].id}"
  >
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-list-item-avatar v-on="on" class="mr-0 user-avatar">
          <v-img @click="$router.push('/public/user/' + chat.user.id)" :src="chat.user.avatar_src"></v-img>
        </v-list-item-avatar>
      </template>
      <span>Перейти в профиль</span>
    </v-tooltip>

    <v-list-item-content>
      <v-layout>
        <v-col class="pa-0 ml-3">
          <v-list-item-title v-text="chat.user.name"></v-list-item-title>
          <v-list-item-subtitle
            v-text="(chat.messages[chat.messages.length - 1].user_id === $store.getters['user/GET_USER'].id ? 'Вы: ' : '')+chat.messages[chat.messages.length - 1].text"></v-list-item-subtitle>
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
    }
  }
</script>
