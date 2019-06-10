import { axios } from '@/utils/request'
import AppConsts from '@/core/precise/AppConsts'

export function getUserNotifications (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Notification/GetUserNotifications',
    method: 'get',
    params: parameter
  })
}

export function setAllNotificationsAsRead () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Notification/SetAllNotificationsAsRead',
    method: 'post',
  })
}

export function setNotificationAsRead (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Notification/SetNotificationAsRead',
    method: 'post',
    data: parameter
  })
}

export function getNotificationSettings () {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Notification/GetNotificationSettings',
    method: 'get',
  })
}

export function updateNotificationSettings (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Notification/UpdateNotificationSettings',
    method: 'put',
    data: parameter
  })
}

export function deleteNotification (parameter) {
  return axios({
    url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Notification/DeleteNotification',
    method: 'delete',
    data: parameter
  })
}