<template>
  <v-col
    class="fill-height ma-0 pa-4"
  >
    <v-col class="pa-0">
      <v-card>
        <v-card-title class="headline">
          Добро пожаловать в панель управления Культ Тела!
        </v-card-title>
        <v-card-text>
          <p>В меню слева вы можете найти все доступные вам разделы администрирования.</p>
        </v-card-text>
      </v-card>
    </v-col>
    <div class="grid-wrapper mt-4">
      <div class="cards-grid">
        <v-card :key="card.id" :to="card.url" class="cards-grid__item" v-for="card in cards" v-ripple>
          <v-card-title class="pb-4">
            <v-row class="ma-0 pa-0" justify="center">
              <v-icon :color="card.color + ' lighten-2'" size="64">
                {{card.icon}}
              </v-icon>
            </v-row>
          </v-card-title>
          <v-card-subtitle :class="'font-weight-medium text-center pt-4 ' + card.color + '--text text--darken-1'">
            {{card.title}}
          </v-card-subtitle>
        </v-card>
      </div>
    </div>

  </v-col>
</template>

<script>
  export default {
    data: () => ({
      cards: [
        { id: 0, title: 'Редактировать профиль', icon: 'mdi-pencil', color: 'blue', url: '/edit' }
      ]
    })
  }
</script>


<style scoped>
  .grid-wrapper {
    flex: 1 0 auto;
    max-width: 100%;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, min-content));
    grid-template-rows: repeat(auto-fill, minmax(150px, min-content));
    grid-gap: 10px;
  }

  .cards-grid__item {
    cursor: pointer;
    user-select: none;
  }
</style>
