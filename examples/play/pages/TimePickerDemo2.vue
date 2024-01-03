<template>
    <div>
        <el-time-picker
            v-model="value"
            :picker-options="{
                selectableRange: '18:30:00 - 20:30:00'
            }"
            placeholder="任意时间点">
        </el-time-picker>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: '',
            }
        }
    }
</script>

<style>
</style>