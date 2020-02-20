<template>
  <v-row :justify="isMy ? 'end': 'start'"
         class="message-wrapper mb-2 ma-0"
  >
    <v-col align="end"
           :class="{message: true, 'pa-2': true, 'message--my': isMy}">
      <p class="message__text ma-0">{{message.text}}</p>
      <p class="message__date body-2 ma-0">{{message.time}}</p>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      message: Object
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

    background: white;
  }

  .message__text {
    width: fit-content;
    white-space: pre-line;
  }

  .message__date {
    opacity: 0.6;
  }

  .message--my {
    background: #2196F3;
  }

  .message--my .message__text, .message--my .message__date {
    color: white;
  }

</style>
