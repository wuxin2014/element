<template>
    <div style="padding: 20px">
        <el-form :model="searchForm" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="日期">
                        <el-date-picker
                            v-model="searchForm.date"
                            type="date"
                            placeholder="选择日期"
                            style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请时间">
                        <el-date-picker
                            v-model="searchForm.effect_date"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始曰期"
                            end-placeholder="结束日期"
                            format="yyyyMMdd"
                            value-format="yyyyMMdd"
                            :pickerOptions="startPickerOptions"
                            :append-to-body="true"
                            :offset="-100"
                            style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="过期时间">
                        <el-date-picker
                            v-model="searchForm.expire_date"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始曰期"
                            end-placeholder="结束日期"
                            format="yyyyMMdd"
                            value-format="yyyyMMdd"
                            :pickerOptions="endPickerOptions"
                            :append-to-body="true"
                            :offset="0"
                            style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            const that = this
            return {
                searchForm: {
                    date: '',
                    effect_date: [],
                    expire_date: []
                },
                startPickerOptions: {
                    disabledDate(time) {
                        // return that.$moment(time).format('YYYYMMDD') < that.$moment().subtract(1, 'years').format('YYYYMMDD')
                    }
                },
                endPickerOptions: {
                    disabledDate(time) {
                        // return that.$moment(time).format('YYYYMMDD') > that.$moment().add(1, 'years').format('YYYYMMDD')
                    }
                }
            }
        }
    }
</script>

<style>
body {
    position: relative;
    margin: 0;
    padding: 0;
}
</style>