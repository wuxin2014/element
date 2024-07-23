<template>
  <div>
    <div style="width: 1000px; height: 100px; padding: 20px 0;background: aliceblue;margin-bottom: 40px;">
      <div class="wrap">
        <div class="div1">1</div>
        <div class="div2">2</div>
        <div class="div3">3</div>
        <div class="div4">4</div>
        <div class="div5">5</div>
      </div>
    </div>
    <el-carousel :interval="400000" type="card" height="120px" indicator-position="none" ref="myCarousel" style="margin-bottom: 40px;background-color: pink;">
      <myCarsouselItem
        v-for="(item,index) in list" 
        :key="index"
        class="el-carousel__item_light">
        <div style="padding: 20px">
          测试{{ index }}
        </div>
      </myCarsouselItem>
    </el-carousel>
    <div style="background-color: antiquewhite; padding: 40px 0;">
      <el-carousel :interval="400000" type="card" height="120px" indicator-position="none" ref="myCarousel">
        <myCarsouselItem2
          v-for="(item,index) in list"
          :key="index"
          class="el-carousel__item_light">
          <div style="padding: 20px">
            测试{{ index }}
          </div>
        </myCarsouselItem2>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import myCarsouselItem from './components/CustomCarouselItem.vue';
import myCarsouselItem2 from './components/CustomCarouselItem2.vue';
export default {
  name: 'CarouselDemo2',
  components: {
    myCarsouselItem,
    myCarsouselItem2
  },
  data () {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    }
  },
  mounted(){
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
.el-carousel__item_buy {
  background: paleturquoise;
  color: #1D3864;
}

.el-carousel__item_sale {
  background: antiquewhite;
  color: #995200;
}

.el-carousel__item_light {
  background: paleturquoise;
  color: #1D3864;
}
.el-carousel__item {
  border-radius:10px;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.15);
}

.wrap {
  width: 100%;
  height: 120px;
  position: relative;
  .div1 {
    width: 28%; 
    height: 120px;
    background-color: aqua;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    border-radius: 6px;
    scale: 0.8;
  }
  .div2 {
    width: 28%; 
    height: 120px;
    background-color: antiquewhite;
    position: absolute;
    left: 172px; // 本来left为200，但由于第一个卡片缩小了0.8, 1000 / 5 - 1000*28%*0.8/2
    top: 0;
    z-index: 2;
    border-radius: 6px;
    scale: 0.9;
  }
  .div3 {
    width: 22%;
    height: 120px;
    background-color: chocolate;
    position: absolute;
    left: 390px; // (1000 - 1000 * 22%) / 2
    top: 0;
    z-index: 3;
    border-radius: 6px;
  }
  .div4 {
    width: 28%;
    height: 120px;
    background-color: darkgreen;
    position: absolute;
    left: 548px; // 1000 / 5 * 3 - (1000 * 28% - 1000 * 20%) + 1000*28%*0.8/2
    top: 0;
    z-index: 2;
    border-radius: 6px;
    scale: 0.9;
  }
  .div5 {
    width: 28%;
    height: 120px;
    background-color: gold;
    position: absolute;
    left: 720px; // 1000 / 5 * 4 - (1000 * 28% - 1000 * 20%)
    top: 0;
    z-index: 1;
    border-radius: 6px;
    scale: 0.8;
  }
}
</style>
