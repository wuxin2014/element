<template>
  <div>
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
</style>
