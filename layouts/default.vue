<template>
  <v-app style="margin-top: 56px">
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
      elevate-on-scroll
      dark
      color="blue darken-2"
      fixed
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>

      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <p class="ma-0 mr-1">{{USER.first_name + ' ' + USER.last_name}}</p>
      <v-btn @click="logOut" icon>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt/>
      </v-container>
    </v-content>

    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} Культ Тела</span>
    </v-footer>
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
        items: [
          {
            icon: 'mdi-apps',
            title: 'Welcome',
            to: '/'
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Inspire',
            to: '/inspire'
          }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Vuetify.js'
      }
    },
    computed: {
      CATEGORIES() {
        const admin_role_id = this.$store.state.user.user.admin_role_id
        console.log(admin_role_id)
        return this.$store.getters['nav/GET_CATEGORIES'].filter(e => !e.roles || e.roles.includes(admin_role_id))
      },
      USER() {
        return this.$store.getters['user/GET_USER']
      }
    },
    methods: {
      logOut() {
        this.$store.dispatch('auth/LOGOUT')
      }
    }
  }
</script>
