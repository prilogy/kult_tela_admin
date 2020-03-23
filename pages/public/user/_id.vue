<template>
  <v-row justify="start" class="flex-wrap ma-0 pa-4">
    <v-col sm="auto" align-self="start" class="pa-0 mb-4 col-12 col-sm-5 col-md-4 col-lg-3">
      <v-img style="margin: 0 auto; border-radius: 4px" alt="avatar" :src="user.avatar_src"/>
      <p class="title my-2">{{user.name}}</p>
      <v-simple-table dense>
        <template v-slot:default>
          <tbody>
          <tr v-for="item in userInfo">
            <td class="py-2 font-">{{item.title}}</td>
            <td class="py-1 font-weight-medium">{{item.value}}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-btn block :to="'/messages/' + this.user.id" dark color="blue" class="mt-2">Написать сообщение
      </v-btn>
    </v-col>
    <div class="ml-sm-3 grid-wrapper">
      <div class="cards-grid">
        <WeightHistory :user="user"></WeightHistory>
        <FoodReports :user="user"></FoodReports>
        <WorkoutInfo :user="user"></WorkoutInfo>
      </div>
    </div>
  </v-row>
</template>

<script>
  import { WeightHistory, FoodReports, WorkoutInfo } from "../../../components/pages/public/user";
  import dateFuncs from "../../../mixins/dateFuncs";

  export default {
    mixins: [dateFuncs],
    components: { FoodReports, WeightHistory, WorkoutInfo },
    data() {
      return {
        user: null
      };
    },
    methods: {},
    computed: {
      userInfo() {
        const user = this.user;
        if (user) {
          const weight_diff = Math.ceil(user.weight_diff * 10) / 10 || 0;
          return [
            { title: "email", value: user.email },
            { title: "Начальный вес", value: user.weight_start + " кг" },
            {
              title: "Текущий вес",
              value: `${user.weight_start - weight_diff}${
                weight_diff > 0 ? "(-" + weight_diff + ")" : ""
              } кг`
            },
            {
              title: "Рост",
              value: user.height + " см"
            },
            { title: "Возраст", value: user.age },
            { title: "Дата регистрации", value: this.convertDate(user.date_signup).date },
            { title: "Окончание подписки", value: this.convertDate(user.subscription_exp).date },
            { title: "План", value: user.plan_name },
            { title: "Звание", value: user.rank },
            { title: "ID наставника", value: user.tutor_id || "Нет" },
            { title: "ID меню питания", value: user.food_menu_id || "Нет" }
          ];
        }
        return [];
      }
    },
    async asyncData({ params, redirect, app }) {
      try {
        const { data: user } = await app.$api.Public.getUserById(params.id);
        return { user };
      } catch (e) {
        app.$notifier.showMessage({ message: "Пользователь не существует", type: "error" });
        redirect("/");
      }

    }
  };
</script>

<style scoped>
  .grid-wrapper {
    flex: 1 0 auto;
    max-width: 100%;
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
