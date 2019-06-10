import AppConsts from '@/core/precise/AppConsts'
import preciseUtils from '@/core/precise/utils/precise.utils'

export default class SignalRHelper {
  static initSignalR (callback) {
    const encryptedAuthToken = preciseUtils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName)
    abp.signalr = {
      autoConnect: true,
      connect: undefined,
      hubs: undefined,
      qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
      remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
      startConnection: undefined,
      url: '/signalr'
    }

    const script = document.createElement('script')
    script.onload = () => {
      callback()
    }

    script.src = AppConsts.appBaseUrl + '/dist/abp.signalr-client.js'
    document.head.appendChild(script)
  }
}
