// import Vue from 'vue'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import { mapState } from 'vuex'

// const mixinsComputed = Vue.config.optionMergeStrategies.computed
// const mixinsMethods = Vue.config.optionMergeStrategies.methods

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.session.layout,
      navTheme: state => state.session.theme,
      primaryColor: state => state.session.color,
      colorWeak: state => state.session.weak,
      fixedHeader: state => state.session.fixedHeader,
      fixSiderbar: state => state.session.fixSiderbar,
      fixSidebar: state => state.session.fixSiderbar,
      contentWidth: state => state.session.contentWidth,
      autoHideHeader: state => state.session.autoHideHeader,
      sidebarOpened: state => state.session.sidebar,
      multiTab: state => state.session.multiTab
    })
  },
  methods: {
    isTopMenu () {
      return this.layoutMode === 'topmenu'
    },
    isSideMenu () {
      return !this.isTopMenu()
    }
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.session.device
    })
  },
  methods: {
    isMobile () {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet () {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

const AppDeviceEnquire = {
  mounted () {
    const { $store } = this
    deviceEnquire(deviceType => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          $store.commit('TOGGLE_DEVICE', 'desktop')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.TABLET:
          $store.commit('TOGGLE_DEVICE', 'tablet')
          $store.dispatch('setSidebar', false)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          $store.commit('TOGGLE_DEVICE', 'mobile')
          $store.dispatch('setSidebar', true)
          break
      }
    })
  }
}

export { mixin, AppDeviceEnquire, mixinDevice }
