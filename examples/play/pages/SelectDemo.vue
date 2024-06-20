<template>
    <div style="padding: 10px">
        <el-form :model="form" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="科目">
                        <multiple-select
                            v-model="form.value"
                            :option-list="options"
                            :field="{label: 'label', value: 'code'}">
                        </multiple-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文章">
                        <el-input />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="标签">
                        <el-select
                            v-model="form.tag"
                            value-key="code"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.code"
                                :label="item.label"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import MultipleSelect from './components/CustomMultipleSelect.vue'
export default {
    components: {
        MultipleSelect
    },
    data() {
        return {
            options: [
                { code: 'HTML', label: 'HTML' }, 
                { code: 'CSS', label: 'CSS' }, 
                { code: 'JavaScript', label: 'JavaScript' },
                { code: 'HTML2', label: 'HTML2' }, 
                { code: 'CSS2', label: 'CSS2' }, 
                { code: 'JavaScript2', label: 'JavaScript2' },
                { code: 'HTML3', label: 'HTML3' }, 
                { code: 'CSS3', label: 'CSS3' }, 
                { code: 'JavaScript3', label: 'JavaScript3' }
            ],
            form: {
                value: ['all'],
                tag: ''
            },
            res: {}
        }
    },
    mounted() {
        this.$message.error(this.res.message);
    },
    methods: {}
}
</script>

<style>
body {
    position: relative;
    margin: 0;
    padding: 0;
}
</style>