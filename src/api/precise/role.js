import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function getRoles (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Role/GetRoles',
    method: 'get',
    params: parameter
  })
}

export function getRoleForEdit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Role/GetRoleForEdit',
    method: 'get',
    params: parameter
  })
}

export function createOrUpdateRole (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Role/CreateOrUpdateRole',
    method: 'post',
    data: parameter
  })
}

export function deleteRole (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Role/DeleteRole',
    method: 'delete',
    params: parameter
  })
}