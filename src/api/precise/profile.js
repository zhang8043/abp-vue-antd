import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function getProfilePictureById (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Profile/GetProfilePictureById',
    method: 'get',
    params: parameter
  })
}