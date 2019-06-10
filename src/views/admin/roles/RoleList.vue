<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.permission"
                @change="handlePermissionChange"
                placeholder="按权限查找"
              >
                <a-select-option
                  v-for="permission in permissions"
                  :value="permission.name"
                  :key="permission.name"
                >{{ permission.displayName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createOfEditModal.createOrEdit()">添加角色</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete"/>删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <span
        class="table-page-search-submitButtons"
        :style="{ float: 'right', overflow: 'hidden' } "
      >
        <a-button @click="reset">重置</a-button>
      </span>
    </div>

    <s-table
      ref="table"
      size="middle"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :show-pagination="false"
    >
      <span slot="roleName" slot-scope="text,record">
        {{ text }}
        <a-tag color="red" v-if="record.isStatic">系统</a-tag>
        <a-tag color="blue" v-if="record.isDefault">默认</a-tag>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a-dropdown>
            <a class="ant-dropdown-link" href="#">
              操作
              <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="$refs.createOfEditModal.createOrEdit(record.id)">修改</a>
              </a-menu-item>
              <a-menu-item v-if="!record.isStatic">
                <a href="javascript:;" @click="deleteRole(record.id)">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </s-table>
    <create-or-edit-form ref="createOfEditModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getRoles, deleteRole } from '@/api/precise/role'
import { getAllPermissions } from '@/api/precise/permission'
import CreateOrEditForm from './modules/CreateOrEditForm'
import moment from 'moment'
import * as _ from 'lodash'

export default {
  components: {
    STable,
    Ellipsis,
    CreateOrEditForm
  },
  data() {
    return {
      // 权限
      permissions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '角色名称',
          dataIndex: 'displayName',
          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          customRender: (text, record, index) => moment(text).format('YYYY年MM月DD日')
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRoles(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    }
  },
  computed: {},
  created() {
    this.getPermissions()
  },
  methods: {
    // 获取权限
    getPermissions() {
      getAllPermissions()
        .then(response => {
          const result = response.result
          _.forEach(result.items, item => {
            item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName
          })
          this.permissions = result.items
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 删除角色
    deleteRole(id) {
      var ref = this
      this.$confirm({
        title: '确认删除吗 ?',
        content: '角色被删除，拥有此角色的用户将取消此角色.',
        onOk() {
          deleteRole({ Id: id })
            .then(response => {
              ref.$refs.table.refresh(true)
            })
            .catch(err => {
              ref.$message.error(err.message)
            })
        },
        onCancel() {}
      })
    },
    // 按权限查找
    handlePermissionChange() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    // 展开、收起
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    handleOk() {
      this.$refs.table.refresh()
    }
  }
}
</script>