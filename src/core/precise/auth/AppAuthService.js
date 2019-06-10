
import AppConsts from '@/core/precise/AppConsts'
import { axios } from '@/utils/request'
const AppAuthService = {
  logout (reload, returnUrl) {
    axios({
      url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LogOut',
      method: 'GET',
      params: {
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
        'Authorization': 'Bearer ' + abp.auth.getToken()
      }
    }).then((result) => {
      abp.auth.clearToken()
      abp.utils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName, undefined, undefined, abp.appPath)
      if (reload !== false) {
        if (returnUrl) {
          location.href = returnUrl
        }
        else {
          location.href = ''
        }
      }
    })
      .catch(err => {
        this.$message.error(err.message)
      })
  }
}
export default AppAuthService