<template>
  <v-row class="pa-4 ma-0">
    <v-col class="ma-0 pa-0">
      <h2 class="blue--text font-weight-medium mb-4">Редактировать профиль</h2>
      <v-text-field v-model="first_name" label="Имя"></v-text-field>
      <v-text-field v-model="last_name" label="Фамилия"></v-text-field>
      <v-textarea rows="1" auto-grow v-model="admin_description" label="Описание"></v-textarea>
      <div v-if="!avatar_src" class="mb-2">
        <p class="grey--text text--darken-1">Текущий аватар</p>
        <v-img width="100%" contain max-height="300" :src="current_avatar_src"></v-img>
      </div>
      <v-file-input v-model="avatar_src" accept="image/*"
                    prepend-icon="mdi-camera"
                    label="Аватар"
                    placeholder="Загрузите новое фото"></v-file-input>

      <v-divider></v-divider>
      <v-btn @click="sendForm" :disabled="!validate" depressed color="blue" width="100%" :dark="validate" class="mt-4">
        <v-icon>mdi-save</v-icon>
        Сохранить изменения
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data() {
      return {
        first_name: '',
        last_name: '',
        admin_description: '',
        avatar_src: null,
        current_avatar_src: null
      }
    },
    methods: {
      async sendForm() {
        if (this.validate === true) {
          const form = new FormData()
          Object.keys(this.editedData).forEach(key => {
            form.append(key, this.editedData[key])
          })

          try {
            const result = await this.$api.Admin.edit(form)
            if (result.success === true) {
              this.$notifier.showMessage({ message: 'Данные успешно сохранены' })
              location.reload()
            }
          } catch (error) {
            this.$notifier.showMessage({ message: 'Не удалось сохранить данные, попробуйте позже', type: 'error' })
          }
        }
      },
    },
    computed: {
      editedData() {
        const user = this.$store.getters['user/GET_USER']
        let edited = {}
        const names = ['first_name', 'last_name', 'admin_description']

        names.forEach(name => {
          if (user[name] != this[name]) edited[name] = this[name]
        })
        if (this.avatar_src) edited.avatar_src = this.avatar_src

        return edited
      },
      validate() {
        return Object.keys(this.editedData).length > 0
      }
    },
    created() {
      const user = this.$store.getters['user/GET_USER']
      this.first_name = user.first_name
      this.last_name = user.last_name
      this.admin_description = user.admin_description
      this.current_avatar_src = user.avatar_src
    }
  }
</script>
