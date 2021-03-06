export const state = () => ({
  isAuthenticated: false,
  token: localStorage.getItem('token') || null
})

export const mutations = {
  SET_AUTHENTICATED(state) {
    state.isAuthenticated = true
  },
  LOGOUT(state) {
    state.isAuthenticated = false
    state.token = null
    localStorage.removeItem('token')
  },
  SET_TOKEN(state, payload) {
    state.token = payload
    localStorage.setItem('token', payload)
  }
}

export const actions = {
  async LOGIN({ commit }, { email, password }) {
    try {
      const result = await this.$api.Auth.login({ email, password })
      if (result.success) {
        const { user, token } = result.data

        if (typeof user.admin_role_id !== 'number') {
          commit('popup/SET_ERROR', 'Пользователь не существует', { root: true })
        } else if (typeof user.admin_role_id === 'number') {
          commit('user/SET_USER', user, { root: true })
          commit('SET_AUTHENTICATED')
          commit('SET_TOKEN', token)
          await $nuxt.$router.push('/')
          window.location.reload(true)
        }
      }
    } catch (error) {
    }
  },
  async LOGOUT({ commit }) {
    await this.$router.push('/login')
    commit('LOGOUT')
    commit('user/SET_USER', null, { root: true })
  }
}

export const getters = {
  GET_TOKEN(state) {
    return state.token
  }
}
