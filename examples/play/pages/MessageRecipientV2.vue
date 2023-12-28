<template>
  <el-dialog
    :visible="visible"
    width="700px"
    title="请填写业务进度通知的接收信息"
    center
    class="custom_dialog_wrap"
    :close-on-click-modal="false"
    @close="handleClose" >
    <el-form
      label-width="90px"
      ref="messageForm"
      :rules="messageConnectRule"
      :model="connectPersonForm"
      size="small"
    >
      <div>【短信】</div>
      <el-form-item
        class="btn_select"
        label="联系人："
        prop="connectPerson"
        style="height:100%;"
      >
        <el-select
          multiple
          v-model="connectPersonForm.connectPerson"
          placeholder="请选择"
          style="width: 100%;"
          :popper-append-to-body="false"
          @change="changeConnect($event, 'connectPerson')"
        >
          <el-option
            v-for="item in connectPersonList"
            :key="item.id"
            :label="`${item.name} - ${item.phone_number}`"
            :value="item.phone_number">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="isShowOtherConnect">
        <div>
          <div>其他接收人员信息：</div>
          <div
            class="btn_select"
            v-for="(senderItem, index) in connectPersonForm.ready_sender_list"
            :key="senderItem.uuid"
            style="margin-left: 150px"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item
                  label-width="0px"
                  :prop="'ready_sender_list.' + index + '.sender_name'"
                  :rules="{
                    required: true, message: '请输入姓名', trigger: 'change'
                  }">
                  <el-input
                    placeholder="姓名"
                    v-model="senderItem.sender_name"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                style="text-align: center">—</el-col>
              <el-col :span="8">
                <el-form-item
                  label-width="0px"
                  :prop="'ready_sender_list.' + index + '.mobile_number'"
                  :rules="[
                    { required: true, message:'请输入手机号', trigger: 'change'},
                    { pattern: /^1[3456789]\d{9}$/,  message: '手机号码格式不正确' }
                  ]">
                  <el-input
                    class="number-select"
                    placeholder="手机号"
                    @blur="handleMobile(senderItem)"
                    v-model="senderItem.mobile_number"
                    style="width: 100%"/>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                style="margin-left: 30px;">
                <el-button
                  size="small"
                  class="el-icon-plus"
                  @click="addPerson"></el-button>
                <el-button
                  size="small"
                  class="el-icon-delete"
                  @click.prevent="removePerson(senderItem.uuid)"></el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div>【邮件】</div>
      <el-form-item
        class="btn_select"
        prop="connectEmail"
        label="邮箱："
        label-width="70px"
        style="height:100%;"
      >
        <el-select
          multiple
          v-model="connectPersonForm.connectEmail"
          placeholder="请选择"
          style="width: 100%;"
          :popper-append-to-body="false"
          @change="changeConnect($event, 'email')"
        >
          <el-option
            v-for="item in mailboxList"
            :key="item.id"
            :label="`${item.email}`"
            :value="item.email">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="isShowOtherEmail">
        <div>
          <div>其他接收邮箱信息：</div>
          <div
            class="btn_select"
            v-for="(emailItem, index) in connectPersonForm.email_sender_list"
            :key="emailItem.key"
            style="margin-left: 150px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label-width="0px"
                  :prop="'email_sender_list.' + index + '.email'"
                  :rules="[
                    { required: true, message:'请输入邮箱', trigger: 'change'},
                    { pattern: /^[\w-]+(\.[\w-]+)*@([\w-](-[\w-])?)+(\.{1,2}[\w-]+)+$/,  message: '邮箱格式不正确' }
                  ]">
                  <el-input
                    placeholder="请输入邮箱"
                    @blur="handleEmail(emailItem)"
                    v-model="emailItem.email"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div style="margin-left: 30px">
                  <el-button
                    size="small"
                    class="el-icon-plus"
                    @click="addEmail"></el-button>
                  <el-button
                    size="small"
                    class="el-icon-delete"
                    @click.prevent="removeEmail(emailItem.uuid)"></el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
    <div
      slot="footer"
      style="text-align: center">
      <el-button
        type="primary"
        :loading="reqLoading"
        @click="handleMessageConfirm">确认
      </el-button>
    </div>
  </el-dialog>
