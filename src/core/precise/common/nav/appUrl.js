import AppConsts from '@/core/precise/AppConsts'
import store from '@/store'

const tenancyNamePlaceHolder = '{TENANCY_NAME}'

export default class AppUrl {

  static appRootUrl () {
    if (store.getters.appSession.tenant) {
      return this.getAppRootUrlOfTenant(store.getters.appSession.tenant.tenancyName)
    } else {
      return this.getAppRootUrlOfTenant(null)
    }
  }

  static getAppRootUrlOfTenant (tenancyName) {
    var baseUrl = this.ensureEndsWith(AppConsts.appBaseUrlFormat, '/')

    //Add base href if it is not configured in appconfig.json
    if (baseUrl.indexOf(AppConsts.appBaseHref) < 0) {
      if (this.removeFromStart(AppConsts.appBaseHref, '/') != undefined)
        baseUrl = baseUrl + this.removeFromStart(AppConsts.appBaseHref, '/')
    }

    if (baseUrl.indexOf(tenancyNamePlaceHolder) < 0) {
      return baseUrl
    }

    if (baseUrl.indexOf(tenancyNamePlaceHolder + '.') >= 0) {
      baseUrl = baseUrl.replace(tenancyNamePlaceHolder + '.', tenancyNamePlaceHolder)
      if (tenancyName) {
        tenancyName = tenancyName + '.'
      }
    }

    if (!tenancyName) {
      return baseUrl.replace(tenancyNamePlaceHolder, '')
    }


    return baseUrl.replace(tenancyNamePlaceHolder, tenancyName)
  }

  static ensureEndsWith (str, c) {
    if (str + ''.charAt(str.length - 1) !== c) {
      str = str + c
    }

    return str
  }

  static removeFromEnd (str, c) {
    if (str + ''.charAt(str.length - 1) === c) {
      str = str.substr(0, str.length - 1)
    }

    return str
  }

  static removeFromStart (str, c) {
    if (str + ''.charAt(0) === c) {
      str = str.substr(1, str.length - 1)
    }

    return str
  }
}