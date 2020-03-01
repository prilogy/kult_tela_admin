<template>
  <v-card
  >
    <v-card-text>
      <div class="title font-weight-medium mb-2">Физические данные</div>
      <p class="black--text subtitle ma-0 font-weight-medium">Уровни</p>
      <v-simple-table dense>
        <template v-slot:default>
          <tbody>
          <tr v-for="item in workoutLevels">
            <td class="py-2 font-">{{item.title}}</td>
            <td class="py-1 font-weight-medium">{{item.value}}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider class="my-2"></v-divider>
      <span class="caption grey--text">Тренировочный план начат <span
        class="black--text">{{workout.start_date}}</span></span>
    </v-card-text>
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
    computed: {
      workout() {
        return this.user.workout
      },
      workoutLevels() {
        return [
          { title: 'Физическая подготовка', value: this.workout.physical_level },
          { title: 'Избыточный вес', value: this.workout.overweight_level }
        ]
      }
    }
  }
</script>
