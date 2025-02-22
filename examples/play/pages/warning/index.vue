<template>
  <div style="padding: 16px">
    <el-form :model="form" :rules="rules">
      <el-form-item label="预警方式：" prop="value1">
        <el-radio-group v-model="form.value1">
          <el-radio label="Y">方式1</el-radio>
          <el-radio label="N">方式2</el-radio>
        </el-radio-group>  
      </el-form-item>
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
import AddModal from './AddModal.vue'
export default {
  components: { AddModal },
  data() {
    return {
      form: {
        value1: ''
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
  methods: {
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

</style>