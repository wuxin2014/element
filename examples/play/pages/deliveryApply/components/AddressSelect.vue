<template>
  <div class="address-select-wrap">
    <div class="flex-wrap">
      <el-select
        v-model="address.province_name"
        filterable
        :disabled="disabled"
        placeholder="省/自治区"
        :popper-append-to-body="false"
        popper-class="custom_poper_class"
        class="address-item-select"
        @change="changeProvince">
        <el-option
          v-for="item in provinceList"
          :key="item.region_code"
          :label="item.region_name"
          :value="item.region_name">
        </el-option>
      </el-select>
      <el-select
        v-model="address.city_name"
        filterable
        :disabled="disabled"
        placeholder="市/县"
        :popper-append-to-body="false"
        popper-class="custom_poper class"
        class="address-item-select"
        @change="changeCity">
        <el-option
          v-for="item in cityList"
          :key="item.region_code"
          :label="item.region_name"
          :value="item.region_name">
        </el-option>
      </el-select>
      <el-select
        v-model="address.area_name"
        filterable
        :disabled="disabled"
        placeholder="区/县"
        :popper-append-to-body="false"
        popper-class="custom_poper_class"
        class="address-item-select"
        @change="changeArea">
        <el-option
          v-for="item in areaList"
          :key="item.region_code"
          :label="item.region_name"
          :value="item.region_name">
        </el-option>
      </el-select>
    </div>
    <div style="margin-top: 12px">
      <el-input
        v-model="address.other_info"
        type="textarea"
        placeholder="请输入详细地址"
        @blur="handleBlur">
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      provinceList: [],//省级列表
      cityList: [], // 城市列表
      areaList: [],// 区列表
      address: {
        province_code: '',
        province_name: '',
        city_code: '',
        city_name: '',
        area_code: '',
        area_name: '',
        other_info: '',
      }
    }
  },
  watch: {
    value: {
      handler() {
        this.initData()
      },
      deep: true
    }
  },
  mounted() {
    this.fecthProvinceList()
    this.address = {
      ...this.address,
      ...this.value
    }
  },
  methods: {
    async initData() {
      if (this.value.province_name === this.address.province_name
        && this.value.city_name === this.address.city_name
        && this.value.area_name === this.address.area_name
        && this.value.other_info === this.address.other_info) {
        return
      }
      this.address = {
        ...this.address,
        ...this.value
      }
      await this.fecthProvinceList()

      if (this.address.province_name) {
        await this.fetchCityList()
      }

      if (this.address.city_name) {
        this.fetchAreaList()
      }
    },
    handleBlur() {
      this.setAddress()
    },
    changeProvince() {
      this.address.city_name = ''
      this.address.city_code = ''
      this.address.area_name = ''
      this.address.area_code = ''
      this.address.other_info = ''
      this.cityList = []
      this.areaList = []
      this.setAddress()
      this.fetchCityList()
    },
    changeCity() {
      this.address.area_name = ''
      this.address.area_code = ''
      this.address.other_info = ''
      this.areaList = []
      this.setAddress()
      this.fetchAreaList()
    },
    changeArea() {
      this.address.other_info = ''
      this.setAddress()
    },
    fecthProvinceList() {
      if (this.provincelist.length > 0) return
      return queryRegion({
        parent_code: '0',
        level: '1'
      }).then(res => {
        this.provincelist = res.data || []
      })
    },
    fetchCityList() {
      if (this.cityList.length > 0) return
      const otherItem = { level: '2', region_name: '其他', code: 'other-name'}
      if (this.address.province_name === '其他') {
        this.cityList = [otherItem]
        return
      }
      const provinceCode = this.provinceList.find(item => item.region_name === this.address.province_name)?.region_code
      return queryRegion({
        parent_code: provinceCode,
        level: '2'
      }).then(res => {
        this.cityList = res.data || []
        this.cityList.push(otherItem)
      })
    },
    fetchAreaList() {
      if (this.areaList.length > 0) return
      const otherItem = { level: '3', region_name:'其他',code: 'other-name'}
      if (this.address.city_name === '其他') {
        this.areaList = [otherItem]
        return
      }
      const cityCode = this.cityList.find(item => item.region_name === this.address.city_name)?.region_code
      queryRegion({
        parent_code: cityCode,
        level: '3'
      }).then(res =>{
        this.areaList - res.data || []
        this.areaList.push(otherItem)
      })
    },
    setAddress() {
      this.$emit('input', this.address)
    }
  }
}
</script>

<style lang="scss" scoped>
.address-select-wrap {
  .flex-wrap {
    display: flex;
    align-items: center;
  }
  .address-item-select {
    width: 120px;
    margin-right:16px;
  }
}
</style>
