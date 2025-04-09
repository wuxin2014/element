<template>
  <div style="padding: 16px">
    <el-form :model="form" :rules="rules">
      <el-form-item label="预警方式：" prop="value1">
        <el-radio-group v-model="form.value1">
          <el-radio label="Y">方式1</el-radio>
          <el-radio label="N">方式2</el-radio>
        </el-radio-group>  
      </el-form-item>
      <div v-if="form.value1 === 'Y'">
        <div
          v-for="(item, index) in form.wrnng_rto_list"
          :key="item.uuid"
          style="display: flex;">
          <el-form-item
            label="交易所:"
            label-width="78px"
            :prop="'wrnng_rto_list.' + index + ' .wrnng_exchng_cd'"
            :rules="[{ type: 'array',required: true, message: '请选择交易所', trigger: 'change'}]"
            style="margin-right:14px">
            <!-- 交易所支持多选+全选 -->
            <multiple-select
              v-model="item.wrnng_exchng_cd"
              :option-list="exchangeList"
              :field="{label: 'wrnng_exchng_nm', value:'wrnng_exchng_cd'}"
              :disabled="isDetail"
              placeholder="请选择交易所"
              style="width:160px"
              @change="(checkedList, clickItem) => handleExchangeChange(item, index, clickItem)">
            </multiple-select>
          </el-form-item>
          <el-form-item
            label="比例预警:"
            :prop="'wrnng_rto_list.' + index + '.rtoList'"
            :rules="{ required: true, validator: wrnngRtoListRules, trigger: 'change'}"
            label-width="98px">
            <div
              style="display: flex"
              class="rtoList">
              <el-form-item
                v-for="(rtoItem, idx) in item.rtoList"
                :key="idx"
                :prop="'wrnng_rto_list.'+ index + '.rtoList.'+ idx + '.value'"
                :rules="{ validator: wrnngRtoRules, payload: { list: item.rtoList,curIndex: idx }, trigger: 'blur'}"
                label-width="0px"
                style="margin-right: 10px">
                <el-input
                  v-model="rtoItem.value"
                  :disabled="isDetail ||item.wrnng_exchng_cd.length === 0"
                  placeholder="请输入比例"
                  style="width: 200px">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label-width="0px">
            <div class="rto-opt-btn-wrap">
              <i v-if="showRtoAddBtn"
                class="el-icon-circle-plus-outline"
                @click="handleAddRto">
              </i>
              <i class="el-icon-remove-outline"
                v-if="index !== 0 && form.wrnng_rto_list.length > 1 && !isDetail"
                style="margin-left: 10px"
                @click="handleRemoveRto(item.uuid)">
              </i>
            </div>
          </el-form-item>
        </div>
      </div>
      <div v-else="form.value1 === 'N'">
        <el-form-item label="预警异常：">
          <el-button type="primary" @click="handeleAdd">新增</el-button>
        </el-form-item>
        <div v-if="targetList.length > 0">
          <el-button type="primary" @click="handeleModify">修改</el-button>
          <el-button type="primary" @click="handeleDelete">删除</el-button>
        </div>
        <el-row v-for="item in targetList" :key="item.exchange_code" class="list-wrap">
          <el-col>
            <el-row v-for="vItem in item.list" :key="vItem.variety_code" class="list-item">
              <el-form-item label="" label-width="0px">
                <el-checkbox v-model="vItem.checked"></el-checkbox>
              </el-form-item>
              <el-col :span="6">
                <el-form-item label="交易所：" label-width="82px">
                  <div class="text-ele">{{ item.exchange_name }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="品种：" label-width="82px">
                  <div class="text-ele">{{ vItem.variety_name }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-row v-for="(instItem, index) in vItem.list" :key="index" :gutter="24">
                  <el-col :span="12">
                    <el-form-item :label="`合约${vItem.list.length === 1 ? '' : index + 1}:`" label-width="82px">
                      <div class="text-ele">{{ instItem.inst_id.join('\\') }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="`预警值${vItem.list.length === 1  ? '' : index + 1}:`" label-width="82px">
                      <div class="text-ele">{{ instItem.warningVal }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <AddModal
      :visible="isShow"
      :modalType="modalType"
      :editItem="editItem"
      @close="isShow = false"
      @ok="handleAddOk"
    />
  </div>
</template>

<script>
import AddModal from './components/AddModal.vue'
import MultipleSelect from './components/MultipleSelect.vue'
let rtoUuid = 1
export default {
  components: { AddModal, MultipleSelect },
  data() {
    return {
      form: {
        value1: '',
        wrnng_rto_list: [{ uuid:rtoUuid, wrnng_exchng_cd:[], rtoList: [{ value: '' },{ value: '' },{ value: '' }]}],
      },
      rules: {},
      isShow: false,
      addList: [],
      targetList: [
        // {
        //   exchange_code: '1',
        //   exchange_name: '中',
        //   list: [
        //     {
        //       variety_code: '11',
        //       variety_name: 'MA',
        //       list: [
        //         {
        //           warningVal: '',
        //           inst_id: []
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],
      modalType: 'create',
      editItem: null
    }
  },
  computed: {
    showRtoAddBtn() {
      return true
    }
  },
  methods: {
    wrnngRtoListRules(rule, value, callback) {
      // console.log('value=-=', value)
      if (value.every(item => !item.value)) {
        callback(new Error('请至少输入一个预警值'))
      } else {
        callback()
      }
    },
    wrnngRtoRules(rule, value, callback) {
      if (rule.field) {
        const filed = rule.field.substring(0,rule.field.index0f('.rtoList'))
        this.$refs.formRef.validateField(`${filed}.rtoList`)
      }
      if (!value) {
        return callback()
      }
      const regex = /^[1-9]\d*$/
      if (!regex.test(value) || Number(value) === 0 || Number(value) > 100) {
        callback(new Error('请输入1-100的整数'))
      } else {
        const { list, curIndex } = rule.payload
        if (curIndex > 0) {
          // 填写完校验是不是比前一个框大
          const prevValue = list[curIndex - 1].value
          if (!prevValue || Number(value) <= Number(prevValue)) {
            this.$Message.error('请按由小到大的顺序从左到右依次填写预警值。')
            list[curIndex].value = ''
          }
        }
        callback()
      }
    },
    handleAddRto() {
      rtoUuid++;
      this.form.wrnng_rto_list.push({
        uuid: rtoUuid,
        wrnng_exchng_cd:[],
        rtoList: [{ value: '' }, { value: ''}, { value: '' }]
      });
    },
    handleRemoveRto(uid) {
      this.form.wrnng_rto_list = this.form.wrnng_rto_list.filter(item => item.uuid !== uid)
    },
    handleExchangeChange(curItem, index, clickItem) {
      console.log('==handleExchangeChange===', curItem, index, clickItem)
      this.$refs.formRef.validateField(`wrnng_rto_list.${index}.wrnng_exchng_cd`)
      const isRepeat = this.form.wrnng_rto_list.filter(item => item.uuid !== curItem.uuid).some(item => {
        let flag = false
        for (let key of curItem.wrnng_exchng_cd) {
          if (item.wrnng_exchng_cd.includes(key)) {
            flag = true
            break
          }
			  }
        return flag
      })
      if (isRepeat) {
        curItem.wrnng_exchng_cd = curItem.wrnng_exchng_cd.filter(v => clickItem && clickItem.value !== v)
        this.$Message.error('您已设置过当前交易所限额，请重新勾选')
        return
      }
    },
    handeleAdd() {
      this.editItem = null
      this.modalType = 'create'
      this.isShow = true
    },
    handeleModify() {
      const newList = []
      this.targetList.forEach(item => {
        item.list.forEach(vItem => {
          vItem.checked && newList.push({
            ...vItem,
            exchange_code: item.exchange_code,
            exchange_name: item.exchange_name,
          })
        })
      })
      if (newList.length === 0) {
        this.$message.error('请选择您要修改的数据');
        return;
      }
      if (newList.length > 1) {
        this.$message.error('每次只能选择一条数据修改，请重新选择');
        return;
      }
      this.editItem = newList[0]
      this.modalType = 'update'
      this.isShow = true
    },
    handeleDelete() {
      const newList = []
      this.targetList.forEach(item => {
        item.list.forEach(vItem => {
          vItem.checked && newList.push(vItem)
        })
      })
      if (newList.length === 0) {
        this.$message.error('请勾选您要删除的数据');
        return;
      }
      this.$confirm('您确认删除数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
      }).catch(() => {
               
      });
    },
    handleAddOk(data) {
      this.isShow = false
      const newList = this.addList.map(item => ({ ...item }))
      // 处理数据
      const findItem = newList.find(item => item.exchange_code === data.exchange_code && item.variety_code === data.variety_code)
      if (findItem) {
        data.list.forEach(wItem => {
          const nItem = findItem.list.find(a => a.id === wItem.id)
          if (nItem) {
            nItem.warningVal = wItem.warningVal
            const inst_ids = nItem.inst_id.concat(wItem.inst_id).sort((a, b) => a > b ? 1 : -1) // 排序
            nItem.inst_id = Array.from(new Set(inst_ids)) // 去重复
          } else {
            findItem.list.push(wItem)
          }
        })
      } else {
        newList.push(data)
      }

      // 按交易所，品种排序
      newList.sort((a, b) => {
        if (a.exchange_code !== b.exchange_code) {
          return a.exchange_code > b.exchange_code ? 1 : -1;
        } else if (a.variety_code !== b.variety_code) {
          return a.variety_code > b.variety_code ? 1 : -1;
        }
        return 0;
      })
      // 按合约排序
      newList.forEach(item => {
        item.list.sort((a, b) => a.inst_id[0] > b.inst_id[0] ? 1 : -1)
      })
      // 分组
      const tList = []
      newList.forEach(item => {
        const findExchangeItem = tList.find(it => it.exchange_code === item.exchange_code)
        if (!findExchangeItem) {
          tList.push({
            exchange_code: item.exchange_code,
            exchange_name: item.exchange_name,
            list: [
              {
                checked: item.checked || false,
                variety_code: item.variety_code,
                variety_name: item.variety_name,
                list: item.list
              }
            ]
          })
        } else {
          const findVItem = findExchangeItem.list.find(it => it.variety_code === item.variety_code)
          if (!findVItem) {
            findExchangeItem.list.push({
              checked: item.checked || false,
              variety_code: item.variety_code,
              variety_name: item.variety_name,
              list: item.list
            })
          }
        }
      })
      console.log('==', tList)
      this.targetList = tList;
      this.addList = newList;
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrap {
  margin-top: 16px;
  border: 1px solid #E4E7ED;
  .list-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px dashed #E4E7ED;
    &:last-child {
      border-bottom: none;
    }
  }
}

.text-ele {
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  padding: 0 15px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #F5F7FA;
  border: 1px solid #E4E7ED; // #DCDFE6
  color: #C0C4CC; // #606266
  cursor: pointer;
}

.rto-opt-btn-wrap {
  display: flex;
  align-items: center;
  font-size: 24px;
  color: red;
  cursor: pointer;
}

</style>