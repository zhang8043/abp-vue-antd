<template>
  <a-card :bordered="false" style="height: 500px;width: 100%;overflow:hidden">
    <div class="department-outer">
      <div class="zoom-box">
        <zoom-controller v-model="zoom" :min="20" :max="200"></zoom-controller>
      </div>
      <div class="view-box">
        <org-view
          v-if="data"
          :data="data"
          :zoom-handled="zoomHandled"
          @on-menu-click="handleMenuClick"
        ></org-view>
      </div>
    </div>
    <create-or-edit-form ref="createOfEditModal" @refresh="onRefresh"/>
  </a-card>
</template>

<script>
import moment from 'moment'
import * as _ from 'lodash'
import { getOrganizationUnits, deleteOrganizationUnit } from '@/api/precise/organizationUnit'
import { createTree } from '@/utils/arrayToTreeConverter'
import { findNode, findParent } from '@/utils/treeDataHelper'
import './index.less'
import OrgView from './components/org-view.vue'
import ZoomController from './components/zoom-controller.vue'
import CreateOrEditForm from './modules/CreateOrEditForm'

export default {
  components: {
    OrgView,
    ZoomController,
    CreateOrEditForm
  },
  data() {
    return {
      data: null,
      zoom: 100
    }
  },
  computed: {
    zoomHandled() {
      return this.zoom / 100
    }
  },
  created() {
    //加载数据
    this.getDepartmentData()
  },
  methods: {
    // 右键菜单点击事件
    handleMenuClick({ key, item, domEvent }) {
      const label = domEvent.target.getAttribute('data-label')
      const vkey = domEvent.target.getAttribute('data-vkey')
      switch (key) {
        // 查看部门成员
        case 'onView':
          this.$message.success(vkey)
          break
        // 添加子级部门
        case 'onAddChild':
          this.$refs.createOfEditModal.createOrEdit(null, vkey)
          break
        // 修改
        case 'onEdit':
          this.$refs.createOfEditModal.createOrEdit(vkey, null, label)
          break
        // 删除
        default:
        case 'onDelete':
          this.deleteOrganization(vkey, label)
          break
      }
    },
    // 获取部门数据  转换为树形结构
    getDepartmentData() {
      this.data = null
      getOrganizationUnits().then(response => {
        const result = response.result
        var treeData = createTree(result.items, 'parentId', 'id', null, 'children', [
          {
            target: 'id',
            targetFunction(item) {
              return item.id
            }
          },
          {
            target: 'parentId',
            source: 'parentId'
          },
          {
            target: 'label',
            source: 'displayName'
          }
        ])

        this.data = {
          label: 'abp-vue-antd',
          children: treeData
        }
        // this.data = { ...treeData[0] }
      })
    },
    deleteOrganization(id, name) {
      var ref = this
      this.$confirm({
        title: '确认删除吗 ?',
        content: `部门 ${name} 将被删除.`,
        onOk() {
          deleteOrganizationUnit({ id: id })
            .then(response => {
              if (response.success) {
                ref.getDepartmentData()
              }
            })
            .catch(err => {
              ref.$message.error(err.message)
            })
        },
        onCancel() {}
      })
    },
    onRefresh(e) {
      this.getDepartmentData()
    }
  }
}
</script>

<style lang="less">
</style>