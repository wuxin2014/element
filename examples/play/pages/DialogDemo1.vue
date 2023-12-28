<template>
  <div>
    <el-button @click="isShow=true">弹窗自定义滚动条问题</el-button>
    <MessageRecipientV2 :visible="isShow" :connectPersonList="connectPersonList" :mailboxList="mailboxList" @close="isShow=false">
    </MessageRecipientV2>
  </div>
</template>

<script>
import MessageRecipientV2 from './MessageRecipientV2.vue';
export default {
  components: {
    MessageRecipientV2
  },
  data() {
    let connectPersonList = Array.from(Array(10)).map((_, index) => {
      return {
        id: index,
        name: 'ka'+index,
        phone_number: '1311111111'+index
      }
    })

    connectPersonList.push({
      id: 'other',
      name: '其他',
      phone_number: '其他'
    })

    console.log(connectPersonList)

    return {
      isShow: false,
      connectPersonList,
      mailboxList: [
        {
          id: 'other',
          email: '其他'
        }
      ]
    }
  },
}
</script>