export default function (ctx) {
  const axios = ctx.$axios

  this.Auth = {
    signUp: data => axios.$post('/admin/auth/signup', data),
    login: user => axios.$post('/auth', user), // user = { email, password }
    tokenAuth: () => axios.$get('/auth'), // headers must contain token
  }

  this.Chat = {
    getAll: () => axios.$get('/chat'),
    getById: id => axios.$get('/chat/' + id)
  }

  this.Roles = {
    getAll: () => axios.$get('/admin/roles')
  }

  // this.Plans = {
  //   getAll: () => axios.$get('/plan/all')
  // }

  this.Top = {
    allTime: () => axios.$get('/top/all-time'),
    lastMonth: () => axios.$get('/top/last-month')
  }

  this.Public = {
    getUserById: id => axios.$get('/public/user/' + id)
  }
}
