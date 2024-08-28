<template>
    <div style="position:relative;" @click.stop v-clickoutside="handleOk">
        <div class="wrap" @click="visible = !visible">
            <div class="label-wrap">
                <div v-if="checkAll">{{ selectedList[0] }}</div>
                <el-tag
                    v-else
                    size="mini"
                    type="info"
                    closable
                    style="margin-right:6px"
                    v-for="(item, index) in selectedList"
                    :key="index"
                    @close="handaleRemoveTag(item)">
                    {{ item[fieldLabel] }}
                </el-tag>
            </div>
            <i class="el-icon-arrow-down" style="font-size: 14px; color: #c0c4cc;"></i>
        </div>
        <div
            v-if="visible"
            class="popper">
            <div class="list-wrap">
                <div
                    class="select-option-item"
                    :class="{selected: checkAll}"
                    @click="handleItemClick({ value: 'all' })"
                >全部</div>
                <div
                    v-for="item in optionList"
                    :key="item[fieldValue]"
                    class="select-option-item"
                    :class="{selected:checkedList.includes(item[fieldValue])}"
                    @click="handleItemClick(item)">
                    {{ item[fieldLabel] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';
// import { Tag } from 'element-ui'
export default {
    props: {
        value: {
            type: [Array, String],
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
    components: {
        // 'el-tag': Tag
    },
    data() {
        return {
            visible: false,
            checkedList: [],
        }
    },
    directives: { Clickoutside },
    computed: {
        fieldValue() {
            return this.field.value;
        },
        fieldLabel() {
            return this.field.label;
        },
        checkAll() {
            return this.checkedList.includes('all');
        },
        selectedList() {
            let list = [];
            if (this.checkAll) {
                list = ['全部'];
            } else {
                this.checkedList.forEach(code => {
                    list.push(this.optionList.find(item => item[this.fieldValue] === code));
                });
            }
            return list;
        }
    },
    watch: {
        value: {
            handler(newVal) {
                if (typeof newVal === 'string' && newVal === 'all') {
                    this.checkedList = this.optionList.map(item => item[this.field.value]);
                    this.checkedList.unshift('all');
                } else if (Array.isArray(newVal)) {
                    if (newVal.includes('all') && newVal.length === 1) {
                        this.checkedList = this.optionList.map(item => item[this.field.value]);
                        this.checkedList.unshift('all');
                    } else {
                        this.checkedList = newVal.map(item => item);
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        // document.addEventListener('click', this.clickFn);
    },
    beforeDestroy() {
        // document.removeEventListener('click', this.clickFn);
    },
    methods: {
        // clickFn() {
        //     if (this.visible) {
        //         this.handleOk()
        //     }
        // },
        handleItemClick(data) {
            if (data.value && data.value === 'all') {
                if (this.checkAll) {
                    this.checkedList = [];
                } else {
                    this.checkedList = this.optionList.map(item => item[this.field.value]);
                    this.checkedList.unshift('all');
                }
                this.$emit('input', this.checkedList);
                return;
            }

            if (this.checkAll) {
                this.checkedList = this.checkedList.filter(code => code !== data[this.fieldValue] && code !== 'all');
            } else {
                if (!this.checkedList.includes(data[this.fieldValue])) {
                    this.checkedList.push(data[this.fieldValue]);
                } else {
                    this.checkedList = this.checkedList.filter(code => code !== data[this.fieldValue]);
                }
                
                if (this.checkedList.length === this.optionList.length) {
                    this.checkedList.unshift('all');
                }
            }
            this.$emit('input', this.checkedList);
        },
        handaleRemoveTag(item) {
            this.checkedList = this.checkedList.filter(code => code !== item[this.fieldValue]);
            this.$emit('input', this.checkedList);
        },
        handleOk() {
            this.visible = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    padding: 0 12px;
    box-sizing: border-boX;
    height: 32px;
    color: #606266;
    cursor: pointer;
    width: 100%;
    .label-wrap {
        display: flex;
        flex: 1 1 0%;
        overflow: hidden;
        flex-flow: nowrap;
    }
    ::v-deep .el-tag__close {
        color:#FFF;
        background-color: #909399;
    }
}
.popper {
    position: absolute;
    top: 40px;
    left: 0;
    z-index: 1000;
    border: 1px solid #DCDFE6;
    background: #fff;
    border-radius: 4px;
    padding: 4px 0px;
    width: 100%;
    cursor: pointer;
}
.list-wrap {
    max-height: 200px;
    overflow: auto;
    .select-option-item {
        font-size: 16px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        -webkit-box-sizing: border-box; 
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
            background-color: #F5F7FA;
        }
        &.selected {
            color: #409EFF;
            font-weight: 700;
            &::after {
                position: absolute;
                right: 20px;
                font-family: element-icons;
                content: "\e6da";
                font-size: 12px;
                font-weight: 700;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        }
    }
}
</style>