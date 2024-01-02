<template>
    <div>
        <el-date-picker
            v-model="value1"
            type="date"
            placeholder="选择日期"
            :pickerOptions="pickerOptions">
        </el-date-picker>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value1: '',
                pickerOptions: {
                    // firstDayOfWeek: 1
                }
            }
        }
    }
</script>

<style>
</style>