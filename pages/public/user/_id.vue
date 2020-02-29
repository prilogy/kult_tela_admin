<template>
  <v-row justify="start" class="flex-wrap ma-0 pa-4">
    <v-col sm="auto" align-self="start" class="pa-0 mb-4 col-12 col-sm-5 col-md-4 col-lg-3">
      <v-img style="margin: 0 auto" alt="avatar" :src="user.avatar_src"/>
      <v-col class="pa-0 ml-0 mt-4">
        <p class="title">{{user.name}}</p>
        <ul class="list mt-2">
          <li v-for="item in userInfo">
            <p><span class="font-weight-medium">{{item.title}}</span> {{item.value}}</p>
          </li>
        </ul>
      </v-col>
      <v-btn block :to="'/messages/' + this.user.id" dark color="blue" class="mt-2">Написать сообщение
      </v-btn>
    </v-col>
    <div class="ml-sm-4 grid-wrapper">
      <div class="cards-grid">
        <v-card
        >
          <v-card-text class="">
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
            <span class="caption grey--text font-weight-light">Последнее обновление <span
              class="black--text font-weight-regular">{{user.weight_history[user.weight_history.length - 1].date}}</span></span>
          </v-card-text>
        </v-card>
      </div>
    </div>

  </v-row>
</template>

<script>
  export default {
    data() {
      return {
        user: null
      }
    },
    methods: {},
    computed: {
      weightHistory() {

        if (this.user) {
          let values = this.user.weight_history.map(e => e.weight)
          if (values.length === 1)
            values.push(values[0])
          return { values }
        }
      },
      userInfo() {
        const user = this.user
        if (user) {
          const weight_diff = Math.ceil(user.weight_diff * 10) / 10 || 0
          return [
            { title: 'Начальный вес', value: user.weight_start + ' кг' },
            {
              title: 'Текущий вес',
              value: `${user.weight_start - weight_diff}${
                weight_diff > 0 ? '(-' + weight_diff + ')' : ''
              } кг`
            },
            {
              title: 'Рост',
              value: user.height + ' см'
            },
            { title: 'Дата регистрации', value: user.date_signup },
            { title: 'План', value: user.plan_name }
          ]
        }
        return []
      }
    },
    async asyncData({ params, redirect, app }) {
      try {
        const { data: user } = await app.$api.Public.getUserById(params.id)
        return { user }
      } catch (e) {
        app.$notifier.showMessage({ message: 'Пользователь не существует', type: 'error' })
        redirect('/')
      }

    }
  }
</script>

<style scoped>
  .grid-wrapper {
    flex: 1 0 auto;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 10px;
  }

  p {
    margin: 0;
  }

  .list {
    list-style: none;
    padding: 0;

  }

  .list li {
    line-height: 1.4;
  }

</style>
