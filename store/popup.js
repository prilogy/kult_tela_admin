export const state = () => ({
  error: null,
  success: null,
  text: null,
  color: ''
})

let timeout

export const mutations = {
  SET_ERROR(state, payload) {
    state.error = payload
  },
  SET_SUCCESS(state, payload) {
    state.success = payload
  },
  SET_COLOR(state, payload) {
    state.color = payload
  },
  SET_TEXT(state, payload) {
    state.text = payload
  }
}

export const actions = {
  SET_POPUP({ commit }, { text, color }) {
    commit('SET_COLOR', color)
    commit('SET_TEXT', text)
  },
  SET_ERROR({ commit }, payload) {
    commit('SET_ERROR', payload)
    if (payload === null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      commit('SET_ERROR', null)
      clearTimeout(timeout)
    }, 5000)
  },
  SET_SUCCESS({ commit }, payload) {
    commit('SET_SUCCESS', payload)
    setTimeout(() => {
      commit('SET_SUCCESS', null)
    }, 5000)
  }
}

export const getters = {
  GET_ERROR(state) {
    return state.error
  },
  GET_SUCCESS(state) {
    return state.success
  }
}
