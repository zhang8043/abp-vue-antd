<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item>
              <a-input-search
                v-model="queryParam.filter"
                style="width: 100%"
                placeholder="模糊查询"
                @search="$refs.table.refresh(true)"
                enterButton="查询"
              />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="10" :sm="24">
              <a-form-item>
                <a-select v-model="queryParam.permission" placeholder="按权限查找">
                  <a-select-option
                    v-for="permission in permissions"
                    :value="permission.name"
                    :key="permission.name"
                  >{{ permission.displayName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-form-item>
                <a-select v-model="queryParam.role" placeholder="按角色查找">
                  <a-select-option
                    v-for="role in roles"
                    :value="role.id"
                    :key="role.id"
                  >{{ role.displayName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-checkbox @change="onOnlyLockedUsers">仅已锁定用户</a-checkbox>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createOfEditModal.createOrEdit()">添加用户</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete"/>删除
          </a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2">
            <a-icon type="lock"/>锁定
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
        <a @click="toggleAdvanced" style="margin-left: 8px">
          {{ advanced ? '收起' : '展开' }}
          <a-icon :type="advanced ? 'up' : 'down'"/>
        </a>
      </span>
    </div>

    <s-table
      ref="table"
      size="middle"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :show-pagination="true"
    >
      <span slot="roleName" slot-scope="values">
        <a-tag v-for="tag in values" color="blue" :key="tag.roleId">{{ tag.roleName }}</a-tag>
      </span>
      <span slot="organizationUnitName" slot-scope="text,record">
        <a-tooltip>
          <template slot="title" v-if="record.organizationUnits.length>0">
            <p>所属组织机构：</p>
            <p
              v-for="tag in record.organizationUnits"
              :key="tag.organizationUnitId"
            >{{ tag.organizationUnitName }}</p>
          </template>
          <a-badge
            :count="record.organizationUnits.length"
            :offset="[10]"
            :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
          >{{ text }}</a-badge>
        </a-tooltip>
      </span>
      <span slot="isActive" slot-scope="isActive">
        <a-tag color="blue" v-if="isActive">是</a-tag>
        <a-tag color="red" v-else>否</a-tag>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a-dropdown>
            <a class="ant-dropdown-link" href="#">
              操作
              <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.id !== currentUser.id">
                <a href="javascript:;">使用这个用户登录</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="$refs.createOfEditModal.createOrEdit(record.id)">修改</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="$refs.editUserPermissions.edit(record.id)">权限</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="unlockUsers(record.id)">解锁</a>
              </a-menu-item>
              <a-menu-item v-if="record.id !== currentUser.id">
                <a href="javascript:;" @click="deleteUser(record.id)">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </s-table>
    <create-or-edit-form ref="createOfEditModal" @ok="handleOk"/>
    <edit-user-permissions ref="editUserPermissions" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getUsers, unlockUser, deleteUser } from '@/api/precise/user'
import { getAllPermissions } from '@/api/precise/permission'
import { getRoles } from '@/api/precise/role'
import CreateOrEditForm from './modules/CreateOrEditForm'
import EditUserPermissions from './modules/EditUserPermissions'
import moment from 'moment'
import * as _ from 'lodash'

export default {
  components: {
    STable,
    Ellipsis,
    CreateOrEditForm,
    EditUserPermissions
  },
  data() {
    return {
      // 角色
      roles: [],
      // 权限
      permissions: [],
      // 当前登录用户
      currentUser: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'organizationUnitName' }
        },
        {
          title: '姓名',
          dataIndex: 'fullName'
        },
        {
          title: '角色',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: '邮箱地址',
          dataIndex: 'emailAddress'
        },
        {
          title: '手机号',
          dataIndex: 'phoneNumber'
        },
        {
          title: '激活',
          dataIndex: 'isActive',
          scopedSlots: { customRender: 'isActive' }
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
        return getUsers(Object.assign(parameter, this.queryParam))
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
  computed: {
    // 获取应用信息
    appSession() {
      return this.$store.getters.appSession
    }
  },
  created() {
    this.currentUser = this.appSession.user
    this.getPermissions()
    this.getRole()
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
    // 获取角色
    getRole() {
      getRoles(undefined)
        .then(response => {
          const result = response.result
          this.roles = result.items
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    deleteUser(id) {
      var ref = this
      this.$confirm({
        title: '确认删除吗 ?',
        content: '用户将被删除.',
        onOk() {
          deleteUser({ Id: id })
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
    //解锁用户
    unlockUsers(id) {
      unlockUser({ id: id })
        .then(response => {
          this.$refs.table.refresh(true)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 仅显示锁定用户
    onOnlyLockedUsers(e) {
      this.queryParam.onlyLockedUsers = e.target.checked
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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