<template>
  <v-row justify="start" class="fill-height ma-0">
    <v-col xs="12" sm="auto" align-self="start" class="grey lighten-3 mt-n2 ml-n2 pa-2">
      <v-avatar size="164" height="100%" tile>
        <img alt="avatar" :src="user.avatar_src"/>
      </v-avatar>
      <v-col class="pa-0 ml-0 mt-4">
        <p>{{user.name}}</p>
        <ul class="list">
          <li v-for="item in userInfo">
            <p><span class="font-weight-medium">{{item.title}}</span> {{item.value}}</p>
          </li>
        </ul>
      </v-col>
      <v-btn :to="'/messages/' + this.user.id" dark color="blue" class="mt-2">Написать сообщение
      </v-btn>
    </v-col>
    <v-col>ДАННЫЕ</v-col>
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
