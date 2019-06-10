// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { VueAxios } from './utils/request'
import AppPreBootstrap from '@/core/precise/AppPreBootstrap'
import UrlHelper from '@/core/precise/helpers/UrlHelper'
import AppAuthService from '@/core/precise/auth/AppAuthService'
import SignalRHelper from '@/core/precise/helpers/SignalRHelper'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

AppPreBootstrap.run(getDocumentOrigin(), () => {
  handleLogoutRequest(AppAuthService)
  if (Vue.ls.get(ACCESS_TOKEN)) {
    SignalRHelper.initSignalR(() => { })
    new Vue({
      router,
      store,
      created () {
        bootstrap()
      },
      render: h => h(App)
    }).$mount('#app')
  } else {
    store
      .dispatch('GetCurrentLoginInformations')
      .then(res => {
        new Vue({
          router,
          store,
          created () {
            bootstrap()
          },
          render: h => h(App)
        }).$mount('#app')
      })
  }
})

function handleLogoutRequest (authService) {
  const currentUrl = UrlHelper.initialUrl
  const returnUrl = UrlHelper.getReturnUrl()
  if (currentUrl.indexOf(('account/logout')) >= 0 && returnUrl) {
    authService.logout(true, returnUrl)
  }
}

function getDocumentOrigin () {
  if (!document.location.origin) {
    return document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '')
  }
  return document.location.origin
}