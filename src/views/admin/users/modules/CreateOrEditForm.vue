<template>
  <a-modal
    :title="userId? '修改用户' : '添加用户'"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
        <a-step title="基本信息"/>
        <a-step title="所属角色"/>
        <a-step title="组织机构"/>
      </a-steps>
      <a-form :form="form">
        <div v-show="currentStep === 0">
          <a-row :gutter="16">
            <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <div class="avatar-upload-preview">
                <img :src="profilePicture">
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="姓名" required>
                    <a-form-item :style="{ display: 'inline-block', width: '40%' }">
                      <a-input
                        v-decorator="['name',{rules: [{required: true, message: '请输入姓氏' }] }]"
                        placeholder="姓氏"
                      />
                    </a-form-item>
                    <a-form-item :style="{ display: 'inline-block', width: '60%' }">
                      <a-input
                        v-decorator="['surname',{rules: [{required: true, message: '请输入名字' }] }]"
                        placeholder="名字"
                      />
                    </a-form-item>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="用户名">
                    <a-input
                      v-decorator="['userName', {rules: [{ required: true, message: '请输入用户名'}]}]"
                      placeholder="用户名"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="邮箱地址">
                <a-input
                  v-decorator="['emailAddress', {rules: [ { type: 'email', message: '请输入正确的邮箱地址' }, { required: true, message: '请输入邮箱地址!', } ]}]"
                  placeholder="邮箱地址"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="手机号码">
                <a-input
                  v-decorator="['phoneNumber', {rules: [{ required: true, message: '请输入手机号!' },{ pattern:/^1(3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号!' }]}]"
                  placeholder="手机号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <div v-if="userId==undefined">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="密码">
                  <a-checkbox
                    @change="onSetRandomPasswordChange"
                    :checked="setRandomPassword"
                  >使用随机密码</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16" v-if="!setRandomPassword">
              <a-col :span="12">
                <a-form-item>
                  <a-input
                    v-decorator="['password',{ rules: [{ required: true, message: '请输入密码'}, { validator: validateToNextPassword}]}]"
                    type="password"
                    placeholder="密码"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item>
                  <a-input
                    v-decorator="['confirm', { rules: [{ required: true, message: '请确认您的密码!'}, { validator: compareToFirstPassword}]}]"
                    type="password"
                    @blur="handleConfirmBlur"
                    placeholder="确认密码"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <a-form-item label="其他选项" required>
            <a-form-item :style="{ display: 'inline-block' }">
              <a-checkbox
                v-decorator="['shouldChangePasswordOnNextLogin', {valuePropName: 'checked'}]"
              >下次登录需要修改密码</a-checkbox>
            </a-form-item>
            <a-form-item :style="{ display: 'inline-block' }">
              <a-checkbox @change="onSendActivationEmailChange">发送激活邮件</a-checkbox>
            </a-form-item>
            <a-form-item :style="{ display: 'inline-block' }">
              <a-checkbox v-decorator="['isActive', {valuePropName: 'checked'}]">激活</a-checkbox>
            </a-form-item>
            <a-form-item :style="{ display: 'inline-block'}">
              <a-checkbox v-decorator="['isLockoutEnabled', {valuePropName: 'checked'}]">是否启用锁定？</a-checkbox>
            </a-form-item>
          </a-form-item>
        </div>
        <div v-show="currentStep === 1">
          <a-form-item label="所属角色" required>
            <a-checkbox-group
              v-decorator="['assignedRoleNames',{ initialValue:selectedRoles,rules: [{ required: true, message: '请选择角色'}]}]"
              style="width: 100%;"
            >
              <a-row v-for="role in roles" :key="role.roleName">
                <a-col :span="8">
                  <a-checkbox :value="role.roleName">{{ role.roleDisplayName }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </div>
        <div v-show="currentStep === 2">
          <a-tree checkable :treeData="treeData" v-model="selectedOus"></a-tree>
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
      >{{ currentStep === 2 && '完成' || '下一步' }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import { Result } from '@/components'
import pick from 'lodash.pick'
import { getUserForEdit, createOrUpdateUser } from '@/api/precise/user'
import { getProfilePictureById } from '@/api/precise/profile'
import { createTree } from '@/utils/arrayToTreeConverter'
import { findNode, findParent } from '@/utils/treeDataHelper'
import appUrl from '@/core/precise/common/nav/appUrl'

const stepForms = [
  [
    'surname',
    'name',
    'userName',
    'emailAddress',
    'phoneNumber',
    'password',
    'shouldChangePasswordOnNextLogin',
    'isLockoutEnabled',
    'isActive'
  ],
  ['assignedRoleNames'],
  []
]

export default {
  components: {
    Result
  },
  data() {
    return {
      userId: undefined,
      profilePicture: null,
      roles: [],
      selectedRoles: [],
      treeData: [],
      selectedOus: [],
      setRandomPassword: false,
      sendActivationEmail: false,
      confirmDirty: false,
      visible: false,
      confirmLoading: false,
      currentStep: 0,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    createOrEdit(id) {
      this.userId = id
      this.visible = true
      this.confirmLoading = true
      getUserForEdit({ id: id })
        .then(response => {
          const result = response.result
          
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(result.user, stepForms[0]))
          })

          this.getProfilePicture(result.profilePictureId)

          this.roles = result.roles
          _.forEach(result.roles, r => {
            if (r.isAssigned) {
              this.selectedRoles.push(r.roleName)
            }
          })
          this.treeData = []
          this.treeData = createTree(result.allOrganizationUnits, 'parentId', 'id', null, 'children', [
            {
              target: 'key',
              targetFunction(item) {
                return item.id
              }
            },
            {
              target: 'title',
              source: 'displayName'
            }
          ])
          this.selectedOus = []
          _.forEach(result.memberedOrganizationUnits, ou => {
            const item = findNode(this.treeData, { data: { code: ou } })
            if (item) {
              this.selectedOus.push(item.key)
            }
          })
          this.confirmLoading = false
        })
        .catch(err => {
          this.confirmLoading = false
          this.$message.error(err.message)
        })
    },
    getProfilePicture(profilePictureId) {
      if (!profilePictureId) {
        this.profilePicture = appUrl.appRootUrl() + '/avatar2.jpg'
      } else {
        getProfilePictureById({ profilePictureId: profilePictureId })
          .then(response => {
            const result = response.result
            if (result && result.profilePicture) {
              this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture
            } else {
              this.profilePicture = appUrl.appRootUrl() + '/avatar2.jpg'
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    },
    // 是否随机密码
    onSetRandomPasswordChange(e) {
      this.setRandomPassword = e.target.checked
    },
    // 是否发送邮件
    onSendActivationEmailChange(e) {
      this.sendActivationEmail = e.target.checked
    },
    //确认密码
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    // 比较第一个密码
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('您输入的两个密码不一致!')
      } else {
        callback()
      }
    },
    // 验证下一个密码
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    // 下一步
    handleNext(step) {
      const {
        form: { validateFields }
      } = this
      const currentStep = step + 1
      if (currentStep <= 2) {
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
            user: {
              id: this.userId,
              ...values
            },
            assignedRoleNames: values.assignedRoleNames,
            sendActivationEmail: this.sendActivationEmail,
            setRandomPassword: this.setRandomPassword,
            organizationUnits: this.selectedOus
          }
          createOrUpdateUser(formData)
            .then(response => {
              this.confirmLoading = false
              this.visible = false
              this.currentStep = 0
              this.$emit('ok', { formData })
            })
            .catch(err => {
              this.confirmLoading = false
              this.$message.error(`${this.userId ? '修改' : '添加'}失败: ${err.message}`)
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