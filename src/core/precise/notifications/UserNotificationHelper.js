import AppConsts from '@/core/precise/AppConsts'
import preciseUtils from '@/core/precise/utils/precise.utils'
import * as Push from 'push.js'
import store from '@/store'
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'

export default class UserNotificationHelper {

  //获取通知链接
  static getUrl (userNotification) {
    switch (userNotification.notification.notificationName) {
      case 'App.NewUserRegistered':
        return '/app/admin/users?filterText=' + userNotification.notification.data.properties.emailAddress
      case 'App.NewTenantRegistered':
        return '/app/admin/tenants?filterText=' + userNotification.notification.data.properties.tenancyName
      case 'App.GdprDataPrepared':
        return AppConsts.remoteServiceBaseUrl + '/File/DownloadBinaryFile?id=' + userNotification.notification.data.properties.binaryObjectId + '&contentType=application/zip&fileName=collectedData.zip'
      case 'App.DownloadInvalidImportUsers':
        return AppConsts.remoteServiceBaseUrl + '/File/DownloadTempFile?fileToken=' + userNotification.notification.data.properties.fileToken + '&fileType=' + userNotification.notification.data.properties.fileType + '&fileName=' + userNotification.notification.data.properties.fileName
      //添加自定义通知名称，以便在用户单击通知时导航到URL。
    }

    //此通知没有网址
    return ''
  }

  //获取Ui图标
  static getUiIconBySeverity (severity) {
    switch (severity) {
      case abp.notifications.severity.SUCCESS:
        return '/notifications/success.png'
      case abp.notifications.severity.WARN:
        return '/notifications/warn.png'
      case abp.notifications.severity.ERROR:
        return '/notifications/error.png'
      case abp.notifications.severity.FATAL:
        return '/notifications/fatal.png'
      case abp.notifications.severity.INFO:
      default:
        return '/notifications/info.png'
    }
  }

  static getUiNotifyFuncBySeverity (severity, message) {
    notification.config({
      placement: 'bottomRight',
      // duration: 0
    })
    switch (severity) {
      case abp.notifications.severity.SUCCESS:
        return notification.success({
          message: '通知',
          description: message,
        })
      case abp.notifications.severity.WARN:
        return notification.warn({
          message: '通知',
          description: message,
        })
      case abp.notifications.severity.ERROR:
        return notification.error({
          message: '通知',
          description: message,
        })
      case abp.notifications.severity.FATAL:
        return notification.error({
          message: '通知',
          description: message,
        })
      case abp.notifications.severity.INFO:
      default:
        return notification.info({
          message: '通知',
          description: message,
        })
    }
  };

  static format (userNotification, truncateText) {
    const formatted = {
      userNotificationId: userNotification.id,
      text: abp.notifications.getFormattedMessageFromUserNotification(userNotification),
      time: moment(userNotification.notification.creationTime).format('YYYY-MM-DD HH:mm:ss'),
      creationTime: userNotification.notification.creationTime,
      icon: this.getUiIconBySeverity(userNotification.notification.severity),
      state: abp.notifications.getUserNotificationStateAsString(userNotification.state),
      data: userNotification.notification.data,
      url: this.getUrl(userNotification),
      isUnread: userNotification.state === abp.notifications.userNotificationState.UNREAD
    }
    if (truncateText || truncateText === undefined) {
      formatted.text = abp.utils.truncateStringWithPostfix(formatted.text, 100)
    }
    return formatted
  }

  static showUiNotifyForUserNotification (userNotification, options) {
    var message = abp.notifications.getFormattedMessageFromUserNotification(userNotification)
    this.getUiNotifyFuncBySeverity(userNotification.notification.severity, message)
  }

  static show (userNotification) {
    //显示通知
    this.showUiNotifyForUserNotification(userNotification, {
      'onclick': () => {
        //当用户点击实时toastr通知时采取行动
        const url = this.getUrl(userNotification)
        if (url) {
          location.href = url
        }
      }
    })
    //桌面通知
    Push.default.create('Precise', {
      body: this.format(userNotification).text,
      icon: abp.appPath + 'assets/common/images/app-logo-small.svg',
      timeout: 6000,
      onClick: function () {
        window.focus()
        this.close()
      }
    })
  }

  //设置全部已读
  static setAllAsRead (callback) {
    store.dispatch('SetAllNotificationsAsRead')
      .then(res => {
        abp.event.trigger('app.notifications.refresh')
        if (callback) {
          callback()
        }
      })
      .catch(err => {
        this.$message.error(err.message)
      })
  }

  //设为已读
  static setAsRead (userNotificationId, callback) {
    store.dispatch('SetNotificationAsRead', { id: userNotificationId })
      .then(res => {
        abp.event.trigger('app.notifications.read', userNotificationId)
        if (callback) {
          callback()
        }
      })
      .catch(err => {
        this.$message.error(err.message)
      })
  }

}
