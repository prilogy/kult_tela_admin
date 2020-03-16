export default function (ctx) {
  const axios = ctx.$axios

  this.Admin = {
    edit: data => axios.$post('/admin/edit', data)
  }

  this.Auth = {
    signUp: data => axios.$post('/admin/auth/signup', data),
    login: user => axios.$post('/auth', user), // user = { email, password }
    tokenAuth: () => axios.$get('/auth'), // headers must contain token
  }

  this.Chat = {
    getAll: () => axios.$get('/chat'),
    getById: id => axios.$get('/chat/' + id),
    getConversationById: id => axios.$get('/chat/' + id + '?c=true')
  }

  this.Stats = {
    get: () => axios.$get('/admin/stats')
  }

  this.Roles = {
    getAll: () => axios.$get('/admin/roles')
  }

  this.Top = {
    allTime: () => axios.$get('/top/all-time'),
    lastMonth: () => axios.$get('/top/last-month')
  }

  this.Public = {
    getUserById: id => axios.$get('/admin/public/user/' + id)
  }

  this.Request = {
    getAllPending: () => axios.$get('/admin/request'),
    getAllHistory: () => axios.$get('/admin/request/history'),
    setStatus: data => axios.$post('/admin/request', data)
  }
}
