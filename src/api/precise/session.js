import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function getCurrentLoginInformations () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Session/GetCurrentLoginInformations',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function updateUserSignInToken () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Session/UpdateUserSignInToken',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}