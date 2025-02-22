<template>
  <div style="padding: 20px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <el-option label="上海区域" value="shanghai"></el-option>
          <el-option label="北京区域" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <!-- :required="ruleForm.region === 'shanghai'" -->
      <el-form-item label="活动数量" prop="bookNum">
        <el-input v-model="ruleForm.bookNum"></el-input>
      </el-form-item>
      <el-form-item label="文章标签" prop="article">
        <el-select
          v-model="ruleForm.article"
          filterable
          value-key="code"
          placeholder="请选择文章标签"
          ref="select">
          <el-option
            v-for="item in articleList"
            :key="item.code"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <div style="display: flex;">
          <div style="width: 240px">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </div>
          <span style="padding: 0 20px">-</span>
          <div style="width: 140px">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <!-- label 跟 content 垂直排列 -->
      <el-form-item label="活动性质" prop="type" class="vertical-layout" label-width="0px">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
const validateNumber = (rule, value, callback) => {
  console.log('validateNumber==', rule)
  if (!rule.required) return callback();
  if (value && !/(^0$)|(^[1-9][0-9]*$)/.test(value)) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      articleList: [
        {
          code: 'HTML',
          label: 'HTML',
          title: 'haha'
        },
        {
          code: 'CSS',
          label: 'CSS'
        },
        {
          code: 'JavaScript',
          label: 'JavaScript'
        }
      ],
      ruleForm: {
        name: '1223',
        bookNum: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        article: null
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        bookNum: [
          { required: true, message: '请输入活动数量', trigger: ['blur', 'change'] },
          { required: true, validator: validateNumber, message: '请输入正整数或0', trigger: ['blur', 'change'] },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ],
        // type: string,number,boolean,method,regexp,integer,float,array,object,enum,date,url,hex,email,any
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        article: [
          { type: 'object', required: true, message: '请选择文章标签', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // todo
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>

.line {
  display: inline-block;
  padding: 0 20px;
}
.vertical-layout {
  ::v-deep .el-form-item__label {
    float: none;
  }

  // ::v-deep .el-form-item__content {
  //   padding-left: 20px;
  // }

  // ::v-deep .el-form-item__error {
  //   left: 20px;
  // }
}
</style>