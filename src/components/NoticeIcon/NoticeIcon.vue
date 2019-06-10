<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-list :dataSource="notifications">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <div slot="title">
                <a-tooltip>
                  <template slot="title">点击查看通知详情</template>
                  {{ item.data.message }}
                </a-tooltip>
              </div>
              <div slot="description">
                <a-tag color="blue" v-if="item.state=='READ'">已读</a-tag>
                <a @click="setAsRead(item.userNotificationId)" v-else-if="item.state=='UNREAD'">
                  <a-tooltip>
                    <template slot="title">设置已读</template>
                    {{ item.time }}
                  </a-tooltip>
                </a>
              </div>
              <a-avatar :size="50" style="background-color: white" slot="avatar" :src="item.icon"/>
            </a-list-item-meta>
          </a-list-item>
          <div slot="header" style="padding-top:0">
            <a-row>
              <a-col :span="20">
                <a @click="setAllAsRead">设置所有为已读</a>
              </a-col>
              <a-col :span="4">
                <a @click="showModal">设置</a>
              </a-col>
            </a-row>
          </div>
          <a-button slot="footer" @click="viewAll" block>查看所有通知</a-button>
        </a-list>
      </a-spin>
      <a-modal title="通知设置" v-model="modalVisible" @ok="modalHandleOk">
        <a-form layout="vertical" :form="form">
          <a-form-item label="接收通知" help="这个选项可以用来完全启用/禁用接收通知。">
            <a-switch v-model="receiveNotifications"/>
          </a-form-item>
          <a-form-item label="通知类型">
            <p v-if="!settings.receiveNotifications"></p>
            <a-checkbox-group
              v-decorator="['notificationType', {initialValue: selectedType}]"
              style="width: 100%;"
            >
              <a-row>
                <a-col
                  :span="8"
                  v-for="(item) in settings.notifications"
                  :key="item.name.toString()"
                >
                  <a-checkbox
                    :value="item.name"
                    :disabled="!receiveNotifications"
                  >{{ item.displayName }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-form>
      </a-modal>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef">
      <a-badge :count="unreadNotificationCount">
        <a-icon style="font-size: 16px; padding: 4px" type="bell"/>
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { getUserNotifications, getNotificationSettings, updateNotificationSettings } from '@/api/precise/notification'
import UserNotificationHelper from '@/core/precise/notifications/UserNotificationHelper'
import * as _ from 'lodash'

export default {
  name: 'HeaderNotice',
  data() {
    return {
      form: this.$form.createForm(this),
      modalVisible: false,
      loadding: false,
      visible: false,
      notifications: [],
      unreadNotificationCount: 0,
      settings: [],
      selectedType: [],
      receiveNotifications: false
    }
  },
  created() {
    this.loadNotifications()
    this.registerToEvents()
  },
  methods: {
    fetchNotice() {
      if (!this.visible) {
        this.loadding = true
        this.loadNotifications()
      } else {
        this.loadding = false
      }
      this.visible = !this.visible
    },
    loadNotifications() {
      this.notifications = []
      getUserNotifications({ state: 0, maxResultCount: 3, skipCount: 0 })
        .then(response => {
          const result = response.result
          this.unreadNotificationCount = result.unreadCount
          _.forEach(result.items, item => {
            this.notifications.push(UserNotificationHelper.format(item))
          })
          this.loadding = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    showModal() {
      getNotificationSettings()
        .then(response => {
          const result = response.result
          this.settings = result
          this.receiveNotifications = result.receiveNotifications
          this.selectedType = _.map(result.notifications, n => {
            if (n.isSubscribed) {
              return n.name
            }
          })
          this.modalVisible = true
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    modalHandleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          var subscription = []
          this.settings.notifications.forEach(re => {
            if (values.notificationType.indexOf(re.name) > -1) {
              subscription.push({
                name: re.name,
                isSubscribed: true
              })
            } else {
              subscription.push({
                name: re.name,
                isSubscribed: false
              })
            }
          })
          updateNotificationSettings({
            receiveNotifications: this.receiveNotifications,
            notifications: subscription
          })
            .then(response => {
              this.modalVisible = false
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        }
      })
    },
    setAllAsRead() {
      UserNotificationHelper.setAllAsRead(() => this.loadNotifications())
    },
    setAsRead(userNotificationId) {
      UserNotificationHelper.setAsRead(userNotificationId, () => this.loadNotifications())
    },
    viewAll() {
      this.$router.push({ name: 'noticeIcon' })
    },
    registerToEvents() {
      const self = this

      function onNotificationReceived(userNotification) {
        UserNotificationHelper.show(userNotification)
        self.loadNotifications()
      }

      abp.event.on('abp.notifications.received', userNotification => {
        onNotificationReceived(userNotification)
      })

      function onNotificationsRefresh() {
        self.loadNotifications()
      }

      abp.event.on('app.notifications.refresh', () => {
        onNotificationsRefresh()
      })

      function onNotificationsRead(userNotificationId) {
        if (self.notifications != null) {
          for (let i = 0; i < self.notifications.length; i++) {
            if (self.notifications[i].userNotificationId === userNotificationId) {
              self.notifications[i].state = 'READ'
            }
          }
          self.unreadNotificationCount -= 1
        }
      }

      abp.event.on('app.notifications.read', userNotificationId => {
        onNotificationsRead(userNotificationId)
      })
    }
  }
}
</script>

<style lang="css">
.header-notice-wrapper {
  top: 50px !important;
}
</style>
<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>
