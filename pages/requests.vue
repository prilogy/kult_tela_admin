<template>
  <v-col align-self="start" class="pa-0">
    <v-row class="mx-2">
      <v-btn-toggle
        v-model="switcher"
        color="blue"
        group
      >
        <v-btn value="new">
          Новые заявки
        </v-btn>

        <v-btn value="history">
          История
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-row>

    <v-data-table :search="search" :items="switcher === 'new' ? requests: history_requests"
                  :headers="headers" hide-default-footer>

      <template v-slot:no-data>
        Список заявок пуст
      </template>
      <template v-slot:no-results>
        Нет найденных заявок
      </template>
      <template v-slot:item.user_name="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <p style="cursor: pointer" @click="$router.push('/public/user/' + item.user_id)" class="blue--text ma-0"
               v-on="on">
              {{item.user_name}}</p>
          </template>
          <span>На страницу пользователя</span>
        </v-tooltip>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="formatRequestStatus(item.status, true)">
          {{formatRequestStatus(item.status)}}
        </v-chip>

      </template>

      <template v-slot:item.payment_status=" { item }
        ">
        <v-chip :color="formatPaymentStatus(item.payment_status, true)">
          {{formatPaymentStatus(item.payment_status)}}
        </v-chip>
      </template>

      <template v-slot:item.action="{ item }">
        <template v-if="switcher === 'new'">
          <v-icon color="success" :disabled="item.payment_status !== 'succeeded'"
                  @click="setStatus(item, 1)">mdi-check
          </v-icon>
          <v-icon color="error" :disabled="item.payment_status !== 'canceled'" @click="setStatus(item, -1)">
            mdi-delete-forever
          </v-icon>
        </template>
        <template v-else>
          <p class="grey--text ma-0">Недоступно</p>
        </template>

      </template>
    </v-data-table>
  </v-col>
</template>

<script>
  export default {
    data() {
      return {
        switcher: 'new',
        requests: [],
        history_requests: [],
        search: '',
        headers: [
          {
            text: 'Пользователь',
            align: 'left',
            sortable: false,
            value: 'user_name'
          },
          {
            text: 'Тьютор',
            align: 'left',
            sortable: true,
            value: 'tutor'
          },
          {
            text: 'Дата от',
            align: 'left',
            sortable: true,
            value: 'date_from'
          },
          {
            text: 'Дата до',
            align: 'left',
            sortable: true,
            value: 'date_to'
          },
          {
            text: 'Дата заявки',
            align: 'left',
            sortable: true,
            value: 'date'
          },
          {
            text: 'Статус',
            align: 'left',
            sortable: true,
            value: 'status'
          },
          {
            text: 'Статус платежа',
            align: 'left',
            sortable: true,
            value: 'payment_status'
          },
          {
            text: 'Действия',
            align: 'center',
            sortable: false,
            value: 'action'
          }
        ]
      }
    },
    watch: {
      switcher() {
        if (this.switcher === 'history' && this.history_requests.length === 0)
          this.loadHistory()
      }
    },
    methods: {
      async loadHistory() {
        const r = await this.$api.Request.getAllHistory()
        this.history_requests = r.data
      },
      formatPaymentStatus(v, color = false) {
        if (color === false) {
          const formats = {
            'pending': 'Ожидание',
            'succeeded': 'Оплачен',
            'canceled': 'Отменен'
          }
          return formats[v] || 'Ожидание'
        } else {
          const colors = {
            'pending': 'warning',
            'succeeded': 'success',
            'canceled': 'error'
          }
          return colors[v] || 'warning'
        }
      },
      formatRequestStatus(v, color = false) {
        if (color === false) {
          const formats = {
            0: 'Не обработано',
            1: 'Принято',
            '-1': 'Отказано'
          }
          return formats[v]
        } else {
          const colors = {
            0: 'warning',
            1: 'success',
            '-1': 'error',
          }
          return colors[v]
        }
      },
      async setStatus(request, status) {
        const action = status === -1 ? 'удалить' : 'подтвердить'
        let r = confirm(`Вы действительно хотите ${action} заявку?`)
        if (r === true) {
          try {
            const result = await this.$api.Request.setStatus({ id: request.id, status: status })
            if (result.success) {
              this.requests = this.requests.map(e => {
                if (e.id === request.id)
                  e.status = status
                return e
              })
              this.$notifier.showMessage({ message: 'Статус заявки успешно изменен', type: 'success' })
            }
          } catch (e) {
            this.$notifier.showMessage({ message: 'Ошибка изменения статуса', type: 'error' })
          }

        }
      }
    },
    async asyncData(ctx) {
      try {
        const { data: requests } = await ctx.app.$api.Request.getAllPending()
        return { requests }
      } catch (e) {
        this.$notifier.showMessage({ type: 'error', message: 'Ошибка загрузки заявок' })
      }
    }
  }
</script>
