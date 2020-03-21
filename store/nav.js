export const state = () => ({
  categories: [
    {
      id: 0,
      icon: 'mdi-apps',
      title: 'Главная',
      to: '/'
    },
    {
      id: 1,
      icon: 'mdi-forum',
      title: 'Сообщения',
      to: '/messages',
      nested: ['messages-id']
    },
    {
      id: 2,
      icon: 'mdi-format-float-left',
      title: 'Заявки',
      to: '/requests',
      roles: [-1, 0]
    },
    {
      id: 3,
      icon: 'mdi-chart-timeline-variant',
      title: 'Статистика',
      to: '/statistics',
      roles: [-1]
    },
    {
      id: 4,
      icon: 'mdi-qrcode',
      title: 'Промокоды',
      to: '/promo',
      roles: [-1]
    }
  ]
})

export const mutations = {}

export const actions = {}

export const getters = {
  GET_CATEGORIES: state => state.categories

}
