<template>
    <div style="margin: 20px;">
        <div>
            <el-button @click="isShow=true">showDialog</el-button>
            <TableForm></TableForm>
        </div>
        <ContractOnlineFillIn :visible="isShow"></ContractOnlineFillIn>
    </div>
</template>
  
<script>
import TableForm from './TableForm.vue'
import ContractOnlineFillIn from './ContractOnlineFillIn.vue'
export default {
    components: {
        TableForm,
        ContractOnlineFillIn
    },
    data() {
        return {
            isShow: false,
            tableList: []
        };
    },
    methods: {
        handleAdd() {
            ++uuid;
            this.tableList.push({
                contract: 'ap1234' + uuid,
                quantity: ''
            })
        },
    }
};
</script>
  
<style>
body {
    padding: 0;
    margin: 0;
    position: relative;
}

#app {
    padding: 10px;
}
</style>
  