export const strict = false

export const actions = {
  async nuxtClientInit({ commit, getters, dispatch }, ctx) {
    const token = getters['auth/GET_TOKEN']
    if (token) {
      try {
        const { data: user } = await ctx.app.$api.Auth.tokenAuth()
        if (typeof user.admin_role_id !== 'number') {
          dispatch(
            'popup/SET_ERROR',
            'Отсутствует подключение к серверу, попробуйте позднее'
          )
          await dispatch('auth/LOGOUT')
        } else if (typeof user.admin_role_id === 'number') {
          await commit('user/SET_USER', user)
          await commit('auth/SET_AUTHENTICATED')
        }
      } catch (err) {
        if (!err.response) {
          dispatch(
            'popup/SET_ERROR',
            'Отсутствует подключение к серверу, попробуйте позднее'
          )
        } else await dispatch('auth/LOGOUT')
      }
    }
  }
}
