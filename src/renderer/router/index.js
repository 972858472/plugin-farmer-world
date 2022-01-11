import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import Login from '../components/Login'
import Store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})

router.beforeEach((to, from, next) => {
  // ...
  const isAuthenticated = Store.state.Counter.username || false
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' })
    return false
  } else {
    next()
  }
})

export default router
