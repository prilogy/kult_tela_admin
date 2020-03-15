<template>
  <v-row justify="start" class="flex-wrap ma-0 pa-4">
    <div class="cards-grid" v-if="info">
      <v-card>
        <v-card-title>Статистика по пользователям</v-card-title>
        <v-card-text>
          <v-simple-table v-if="info.users_count">
            <template v-slot:default>
              <thead>
              <tr>
                <th>Пакет</th>
                <th>Кол-во пользователей</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in info.users_count">
                <td>{{item.plan_name}}</td>
                <td>{{item.count}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Email</v-card-title>
        <v-card-subtitle>Получить email всех пользователей</v-card-subtitle>
        <v-card-text>
          <v-textarea ro class="emails-textarea" v-model="emails" rows="6" outlined></v-textarea>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-row class="pa-0 ma-0">
            <v-text-field class="pt-0" v-model="divider" label="Разделитель email"></v-text-field>
            <v-btn dark class="ml-2" color="blue" @click="copyEmails">Скопировать всё</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
  </v-row>
</template>

<script>
  export default {
    data() {
      return {
        info: null,
        divider: ','
      }
    },
    computed: {
      emails() {
        if (this.info && this.info.emails) return this.info.emails.join(this.divider + ' ')
        else return 'Нет email'
      }
    },
    methods: {
      copyEmails() {
        const el = document.createElement('textarea')
        el.value = this.emails
        el.setAttribute('readonly', '')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        const selected =
          document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        if (selected) {
          document.getSelection().removeAllRanges()
          document.getSelection().addRange(selected)
        }

        this.$notifier.showMessage({ message: 'Скопировано в буфер обмена', type: 'success' })
      }
    },
    async asyncData(ctx) {
      try {
        const { data: info } = await ctx.$api.Stats.get()
        return {
          info
        }
      } catch (e) {
        ctx.$notifier.showMessage({ message: 'Не удалось загрузить статистику', type: 'error' })
      }

    }
  }
</script>

<style scoped>
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(min-content, 1fr));
    grid-gap: 10px;
    width: 100%;
  }

  .emails-textarea >>> .v-text-field__details {
    display: none !important;
  }
</style>
