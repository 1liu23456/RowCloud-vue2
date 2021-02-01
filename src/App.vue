<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
// 解决表格表头错位不对齐问题
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
