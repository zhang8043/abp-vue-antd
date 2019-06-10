import Vue from 'vue'
import {
  authenticate,
  logOut,
  sendTwoFactorAuthCode,
  impersonatedAuthenticate,
  linkedAccountAuthenticate,
  getExternalAuthenticationProviders,
  externalAuthenticate,
  testNotification
} from '@/api/precise/tokenAuth'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import preciseToken from '@/core/precise/auth/precise.token'
import preciseUtils from '@/core/precise/utils/precise.utils'
import AppConsts from '@/core/precise/AppConsts'

const tokenAuth = {
  state: {
    token: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        authenticate(userInfo).then(response => {
          const result = response.result
          const tokenExpireDate = userInfo.rememberClient ? (new Date(new Date().getTime() + 1000 * result.expireInSeconds)) : undefined
          preciseToken.setToken(result.accessToken, tokenExpireDate)
          preciseUtils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName, result.encryptedAccessToken, tokenExpireDate, abp.appPath)
          Vue.ls.set(ACCESS_TOKEN, result.accessToken, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.accessToken)
          location.reload()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logOut().then(() => {
          commit('SET_TOKEN', '')
          preciseToken.clearToken()
          Vue.ls.remove(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },
    // 发送双因素验证码
    SendTwoFactorAuthCode ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        sendTwoFactorAuthCode(payload).then(response => {
          const result = response.result
          console.log(result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 模拟身份验证
    ImpersonatedAuthenticate ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        impersonatedAuthenticate(payload).then(response => {
          const result = response.result
          console.log(result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 关联帐户验证
    LinkedAccountAuthenticate ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        linkedAccountAuthenticate(payload).then(response => {
          const result = response.result
          console.log(result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 获取外部身份验证提供商
    GetExternalAuthenticationProviders ({ commit }) {
      return new Promise((resolve, reject) => {
        getExternalAuthenticationProviders().then(response => {
          const result = response.result
          console.log(result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 外部认证
    ExternalAuthenticate ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        externalAuthenticate(payload).then(response => {
          const result = response.result
          console.log(result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 测试通知
    TestNotification ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        testNotification(payload).then(response => {
          const result = response.result
          console.log(result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
  }
}

export default tokenAuth
