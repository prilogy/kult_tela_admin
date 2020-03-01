<template>
  <v-content>
    <v-container
      fluid
      class="fill-height"
    >
      <v-row
        style="max-width: unset"
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>{{signUp ? 'Регистрация' : 'Вход'}}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" @submit="sendData">
                <v-text-field
                  v-model="first_name"
                  label="Имя"
                  name="fist_name"
                  type="text"
                  :rules="textRules"
                  v-if="signUp"
                  required
                />
                <v-text-field
                  v-model="last_name"
                  label="Фамилия"
                  name="fist_name"
                  type="text"
                  :rules="textRules"
                  v-if="signUp"
                  required
                />
                <v-text-field
                  v-model="email"
                  label="email"
                  name="login"
                  :rules="emailRules"
                  prepend-icon="mdi-account"
                  type="email"
                  required
                />

                <v-text-field
                  v-model="password"
                  id="password"
                  label="Пароль"
                  name="password"
                  :rules="passwordRules"
                  prepend-icon="mdi-lock"
                  required
                  @click:append="showPassword = !showPassword"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                />
                <v-select
                  v-if="signUp"
                  v-model="role"
                  :items="roles.map(e => e.name)"
                  filled
                  required
                  :rules="textRules"
                  label="Выберите должность"
                ></v-select>
                <v-textarea v-model="description" v-if="signUp" rows="1" auto-grow
                            label="Описание (для наставников)"></v-textarea>

                <v-text-field
                  required
                  v-if="signUp"
                  v-model="secret"
                  :rules="textRules"
                  id="secret"
                  label="Секретный код"
                  name="secret"
                  type="text"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="switchWindow">{{signUp ? 'Войти' : 'Зарегистрироваться'}}</v-btn>
              <v-spacer/>
              <v-btn @click="validateForm" :disabled="!valid" color="primary">{{signUp ? "Подтвердить регистрацию" :
                "Войти"}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
  export default {
    layout: 'noAuth',
    data: () => ({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      secret: '',
      signUp: false,
      valid: null,
      role: '',
      description: '',
      roles: [],
      emailRules: [
        v => !!v || 'email обязателен',
        v => /.+@.+\..+/.test(v) || 'Неправильный email',
      ],
      passwordRules: [
        v => !!v || 'Пароль обязателен',
        v => v.length > 5 || 'Минимум 6 символов'
      ],
      textRules: [
        v => !!v || 'Поле обязательно'
      ],
      showPassword: false
    }),
    methods: {
      async sendData() {
        let result

        let data = {
          email: this.email,
          password: this.password
        }
        if (this.signUp) {
          data.first_name = this.first_name
          data.last_name = this.last_name
          data.role_id = this.roles.filter(e => e.name === this.role)[0].value
          data.secret = this.secret
          data.description = this.description

          result = await this.$api.Auth.signUp(data)
          this.$notifier.showMessage({ message: result.data, type: 'success' })
          this.switchWindow()
        } else {
          await this.$store.dispatch('auth/LOGIN', data)

        }
      },
      validateForm() {
        if (this.$refs.form.validate()) {
          this.sendData()
        }
      },
      switchWindow() {
        this.signUp = !this.signUp
        if (this.signUp === true)
          this.password = ''
      }
    },
    async asyncData(ctx) {
      try {
        const { data: roles } = await ctx.app.$api.Roles.getAll()
        return { roles }
      } catch (e) {
        this.$notifier.showMessage({ type: 'error', message: 'Ошибка загрузки данных' })
      }
    }
  }
</script>
