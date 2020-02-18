<template>
  <v-snackbar
    v-model="show"
    top
    :color="color"
  >
    {{ message }}
    <v-btn
      dark
      text
      icon
      @click="show = false"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    data: () => ({
      show: false,
      message: '',
      color: 'error'
    }),
    created() {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'popup/SET_ERROR' || mutation.type === 'popup/SET_SUCCESS') {
          const msg = mutation.type === 'popup/SET_ERROR' ? state.popup.error : state.popup.success
          if (msg) {
            this.message = msg
            this.color = mutation.type === 'popup/SET_ERROR' ? 'error' : 'success'
            this.show = true
          } else this.show = false
        }
      })
    }
  }
</script>
