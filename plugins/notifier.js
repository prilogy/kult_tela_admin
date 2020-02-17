export default ({ app, store }, inject) => {
  inject('notifier', {
    showMessage({ message = '', type = 'success' }) {
      if (type === 'success') {
        store.commit('popup/SET_SUCCESS', message)
      } else if (type === 'error')
        store.commit('popup/SET_ERROR', message)
    }
  })
}
