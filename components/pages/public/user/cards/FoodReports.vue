<template>
  <v-card
  >
    <v-card-text>
      <div class="title font-weight-medium mb-2">Отчеты по питанию</div>
      <v-simple-table dense v-if="user.food_reports && user.food_reports.length > 0">
        <template v-slot:default>
          <thead>
          <tr>
            <th>Тип</th>
            <th>Дата и время</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in user.food_reports">
            <td>{{item.type}}</td>
            <td>{{item.date}}</td>
            <td>
              <v-btn @click="toggleDialog(item)" icon>
                <v-icon color="blue">mdi-image</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-btn block elevation="0" color="grey lighten-3" small>Загрузить ещё</v-btn>
      <v-divider class="my-2"></v-divider>
      <span v-if="user.food_reports"
            class="caption grey--text">Последние {{user.food_reports.length}} отчета(-ов)</span>
      <span class="caption grey--text" v-else>Нет загруженных отчетов</span>
    </v-card-text>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span>{{dialog_report.type}}</span>
          <v-spacer></v-spacer>
          <span class="caption grey--text">{{dialog_report.date}}</span>
        </v-card-title>
        <v-card-text>
          <v-img :src="dialog_report.image_src"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="toggleDialog({}, true)"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  export default {
    props: {
      user: Object
    },
    data() {
      return {
        dialog: false,
        dialog_report: {}
      }
    },
    methods: {
      toggleDialog(item, close = false) {
        if (close === true) {
          this.dialog = false
          this.dialog_report = {}
        } else {
          this.dialog_report = item
          this.dialog = true
        }
      }
    },
    computed: {}
  }
</script>
