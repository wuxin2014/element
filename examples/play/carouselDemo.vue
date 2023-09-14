<template>
    <div style="border: 1px solid red">
      <el-carousel :interval="5000" type="card">
        <el-carousel-item v-for="item in 10" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>