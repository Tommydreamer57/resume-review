import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Organisation from '@/components/Organisation'
import Individual from '@/components/Individual'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/organisation',
      name: 'Organisation',
      component: Organisation
    }
  ]
})