</template>
<script>

let connectUuid = 1
let emailUuid = 1

export default {
  name: 'MessageRecipientV2',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 联系人选择列表数据
    connectPersonList: {
      type: Array,
      default: () => []
    },
    // 邮箱选择列表数据
    mailboxList: {
      type: Array,
      default: () => []
    },
    // 已选联系人
    selectedPersons: {
      type: Array,
      default: () => []
    },
    // 已选邮箱
    selectedEmails: {
      type: Array,
      default: () => []
    },
    reqLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowOtherConnect: false,
      isShowOtherEmail: false,
      messageConnectRule: {},
      connectPersonForm: {
        connectPerson: [], // 短信接收人
        ready_sender_list: [],
        connectEmail: [], // 邮箱接收人
        email_sender_list: []
      },
    }
  },
  watch: {
    'visible': {
      handler(newVal) {
        if (newVal) {
          // 短信接收人回显
          this.connectPersonForm.connectPerson = this.selectedPersons.map(item => item.mobile_number)
          this.connectPersonForm.connectEmail = this.selectedEmails.map(item => item.email)
        }
      },
      immediate: true
    },
  },
  methods: {
    // 关闭短信对话框清空消息
    handleClose() {
      this.$refs['messageForm'].resetFields()
      this.isShowOtherConnect = false
      this.isShowOtherEmail = false
      this.$emit('close')
    },
    // 改变短信联系人，看是否包括其他
    changeConnect(e, type) {
      if (e.includes('其他')) {
        if (type == 'connectPerson') {
          connectUuid = 1
          this.isShowOtherConnect = true
          this.connectPersonForm.ready_sender_list = [{
            sender_name: '',
            mobile_number: '',
            source: 'input',
            uuid: 'uuid-' + connectUuid
          }]
        } else {
          emailUuid = 1
          this.isShowOtherEmail = true;
          this.connectPersonForm.email_sender_list = [{
            email: '',
            source: 'input',
            uuid: 'uuid-' + emailUuid
          }]
        }
      } else {
        if (type == 'connectPerson') {
          this.isShowOtherConnect = false
          this.connectPersonForm.ready_sender_list = []
        } else {
          this.isShowOtherEmail = false
          this.connectPersonForm.email_sender_list = []
        }
      }
    },
    // 校验手机号
    handleMobile(curItem) {
      console.log('handleMobile===', curItem, this.connectPersonForm.ready_sender_list);
      if (curItem.mobile_number) {
        const isRepeat = this.connectPersonForm.ready_sender_list.filter(item => item.uuid !== curItem.uuid).some(item => item.mobile_number === curItem.mobile_number)
        let i = this.connectPersonList.findIndex(item => curItem.mobile_number === item.phone_number);
        if (isRepeat || i != -1) {
          curItem.mobile_number = ''
          this.$Message.error('该手机号已存在，请勿重复添加')
        }
      }
    },
    // 校验邮箱
    handleEmail(curItem) {
      console.log('handleEmail===', curItem, this.connectPersonForm.email_sender_list);
      if (curItem.email) {
        const isRepeat = this.connectPersonForm.email_sender_list.filter(item => item.uuid !== curItem.uuid).some(item => item.email === curItem.email)
        let i = this.mailboxList.findIndex(item => curItem.email === item.email);
        if (isRepeat || i != -1) {
          curItem.email = ''
          this.$message.error('该邮箱已存在，请勿重复添加')
        }
      }
    },
    // 增加短信联系人
    addPerson() {
      if (this.connectPersonForm.ready_sender_list.length < 5) {
        connectUuid++;
        this.connectPersonForm.ready_sender_list.push({
          sender_name: '',
          mobile_number: '',
          source: 'input',
          uuid: 'uuid-' + connectUuid
        });
      } else {
        this.$message.error('最多上传五位新联系人')
      }
    },
    // 删除短信联系人
    removePerson(uuid) {
      this.connectPersonForm.ready_sender_list = this.connectPersonForm.ready_sender_list.filter(item => item.uuid !== uuid)
      if (this.connectPersonForm.ready_sender_list.length === 0) {
        this.connectPersonForm.connectPerson = this.connectPersonForm.connectPerson.filter(item => item !== '其他')
        this.isShowOtherConnect = false
        this.connectPersonForm.ready_sender_list = []
      } else {
        this.isShowOtherConnect = true
      }
    },
    // 增加邮箱
    addEmail() {
      if (this.connectPersonForm.email_sender_list.length < 10) {
        emailUuid++;
        this.connectPersonForm.email_sender_list.push({
          email: '',
          source: 'input',
          uuid: 'uuid-' + emailUuid
        });
      } else {
        this.$message.error('最多上传十个新邮箱')
      }
    },
    // 移除邮箱
    removeEmail(uuid) {
      this.connectPersonForm.email_sender_list = this.connectPersonForm.email_sender_list.filter(item => item.uuid !== uuid)
      if (this.connectPersonForm.email_sender_list.length === 0) {
        this.connectPersonForm.connectEmail = this.connectPersonForm.connectEmail.filter(item => item !== '其他')
        this.isShowOtherEmail = false
        this.connectPersonForm.email_sender_list = []
      } else {
        this.isShowOtherEmail = true
      }
    },
    disposeData() {
      let {connectPerson, ready_sender_list, connectEmail, email_sender_list} = this.connectPersonForm;
      let data = {};
      let ready_list = [], email_info_list = [];

      this.connectPersonList.forEach(item => {
        if (connectPerson.includes(item.phone_number)) {
          ready_list.push({
            sender_name: item.name,
            mobile_number: item.phone_number,
            source: 'select'
          })
        }
      })

      this.mailboxList.forEach(item => {
        if (connectEmail.includes(item.email)) {
          email_info_list.push({
            email: item.email,
            source: 'select'
          })
        }
      })
      
      let newReadyList = removePhone(ready_list) // 去重处理
      data.ready_sender_list = newReadyList.filter(item => item.sender_name !== '其他');
      data.email_info_list = email_info_list.filter(item => item.email !== '其他');

      ready_sender_list.forEach(item => {
        if (item.sender_name !== '') {
          data.ready_sender_list.push(item)
        }
      })

      email_sender_list.forEach(item => {
        if (item.email !== '') {
          data.email_info_list.push(item)
        }
      })
      return data;
    },

    // 点击短信确定按钮
    handleMessageConfirm() {
      /*if (!this.connectPersonForm.connectPerson.length && !this.connectPersonForm.connectEmail.length) {
        return this.$Message.error('请至少选择一种接收通知方式。');
      }*/
      this.$refs['messageForm'].validate((valid) => {
        if (valid) {
          // const paramsData = this.disposeData();
          console.log('paramsData==', paramsData)
          this.$emit('pageInfoSubmit', paramsData)
        } else {
          return false
        }
      })
    },
  }
}
</script>
<style lang="scss">
.custom_dialog_wrap {
  display: flex;
  justify-content: center;
  align-items: center;

  .title-text {
    font-weight: bold;
    font-size: 20px;
  }

  .el-dialog {
    margin: 0 auto !important;
    max-height: calc(100% - 40px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      max-height: calc(100% - 160px);
      overflow-y: auto;
      border-top: 1px solid #DCDFE6;
      border-bottom: 1px solid #DCDFE6;
    }
  }
}
</style>