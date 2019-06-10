import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function getUsers (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/GetUsers',
    method: 'get',
    params: parameter
  })
}

export function getUsersToExcel () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/GetUsersToExcel',
    method: 'get',
  })
}

export function getUserForEdit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/GetUserForEdit',
    method: 'get',
    params: parameter
  })
}

export function getUserPermissionsForEdit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/GetUserPermissionsForEdit',
    method: 'get',
    params: parameter
  })
}

export function resetUserSpecificPermissions (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/ResetUserSpecificPermissions',
    method: 'post',
    data: parameter
  })
}

export function updateUserPermissions (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/UpdateUserPermissions',
    method: 'put',
    data: parameter
  })
}

export function createOrUpdateUser (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/CreateOrUpdateUser',
    method: 'post',
    data: parameter
  })
}

export function deleteUser (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/DeleteUser',
    method: 'delete',
    params: parameter
  })
}

export function unlockUser (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/User/UnlockUser',
    method: 'post',
    data: parameter
  })
}