<template>
    <div>
        <el-button @click="() => {}">测试Button</el-button>
        <div style="padding: 10px">{{ value }}</div>
        <div>
            <el-select
                v-model="value"
                filterable
                value-key="value"
                placeholder="请选择文章标签"
                ref="select"
            >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: [{
                    value: 'HTML',
                    label: 'HTML'
                }, {
                    value: 'CSS',
                    label: 'CSS'
                }, {
                    value: 'JavaScript',
                    label: 'JavaScript'
                }],
                value: null
            }
        },
        methods: {
            // 点击一次select选择框之后会导致select组件获得焦点,并且如果后续在页面中没有其他操作,select组件不会失去焦点,点击其他地方下拉框展开了
            visibleChange(flag) {
                if (flag) {
                    this.$refs.select.focus()
                } else {
                    this.$refs.select.blur()
                }
            },
        }
    }
</script>

<style>
</style>