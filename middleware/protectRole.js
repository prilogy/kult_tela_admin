export default function ({ store, redirect, route, app }) {
  const path = route.path
  const admin_role_id = store.getters['user/GET_USER'].admin_role_id
  const cats = store.getters['nav/GET_CATEGORIES']
  const current_cat = cats.filter(e => e.to === path)[0]
  if (current_cat) {
    if (!current_cat.roles.includes(admin_role_id)) {
      return redirect('/')
    }
  }
}
