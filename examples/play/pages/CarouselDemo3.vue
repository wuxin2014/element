<template>
  <div>
    <el-carousel :interval="3000" type="card" height="320px" :autoplay="false" style="width: 70vw; background: aliceblue">
      <SwiperItem v-for="(item, i) in dataList" :key="i">
        <div class="imgBox">
           <img class="imgItem" :src="item.photo" alt="" srcset="" />
           <div class="imgTit">{{ item.title }}</div>
        </div>
      </SwiperItem>
    </el-carousel>
  </div>
</template>
<script>
import SwiperItem from './components/CustomCarouselItem3.vue';
export default {
  name: 'CarouselDemo2',
  components: {
    SwiperItem,
  },
  data () {
    return {
      dataList: [
        { photo: require('../../assets/images/compo-1.png'), title: '测试1' }, 
        { photo: require('../../assets/images/compo-2.png'), title: '测试2' }, 
        { photo: require('../../assets/images/compo-3.png'), title: '测试3' }, 
        { photo: require('../../assets/images/feedback.png'), title: '测试4' }, 
        { photo: require('../../assets/images/hamburger.png'), title: '测试5' }, 
        { photo: require('../../assets/images/guide.png'), title: '测试6' }, 
        { photo: require('../../assets/images/efficiency.png'), title: '测试7' }
      ]
    }
  },
  mounted(){
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-carousel__item--card {
  width: 20%;
}
.imgBox {
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
