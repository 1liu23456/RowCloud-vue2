<template>
  <div>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
      日历
    </el-button>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <el-calendar v-model="value"> </el-calendar>
    </el-drawer>

    <el-carousel :interval="4000" type="card">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3 class="medium">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      drawer: false,
      direction: "rtl"
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style>
.el-carousel__container {
  height: 500px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-calendar {
  width: 500px;
  height: 600px;
}
</style>
