<template>
  <a-modal
    :title="orgId ? '修改部门' : '添加部门'"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="名称">
            <a-input
              v-decorator="['displayName', {rules: [ { required: true, message: '名称!', } ]}]"
              placeholder="名称"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
const stepForms = ['displayName']
import { createOrganizationUnit, updateOrganizationUnit } from '@/api/precise/organizationUnit'

export default {
  data() {
    return {
      orgId: null,
      parentId: null,
      displayName: null,
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    createOrEdit(id, pid, name) {
      this.visible = true
      this.confirmLoading = true
      this.orgId = id
      this.parentId = pid
      this.displayName = name
      this.$nextTick(() => {
        this.form.setFieldsValue({ displayName: name })
      })
      this.confirmLoading = false
    },
    handleOk() {
      const {
        form: { validateFields }
      } = this
      validateFields(stepForms, (errors, values) => {
        if (!errors) {
          var formData = {
            id: this.orgId,
            parentId: this.parentId,
            ...values
          }
          if (!this.orgId)
            createOrganizationUnit(formData)
              .then(response => {
                this.confirmLoading = false
                this.visible = false
                this.$emit('refresh', { formData })
              })
              .catch(err => {
                this.confirmLoading = false
                this.$message.error(`添加失败: ${err.message}`)
              })
          else
            updateOrganizationUnit(formData)
              .then(response => {
                this.confirmLoading = false
                this.visible = false
                this.$emit('refresh', { formData })
              })
              .catch(err => {
                this.confirmLoading = false
                this.$message.error(`修改失败: ${err.message}`)
              })
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 取消
    handleCancel() {
      this.visible = false
    }
  }
}
</script>