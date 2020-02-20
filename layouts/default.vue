<template>
  <v-app>
    <Notifier></Notifier>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item @click.stop="miniVariant = !miniVariant">
          <v-list-item-action>
            <v-icon :color=" miniVariant ?  'blue' : ''">mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Только значки
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="CATEGORIES"
          v-for="(item, i) in CATEGORIES"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      fixed
      v-if="USER"
      elevation="0"
      dark
      color="blue darken-2"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="mr-2" icon @click="$router.back()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Предыдущая страница</span>
      </v-tooltip>

      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <v-toolbar-title class="body-2 mr-1" v-text="USER.first_name + ' ' + USER.last_name"/>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="logOut" icon>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </template>
        <span>Выйти из аккаунта</span>
      </v-tooltip>

    </v-app-bar>
    <v-content>
      <v-container fluid class="fill-height pa-0 pa-sm-2 pa-md-4">
        <nuxt/>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
  import { Notifier } from '../components/'

  export default {
    components: { Notifier },
    middleware: 'requireAuth',
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Главная'
      }
    },
    computed: {
      CATEGORIES() {
        const admin_role_id = this.$store.getters['user/GET_USER'] && this.$store.getters['user/GET_USER'].admin_role_id
        if (typeof admin_role_id === 'number')
          return this.$store.getters['nav/GET_CATEGORIES'].filter(e => !e.roles || e.roles.includes(admin_role_id))
        else return []
      },
      USER() {
        return this.$store.getters['user/GET_USER']
      }
    },
    watch: {
      '$route.path': function () {
        this.setTitle()
      }
    },
    methods: {
      setTitle() {
        console.log(this.$route.name)
        let category = this.CATEGORIES.filter(e => e.to === this.$route.path)[0]
        if (!category)
          category = this.CATEGORIES.filter(e => e.nested && e.nested.includes(this.$route.name))[0]

        this.title = category ? category.title : 'Панель управления'
      },
      logOut() {
        this.$store.dispatch('auth/LOGOUT')
      }
    },
    created() {
      const bp = this.$vuetify.breakpoint
      if (bp.md || bp.lg || bp.xl)
        this.drawer = true
      this.setTitle()
    }
  }
</script>
