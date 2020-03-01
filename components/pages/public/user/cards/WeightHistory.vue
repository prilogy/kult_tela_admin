<template>
  <v-card
  >
    <v-card-text>
      <div class="title font-weight-medium mb-2">Вес</div>
      <v-sheet
        color="cyan"
      >
        <v-sparkline
          :value="weightHistory.values"
          :labels="weightHistory.values"
          label-size="14"
          color="white"
          line-width="2"
          padding="16"
        ></v-sparkline>
      </v-sheet>
      <v-row class="ma-0 mt-1" justify="space-between">
        <p>При регистрации</p>
        <p>Сейчас</p>
      </v-row>
      <v-divider class="my-2"></v-divider>
      <v-icon
        class="mr-2"
        small
      >
        mdi-clock
      </v-icon>
      <span class="caption grey--text">Последнее обновление <span
        class="black--text">{{user.weight_history[user.weight_history.length - 1].date}}</span></span>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    props: {
      user: Object
    },
    computed: {
      weightHistory() {

        if (this.user) {
          let values = this.user.weight_history.map(e => e.weight)
          if (values.length === 1)
            values.push(values[0])
          return { values }
        }
      },
    }
  }
</script>
