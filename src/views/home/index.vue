<template>
  <div id="app">
      <el-button
    plain
    @click="open">
    可自动关闭
  </el-button>
    <baidu-map
    class="map"
      :center="{ lng: 112.380425, lat: 34.665508 }"
      :zoom="20"
      scroll-wheel-zoom
      @mousemove="syncPolyline"
      @click="paintPolyline"
      @rightclick="newPolyline"
    >
    
    </baidu-map>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
data() {
    return {
      polyline: {
        editing: false,
        paths: [],
      }
    }
  },
  methods: {
    open() {
        const h = this.$createElement;

        this.$notify({
          title: '标题名称',
          message: h('i', { style: 'color: teal'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
        });
      },
    toggle(name) {
      this[name].editing = !this[name].editing;
    },
    syncPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        return;
      }
      const path = paths[paths.length - 1];
      if (!path.length) {
        return;
      }
      if (path.length === 1) {
        path.push(e.point);
      }
      this.$set(path, path.length - 1, e.point);
    },
    newPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        paths.push([]);
      }
      const path = paths[paths.length - 1];
      path.pop();
      if (path.length) {
        paths.push([]);
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      !paths.length && paths.push([]);
      paths[paths.length - 1].push(e.point);
    },
  },
};
</script>
<style>

.map {
  height: 800px;
  margin: 5px 5px;   
  /*  上 左 下 右 */
}



</style>
