<template>
  <div style="height: 1000px">
    <el-button @click="open">弹窗自定义滚动条问题</el-button>
    <!-- <iframe
        id="fKJ"
        ref="iframe"
        src="http://localhost:8085/"
        frameborder="0"
        @load="initIframeListener"
        width="100%"
        height="500px"></iframe> -->
    <el-dialog
      title="查看"
      :visible.sync="showPdf"
      class="preview-dialog">
      <iframe
        id="fKJ"
        ref="iframe"
        src="http://localhost:8085/"
        frameborder="0"
        @load="initIframeListener"
        width="100%"
        height="500px"></iframe>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      form: {
        name: '',
        region: '',
        date1: null,
        date2: null
      },
      options: [],
      pdfSrc: 'https://wujie-micro.github.io/doc/guide/start.html',
      showPdf: false
    }
  },
  methods: {
    onSubmit() {},
    open() {
      this.showPdf = true
    },
    onScroll() {
      const iframe = document.querySelector("#fKJ");
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      console.log('===', iframeDoc)
      console.log('scrollHeight==', iframeDoc.body.scrollHeight)
      console.log('scrollTop==', iframeDoc.body.scrollTop || iframeDoc.documentElement.scrollTop)
      console.log('offsetHeight==', iframe.height)
    },
    initIframeListener() {
      const iframe = this.$refs.iframe;
      console.log('==initializeIframeListener=', this, iframe)
      // 同源策略问题，可能会报错。操作iframe.contentWindow下属性或方法会报错
      // const scrollTop = iframe.contentWindow.scrollY; 

      iframe.contentWindow.addEventListener('scroll', () => {
        const scrollTop = iframe.contentWindow.scrollY;
        console.log('scroll==scrollTop:', scrollTop);
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        console.log('scrollHeight==', iframeDoc.body.scrollHeight)
        console.log('scrollTop==', iframeDoc.body.scrollTop || iframeDoc.documentElement.scrollTop)
        console.log('offsetHeight==', iframe.height, iframe.offsetHeight)
      });
    }
  }
}
</script>