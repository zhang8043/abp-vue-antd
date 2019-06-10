<template>
  <a-modal
    :title="roleId ? '修改角色' : '添加角色'"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
        <a-step title="角色名称"/>
        <a-step title="权限"/>
      </a-steps>
      <a-form :form="form">
        <div v-show="currentStep === 0">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="角色名称">
                <a-input
                  v-decorator="['displayName', {rules: [ { required: true, message: '请输入角色名称!', } ]}]"
                  placeholder="角色名称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item help="新用户将默认拥有此角色.">
                <a-checkbox v-decorator="['isDefault', {valuePropName: 'checked'}]">是否默认</a-checkbox>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div v-show="currentStep === 1">
          <a-tree checkable :treeData="treeData" v-model="selectedPermissions"></a-tree>
        </div>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="backward" v-if="currentStep > 0" :style="{ float: 'left' }">上一步</a-button>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button
        key="forward"
        :loading="confirmLoading"
        type="primary"
        @click="handleNext(currentStep)"
      >{{ currentStep === 1 && '完成' || '下一步' }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import { Result } from '@/components'
import pick from 'lodash.pick'
import { getRoleForEdit, createOrUpdateRole } from '@/api/precise/role'
import { createTree } from '@/utils/arrayToTreeConverter'
import { findNode, findParent } from '@/utils/treeDataHelper'
import appUrl from '@/core/precise/common/nav/appUrl'

const stepForms = [['displayName', 'isDefault'], []]

export default {
  components: {
    Result
  },
  data() {
    return {
      roleId: undefined,
      treeData: [],
      selectedPermissions: [],
      visible: false,
      confirmLoading: false,
      currentStep: 0,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    createOrEdit(id) {
      this.roleId = id
      this.visible = true
      this.confirmLoading = true
      this.treeData = []
      this.selectedPermissions = []
      getRoleForEdit({ id: id })
        .then(response => {
          const result = response.result
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(result.role, stepForms[0]))
          })

          this.treeData = createTree(result.permissions, 'parentName', 'name', null, 'children', [
            {
              target: 'key',
              targetFunction(item) {
                return item.name
              }
            },
            {
              target: 'title',
              source: 'displayName'
            }
          ])

          _.forEach(result.grantedPermissionNames, permission => {
            const item = findNode(this.treeData, { data: { name: permission } })
            if (item) {
              this.selectedPermissions.push(item.key)
            }
          })

          this.confirmLoading = false
        })
        .catch(err => {
          this.confirmLoading = false
          this.$message.error(err.message)
        })
    },
    // 下一步
    handleNext(step) {
      const {
        form: { validateFields }
      } = this
      const currentStep = step + 1
      if (currentStep <= 1) {
        validateFields(stepForms[this.currentStep], (errors, values) => {
          if (!errors) {
            this.currentStep = currentStep
          }
        })
        return
      }
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var formData = {
            role: {
              id: this.roleId,
              ...values
            },
            grantedPermissionNames: this.selectedPermissions
          }
          createOrUpdateRole(formData)
            .then(response => {
              this.confirmLoading = false
              this.visible = false
              this.currentStep = 0
              this.$emit('ok', { formData })
            })
            .catch(err => {
              this.confirmLoading = false
              this.$message.error(`${this.roleId ? '修改' : '添加'}失败: ${err.message}`)
            })
        } else {
          this.confirmLoading = false
          this.currentStep = 0
        }
      })
    },
    // 上一步
    backward() {
      this.currentStep--
    },
    // 取消
    handleCancel() {
      this.visible = false
      this.currentStep = 0
    }
  }
}
</script>
<style lang="less" scoped>
.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
.avatar-upload-preview {
  width: 220px;
  height: 220px;
  margin: 0 auto;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>