import { getChatIndexById } from './utils'

const mutations = {
  SET_CHATS(state, payload) {
    state.chats = payload
  },
  SET_CHAT(state, chat) {
    const index = getChatIndexById(state.chats, { id: chat.id })
    if (index === -1) state.chats.push(chat)
    else {
      this._vm.$set(state.chats, index, chat)
    }
  },
  SET_CURRENT_CHAT(state, chat) {
    this._vm.$set(state, 'currentChat', chat)
  }
}

export default mutations
