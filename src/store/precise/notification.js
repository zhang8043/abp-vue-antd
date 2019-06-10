import Vue from 'vue'
import {
  getUserNotifications,
  setAllNotificationsAsRead,
  setNotificationAsRead,
  getNotificationSettings,
  updateNotificationSettings,
  deleteNotification
} from '@/api/precise/notification'

const notification = {
  state: {
  },
  mutations: {
  },

  actions: {
    // 获取用户通知
    GetUserNotifications ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getUserNotifications(payload).then(response => {
          const result = response.result

          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 将所有通知设置为已读
    SetAllNotificationsAsRead ({ commit }) {
      return new Promise((resolve, reject) => {
        setAllNotificationsAsRead().then(response => {
          const result = response.result

          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 将通知设置为已读
    SetNotificationAsRead ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        setNotificationAsRead(payload).then(response => {
          const result = response.result

          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 获取通知设置
    GetNotificationSettings ({ commit }) {
      return new Promise((resolve, reject) => {
        getNotificationSettings().then(response => {
          const result = response.result

          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 更新通知设置
    UpdateNotificationSettings ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateNotificationSettings(payload).then(response => {
          const result = response.result

          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 删除通知
    DeleteNotification ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        deleteNotification(payload).then(response => {
          const result = response.result

          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
  }
}

export default notification
