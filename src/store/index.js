import Vue from 'vue'
import Vuex from 'vuex'

import notification from './precise/notification'
import permission from './precise/permission'
import session from './precise/session'
import tokenAuth from './precise/tokenAuth'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notification,
    permission,
    session,
    tokenAuth
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
