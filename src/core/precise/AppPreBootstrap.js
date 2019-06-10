import AppConsts from '@/core/precise/AppConsts'
import { getCurrentTenancyNameOrNull } from '@/core/precise/helpers/SubdomainTenancyNameFinder'
import * as moment from 'moment'
import * as _ from 'lodash'
import { axios } from '@/utils/request'
import UrlHelper from '@/core/precise/helpers/UrlHelper'
import AppAuthService from '@/core/precise/auth/AppAuthService'
import preciseUtils from '@/core/precise/utils/precise.utils'
import { message } from 'ant-design-vue/es'

export default class AppPreBootstrap {
  static run (appRootUrl, callback, resolve, reject) {
    AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
      if (UrlHelper.isInstallUrl(location.href)) {
        AppPreBootstrap.loadAssetsForInstallPage(callback)
        return
      }
      const queryStringObj = UrlHelper.getQueryParameters()
      if (queryStringObj.redirect && queryStringObj.redirect === 'TenantRegistration') {
        if (queryStringObj.forceNewRegistration) {
          AppAuthService.logout()
        }
        location.href = AppConsts.appBaseUrl + '/account/select-edition'
      } else if (queryStringObj.impersonationToken) {
        AppPreBootstrap.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback) })
      } else if (queryStringObj.switchAccountToken) {
        AppPreBootstrap.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback) })
      } else {
        AppPreBootstrap.getUserConfiguration(callback)
      }
    })
  }

  static getApplicationConfig (appRootUrl, callback) {
    axios({
      url: appRootUrl + '/appconfig.json',
      method: 'GET',
      params: {
        name: 'Abp.TenantId',
        value: abp.multiTenancy.getTenantIdCookie() + ''
      }
    }).then((result) => {
      const tenancyName = getCurrentTenancyNameOrNull(result.appBaseUrl)
      AppConsts.appBaseUrlFormat = result.appBaseUrl
      AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl
      AppConsts.localeMappings = result.localeMappings
      if (tenancyName == null) {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '')
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '')
      } else {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName)
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName)
      }
      callback()
    })
      .catch(err => {
        message.error(err.message)
      })
  }

  static getUserConfiguration (callback) {
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName')
    axios({
      url: AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll',
      method: 'GET',
      params: {
        '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
      }
    }).then((response) => {
      const result = response.result
      _.merge(abp, result)
      abp.clock.provider = this.getCurrentClockProvider(result.clock.provider)
      moment.locale(abp.localization.currentLanguage.name)
      if (abp.clock.provider.supportsMultipleTimezone) {
        moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId)
      }
      abp.event.trigger('abp.dynamicScriptsInitialized')
      AppConsts.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey')
      AppConsts.subscriptionExpireNootifyDayCount = parseInt(abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'))
      callback()
    })
      .catch(err => {
        message.error(err.message)
      })
  }

  static impersonatedAuthenticate (impersonationToken, tenantId, callback) {
    abp.multiTenancy.setTenantIdCookie(tenantId)
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName')
    axios({
      url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=' + impersonationToken,
      method: 'POST',
      params: {
        '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
      }
    }).then((response) => {
      const result = response.result
      abp.auth.setToken(result.accessToken)
      AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken)
      location.search = ''
      callback()
    })
      .catch(err => {
        message.error(err.message)
      })
  }

  static linkedAccountAuthenticate (switchAccountToken, tenantId, callback) {
    abp.multiTenancy.setTenantIdCookie(tenantId)
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName')
    axios({
      url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=' + switchAccountToken,
      method: 'POST',
      params: {
        '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
      }
    }).then((response) => {
      const result = response.result
      abp.auth.setToken(result.accessToken)
      AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken)
      location.search = ''
      callback()
    })
      .catch(err => {
        message.error(err.message)
      })
  }

  static setEncryptedTokenCookie (encryptedToken) {
    preciseUtils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName,
      encryptedToken,
      new Date(new Date().getTime() + 365 * 86400000), //1 year
      abp.appPath
    )
  }

  static getCurrentClockProvider (currentProviderName) {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider
    }
    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider
    }
    return abp.timing.localClockProvider
  }

  static loadAssetsForInstallPage (callback) {
    abp.setting.values['App.UiManagement.Theme'] = 'default'
    abp.setting.values['default.App.UiManagement.ThemeColor'] = 'default'

    callback()
  }
}