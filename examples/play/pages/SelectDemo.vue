<template>
    <div>
        <div style="padding: 10px">{{ form.value }}</div>
        <el-form :model="form">
            <el-form-item label="文章标签">
                <el-select
                    v-model="form.value"
                    filterable
                    value-key="code"
                    placeholder="请选择文章标签"
                    ref="select"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.code"
                        :label="item.label"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div style="padding: 20px">
            <el-select
            v-model="form.value"
            filterable
            value-key="code"
            placeholder="请选择文章标签"
            ref="select"
        >
            <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.label"
                :value="item">
            </el-option>
        </el-select>
        </div>
        <div v-if="form.value && form.value.code" style="padding: 10px; height: 1900px;">
            <el-button @click="() => {}">测试Button</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: [{
                    code: 'HTML',
                    label: 'HTML'
                }, {
                    code: 'CSS',
                    label: 'CSS'
                }, {
                    code: 'JavaScript',
                    label: 'JavaScript'
                }],
                form: {
                    value: null
                }
            }
        },
        methods: {
            // filterable属性下，点击一次select选择框之后会导致select组件获得焦点,并且如果后续在页面中没有其他操作,select组件不会失去焦点,点击其他地方下拉框展开了
            visibleChange(flag) {
                // select组件实例没有focus方法， 有blur方法
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
body {
    position: relative;
    margin: 0;
    padding: 0;
}
</style>