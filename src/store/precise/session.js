import Vue from 'vue'
import {
  getCurrentLoginInformations,
  updateUserSignInToken
} from '@/api/precise/session'
import {
  SIDEBAR_TYPE,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR,
  DEFAULT_COLOR_WEAK,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_TAB,
  PRECISE_APPSESSION
} from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const session = {
  state: {
    sidebar: true,// 侧边栏
    device: 'desktop',// 设备
    theme: '',// 整体风格设置
    layout: '',// 导航模式
    contentWidth: '',// 内容区域宽度
    fixedHeader: false,// 固定 Header
    fixSiderbar: false, // 固定侧边菜单
    autoHideHeader: false,// 下滑时隐藏 Header
    color: null,// 主题色
    weak: false,// 色弱模式
    multiTab: true,// 多页签模式
    welcome: '',
    appSession: {}
  },

  mutations: {
    SET_SIDEBAR_TYPE: (state, type) => {
      state.sidebar = type
      Vue.ls.set(SIDEBAR_TYPE, type)
    },
    CLOSE_SIDEBAR: (state) => {
      Vue.ls.set(SIDEBAR_TYPE, true)
      state.sidebar = false
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    TOGGLE_THEME: (state, theme) => {
      // setStore('_DEFAULT_THEME', theme)
      Vue.ls.set(DEFAULT_THEME, theme)
      state.theme = theme
    },
    TOGGLE_LAYOUT_MODE: (state, layout) => {
      Vue.ls.set(DEFAULT_LAYOUT_MODE, layout)
      state.layout = layout
    },
    TOGGLE_FIXED_HEADER: (state, fixed) => {
      Vue.ls.set(DEFAULT_FIXED_HEADER, fixed)
      state.fixedHeader = fixed
    },
    TOGGLE_FIXED_SIDERBAR: (state, fixed) => {
      Vue.ls.set(DEFAULT_FIXED_SIDEMENU, fixed)
      state.fixSiderbar = fixed
    },
    TOGGLE_FIXED_HEADER_HIDDEN: (state, show) => {
      Vue.ls.set(DEFAULT_FIXED_HEADER_HIDDEN, show)
      state.autoHideHeader = show
    },
    TOGGLE_CONTENT_WIDTH: (state, type) => {
      Vue.ls.set(DEFAULT_CONTENT_WIDTH_TYPE, type)
      state.contentWidth = type
    },
    TOGGLE_COLOR: (state, color) => {
      Vue.ls.set(DEFAULT_COLOR, color)
      state.color = color
    },
    TOGGLE_WEAK: (state, flag) => {
      Vue.ls.set(DEFAULT_COLOR_WEAK, flag)
      state.weak = flag
    },
    TOGGLE_MULTI_TAB: (state, bool) => {
      Vue.ls.set(DEFAULT_MULTI_TAB, bool)
      state.multiTab = bool
    },
    SET_APPSESSION: (state, { appSession, welcome }) => {
      Vue.ls.set(PRECISE_APPSESSION, appSession)
      state.appSession = appSession
      state.welcome = welcome
    },
  },

  actions: {
    setSidebar ({ commit }, type) {
      commit('SET_SIDEBAR_TYPE', type)
    },
    CloseSidebar ({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleTheme ({ commit }, theme) {
      commit('TOGGLE_THEME', theme)
    },
    ToggleLayoutMode ({ commit }, mode) {
      commit('TOGGLE_LAYOUT_MODE', mode)
    },
    ToggleFixedHeader ({ commit }, fixedHeader) {
      if (!fixedHeader) {
        commit('TOGGLE_FIXED_HEADER_HIDDEN', false)
      }
      commit('TOGGLE_FIXED_HEADER', fixedHeader)
    },
    ToggleFixSiderbar ({ commit }, fixSiderbar) {
      commit('TOGGLE_FIXED_SIDERBAR', fixSiderbar)
    },
    ToggleFixedHeaderHidden ({ commit }, show) {
      commit('TOGGLE_FIXED_HEADER_HIDDEN', show)
    },
    ToggleContentWidth ({ commit }, type) {
      commit('TOGGLE_CONTENT_WIDTH', type)
    },
    ToggleColor ({ commit }, color) {
      commit('TOGGLE_COLOR', color)
    },
    ToggleWeak ({ commit }, weakFlag) {
      commit('TOGGLE_WEAK', weakFlag)
    },
    ToggleMultiTab ({ commit }, bool) {
      commit('TOGGLE_MULTI_TAB', bool)
    },
    // 获取当前登录信息
    GetCurrentLoginInformations ({ commit }) {
      return new Promise((resolve, reject) => {
        getCurrentLoginInformations().then(response => {
          const result = response.result
          commit('SET_APPSESSION', { appSession: result, welcome: welcome() })
          //设置主题
          const theme = result.theme
          if (theme !== null) {
            const baseSettings = theme.baseSettings
            const footer = baseSettings.footer
            const header = baseSettings.header
            const layout = baseSettings.layout
            const menu = baseSettings.menu
            const other = baseSettings.other
            commit('TOGGLE_THEME', layout.overallStyle)
            commit('TOGGLE_LAYOUT_MODE', menu.navigationMode)
            commit('TOGGLE_CONTENT_WIDTH', header.contentWidth)
            commit('TOGGLE_FIXED_HEADER', header.fixedHeader)
            commit('TOGGLE_FIXED_SIDERBAR', menu.fixedMenu)
            commit('TOGGLE_FIXED_HEADER_HIDDEN', header.slidingHiddenHeader)
            commit('TOGGLE_COLOR', layout.themeColor)
            commit('TOGGLE_WEAK', other.weakMode)
            commit('TOGGLE_MULTI_TAB', other.multiTab)
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 更新用户登录令牌
    UpdateUserSignInToken ({ commit }) {
      return new Promise((resolve, reject) => {
        updateUserSignInToken().then(response => {
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

export default session
