import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function authenticate (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/Authenticate',
    method: 'post',
    data: parameter
  })
}

export function logOut () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LogOut',
    method: 'get',
  })
}

export function sendTwoFactorAuthCode (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/SendTwoFactorAuthCode',
    method: 'post',
    data: parameter
  })
}

export function impersonatedAuthenticate (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate',
    method: 'post',
    data: parameter
  })
}

export function linkedAccountAuthenticate (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate',
    method: 'post',
    data: parameter
  })
}

export function getExternalAuthenticationProviders () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/GetExternalAuthenticationProviders',
    method: 'get',
  })
}

export function externalAuthenticate (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ExternalAuthenticate',
    method: 'post',
    data: parameter
  })
}

export function testNotification (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/TestNotification',
    method: 'get',
    params: parameter
  })
}