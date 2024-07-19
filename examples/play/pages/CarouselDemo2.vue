<template>
  <div>
    haha
    <el-carousel v-if="type=='item5_xybjzq' || type=='item5_qdbjzq'" :interval="400000" type="card" height="120px" indicator-position=none ref="myCarousel">
      <div class="el-carousel_div_bg"><div></div></div>
      <myCarsouselItem
        v-for="(item,index) in allYxbjMsgs" 
        :key="index"
        :class="{
          'el-carousel__item_buy':item.type=='buy',
          'el-carousel__item_sale':item.type=='sale',
        }">
        <div  class="div-label">
          <div><span>{{item.name}}</span><span class="font-style-12 span-padding">{{item.title}}</span></div>
          <div class="div-container_center div-padding"><span class="font-style-20">{{item.num}}</span>万</div>
          <div ><i class="el-icon el-icon_position"></i><span class="font-style-12">{{item.position}}</span></div>
          <div class="div-padding2"><i class="el-icon el-icon_phone"></i><span class="font-style-12">{{item.phone}}</span></div>
        </div>
      </myCarsouselItem>
    </el-carousel>
    <el-carousel v-if="type=='item5_dljybj' || type=='item5_zsssbbj'" :interval="400000" type="card" height="120px" indicator-position=none ref="myCarousel">
      <myCarsouselItem2
        v-for="(item,index) in allQdbjMsgs"
        :key="index"
        :class="{
          'el-carousel__item_dljybj':type=='item5_dljybj',
          'el-carousel__item_zsssbbj':type=='item5_zsssbbj',
        }">
        <div  class="div-label div-wbqs">
          <div class="div-padding3"><span class="font-style-20">{{item.title}}</span></div>
          <div class="div-padding2 font-style-12">报价系统评级<span class="font-style-20">{{item.bjxtpj}}</span></div>
          <div class="div-padding2 font-style-12">打包价格<span>{{item.dbjg}}</span></div>
          <div class="div-padding2 font-style-12">产品期限<span>{{item.cpqx}}</span></div>
          <div class="div-padding2 font-style-12">产品额度<span>{{item.cped}}</span></div>
        </div>
      </myCarsouselItem2>
    </el-carousel>

    <el-carousel :interval="3000" type="card" height="320px" :autoplay="false" style="width: 70vw;">
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
      // type: 'item5_xybjzq', // item5_qdbjzq
      type: 'item5_dljybj', // item5_zsssbbj
      allYxbjMsgs: [
        {
          name: "张三",
          type:"buy",
          title:"拟买入私募12号",
          num: "300",
          position: "济南二环东路营业部",
          phone: "15088888888",
        },
        {
          name: "李四",
          type:"sale",
          title:"拟买入私募12号",
          num: "280",
          position: "济南二环东路营业部",
          phone: "15088888888",
        },
        {
          name: "王五",
          type:"buy",
          title:"拟买入私募12号",
          num: "500",
          position: "济南二环东路营业部",
          phone: "15088888888",
        },
        {
          name: "赵六",
          type:"buy",
          title:"拟买入私募12号",
          num: "120",
          position: "济南二环东路营业部",
          phone: "15088888888",
        },
        {
          name: "小七",
          type:"sale",
          title:"拟买入私募12号",
          num: "350",
          position: "济南二环东路营业部",
          phone: "15088888888",
        },
        // {
        // name: "106",
        // bjMsg: "拟卖出100万 私募6号",
        // lxOrg: "xxx营业部",
        // phone: "15088888888",
        // },
        //         {
        // name: "107",
        // bjMsg: "拟卖出100万 私募6号",
        // lxOrg: "xxx营业部",
        // phone: "15088888888",
        // },
        //         {
        // name: "108",
        // bjMsg: "拟卖出100万 私募6号",
        // lxOrg: "xxx营业部",
        // phone: "15088888888",
        // },
        //         {
        // name: "109",
        // bjMsg: "拟卖出100万 私募6号",
        // lxOrg: "xxx营业部",
        // phone: "15088888888",
        // },
        //         {
        // name: "110",
        // bjMsg: "拟卖出100万 私募6号",
        // lxOrg: "xxx营业部",
        // phone: "15088888888",
        // },
      ],
      allQdbjMsgs: [
        {
          title: "九州证券1",
          bjxtpj: "BB",
          dbjg: "3.3%",
          cpqx: "12月期",
          cped: "1亿元",
        },
        {
          title: "华兴证券2",
          bjxtpj: "BB",
          dbjg: "3.0%",
          cpqx: "12月期",
          cped: "2亿元",
        },
        {
          title: "中泰证券3",
          bjxtpj: "AA",
          dbjg: "3.5%",
          cpqx: "12月期",
          cped: "4亿元",
        },
        {
          title: "中信证券4",
          bjxtpj: "BB",
          dbjg: "2.3%",
          cpqx: "12月期",
          cped: "3千万元",
        },
        {
          title: "华泰证券5",
          bjxtpj: "BB",
          dbjg: "3.3%",
          cpqx: "12月期",
          cped: "1亿元",
        },
        {
          title: "中信建投证券6",
          bjxtpj: "BB",
          dbjg: "3.3%",
          cpqx: "12月期",
          cped: "5000万元",
        },
        {
          title: "中原证券7",
          bjxtpj: "BB",
          dbjg: "3.3%",
          cpqx: "12月期",
          cped: "1亿元",
        },
        {
          title: "招商证券8",
          bjxtpj: "BB",
          dbjg: "3.3%",
          cpqx: "12月期",
          cped: "1000万元",
        },
      ],
    }
  },
  mounted(){
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
.el-carousel_div_bg{
    width: 100%;
    height: 90%;
    position: relative; 
    div{
      position: absolute;
      top:20px;
      left:29px;
      width: 93%;
      height: 80%;
      background: lightcyan;
      // background: url("~@/assets/images/information-show/carousel-bg.png") no-repeat;
      background-size: cover;
      background-position: center;
    }
}
.div-wbqs{
  padding-left: 25px !important;
}
.div-label{
    padding: 10px 10px 5px 15px;
    .div-container_center{
      display: flex;
      justify-content: center;
      align-items: center;
      .font-style-20{
        font-weight: bold;
        font-size: 20px;
        line-height: 23px;
      }
    }
    .span-padding{
      padding-left: 10px;
    }
    .div-padding{
      padding:8px  0;
    }
    .div-padding2{
      padding-top:4px;
    }
    .div-padding3{
      padding-bottom:8px;
    }
    .el-icon{
      height: 14px;
      width: 14px;
      margin-right: 5px;
      text-align: left;
      vertical-align: middle;
      display:inline-flex;
    }
    .font-style-12{
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        span{
          padding-left: 10px;
        }
    }
}
.el-carousel__item_buy {
  background: #1D3864;
  background-size: cover;
  color: #995200;
  // .el-icon_position{
  //   background: url("~@/assets/images/information-show/icon_01.png") no-repeat;
  // }
  // .el-icon_phone{
  //   background: url("~@/assets/images/information-show/icon_02.png") no-repeat;
  // }
}

// .el-carousel__item_sale {
//   background: orange;
//   background-size: cover;
//   color: #1D3864;
//   .el-icon_position{
//       background: url("~@/assets/images/information-show/icon_position_02.png") no-repeat;
//   }
//   .el-icon_phone{
//       background: url("~@/assets/images/information-show/icon_phone_01.png") no-repeat;
//   }
// }

.el-carousel__item_dljybj {
  background: bisque;
  background-size: cover;
  color: #995200;
}
.el-carousel__item_zsssbbj {
  background: navajowhite;
  background-size: cover;
  color: #1D3864;
}
.el-carousel__item{
  border-radius:10px;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.15);
}
</style>
