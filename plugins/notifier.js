export default ({ app, store }, inject) => {
  inject('notifier', {
    async showMessage({ message = '', type = 'success', color = 'info' }) {
      if (type === 'success') {
        store.commit('popup/SET_SUCCESS', message)
      } else if (type === 'error')
        store.commit('popup/SET_ERROR', message)
      else if (!type) {
        await store.dispatch('SET_POPUP', { text: message, color: color })
      }
    }
  })
}
