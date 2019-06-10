import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function getOrganizationUnits () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/GetOrganizationUnits',
    method: 'get',
  })
}

export function getOrganizationUnitUsers (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/getOrganizationUnitUsers',
    method: 'get',
    params: parameter
  })
}

export function createOrganizationUnit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/CreateOrganizationUnit',
    method: 'post',
    data: parameter
  })
}

export function updateOrganizationUnit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/UpdateOrganizationUnit',
    method: 'put',
    data: parameter
  })
}

export function moveOrganizationUnit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/MoveOrganizationUnit',
    method: 'post',
    data: parameter
  })
}

export function deleteOrganizationUnit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/DeleteOrganizationUnit',
    method: 'delete',
    params: parameter
  })
}

export function removeUserFromOrganizationUnit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/RemoveUserFromOrganizationUnit',
    method: 'delete',
    params: parameter
  })
}

export function addUsersToOrganizationUnit (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/AddUsersToOrganizationUnit',
    method: 'post',
    data: parameter
  })
}

export function findUsers (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/OrganizationUnit/FindUsers',
    method: 'post',
    data: parameter
  })
}