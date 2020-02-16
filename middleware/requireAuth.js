export default function ({ store, redirect }) {
  console.log('asdasdsa')
  const userLoggedIn = !!store.state.auth.isAuthenticated
  console.log(userLoggedIn)
  if (!userLoggedIn) return redirect('/login')
}
