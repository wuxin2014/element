<template>
    <div style="width: 980px; background: aliceblue; padding: 40px 0;">
      <el-carousel :interval="5000" type="card" height="150px" :autoplay="false">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
</template>

<script>
export default {
  data() {
    // 一开始el-carousel-item 都是绝对定位元素width: 50%，left: 0,top: 0,z-index: 0
    return {}
  }
}
</script>

<style>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>