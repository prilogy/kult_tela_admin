<template>
  <v-row :justify="isMy ? 'end': 'start'"
         class="message-wrapper mb-2 ma-0"
  >
    <v-col align="end"
           :class="{message: true, 'pa-2': true, 'message--my': isMy}">
      <nuxt-link class="message__name" v-if="conversation && !isMy" :to="'/public/user/' + user.id">
        <p>{{user.name}}</p>
      </nuxt-link>

      <p class="message__text ma-0">{{message.text}}</p>
      <div class="message__attachments" v-if="message.attachments">
        <img :src="item.src" v-for="item in message.attachments"/>
      </div>
      <p class="message__date body-2 ma-0">{{message.time}}</p>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      message: Object,
      conversation: Boolean,
      user: Object
    },
    computed: {
      isMy() {
        return this.message.user_id === this.$store.state.user.user.id
      }
    }
  }
</script>

<style scoped lang="scss">
  .message {
    padding: 0;
    margin: 0;
    border-radius: 5px;
    flex-grow: unset;
    flex-basis: unset;
    width: fit-content;
    max-width: 77%;
    box-shadow: 0 1px 3px #15314D33;
    word-break: break-word;
    text-align: left;
    background: white;
  }

  .message__text {
    width: fit-content;
    white-space: pre-line;
  }

  .message__date {
    opacity: 0.6;
  }

  .message__name {
    font-weight: 500;

    text-align: left;
    text-decoration: none !important;
  }

  .message__name p {
    margin: 0;
  }

  .message--my {
    background: #2196F3;
  }

  .message--my .message__text, .message--my .message__date {
    color: white;
  }


  .message__attachments img {
    max-width: 100%;
    border-radius: 5px;
    margin-top: 5px;
  }

</style>
