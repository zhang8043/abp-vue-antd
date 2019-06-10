import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function getAllPermissions () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Permission/GetAllPermissions',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}