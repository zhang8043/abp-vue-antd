<template>
  <a-card title="通知">
    <a-tabs v-model="activeKey" tabPosition="left" size="large" @change="callback">
      <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key">
        <a-table
          :columns="columns"
          :rowKey="record => record.userNotificationId"
          :dataSource="data"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <template slot="text" slot-scope="data">
            <a-avatar :size="25" style="background-color: white" slot="avatar" :src="data.icon"/>
            {{data.text}}
          </template>
          <template slot="time" slot-scope="time">{{time}}</template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { getUserNotifications } from '@/api/precise/notification'
import UserNotificationHelper from '@/core/precise/notifications/UserNotificationHelper'

const columns = [
  {
    title: '通知',
    width: '75%',
    scopedSlots: { customRender: 'text' }
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    width: '25%',
    scopedSlots: { customRender: 'time' }
  }
]

export default {
  data() {
    const panes = [{ title: '全部', key: '' }, { title: '未读', key: '0' }, { title: '已读', key: '1' }]
    return {
      activeKey: panes[0].key,
      panes,
      data: [],
      pagination: {},
      columns
    }
  },
  mounted() {
    this.loadNotifications({ maxResultCount: 10, skipCount: 0 })
  },
  methods: {
    callback(key) {
      this.loadNotifications({ state: key, maxResultCount: 10, skipCount: 0 })
    },
    handleTableChange(pagination, filters, sorter) {
      this.loadNotifications({
        state: this.activeKey,
        maxResultCount: pagination.pageSize,
        skipCount: (pagination.current - 1) * pagination.pageSize
      })
    },
    loadNotifications(params = {}) {
      this.data = []
      getUserNotifications({ ...params })
        .then(response => {
          const result = response.result
          const pagination = { ...this.pagination }
          pagination.total = result.totalCount
          this.pagination = pagination
          _.forEach(result.items, item => {
            this.data.push(UserNotificationHelper.format(item))
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
