<template>
    <el-select
        ref="select"
        v-model="selectVal"
        multiple
        filterable 
        collapse-tags 
        clearable
        @visible-change="visibleSelect"
        @remove-tag="handleRemoveTag"
        @clear="handleClear"
    >
        <el-option label="全部" value="all" @click.native="handleItemClick({ value: 'all' })"></el-option>
        <el-option
            v-for="item in optionList"
            :key="item[field.value]"
            :label="item[field.label]"
            :value="item[field.value]" 
            @click.native="handleItemClick(item)">
        </el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: []
        },
        optionList: {
            type: Array,
            default: []
        },
        field: {
            type: Object,
            default: () => ({ label: 'label', value: 'value' })
        },
        filterable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            selectVal: []
        }
    },
    watch: {
        value: {
            handler(newVal) {
                this.selectVal = newVal.map(item => item);
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // el-select下拉组件增加filterable会出现点击收回图标下拉选项收不回的bug
        // filterable属性下，点击一次select选择框之后会导致select组件获得焦点,并且如果后续在页面中没有其他操作,select组件不会失去焦点,点击其他地方下拉框展开了
        visibleSelect (flag) {
            if (!this.filterable) return;
            if (flag) {
                this.$refs.select.focus();
            } else {
                this.$refs.select.blur();
            }
        },
        handleItemClick(data) {
            const isExistAll = this.selectVal.includes('all');
            if (data.value && data.value === 'all') {
                if (!isExistAll && this.selectVal.length !== 0) {
                    this.selectVal = [];
                } else {
                    this.selectVal = this.optionList.map(item => item[this.field.value]);
                    this.selectVal.unshift('all');
                }
                this.$emit('input', this.selectVal);
                return;
            }

            if (isExistAll) {
                this.selectVal = this.selectVal.filter(code => code !== 'all');
            } else if (this.selectVal.length === this.optionList.length) {
                this.selectVal.unshift('all');
            }
            this.$emit('input', this.selectVal);
        },
        handleRemoveTag(val) {
            if (val === 'all') {
                this.selectVal = [];
            }
            this.$emit('input', this.selectVal);
        },
        handleClear() {
            this.$emit('input', this.selectVal);
        }
    }
}
</script>