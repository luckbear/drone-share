<template>
  <div class="container">
    <el-table :data="infoList" size="mini" @row-click="openDialog" height="100%">
      <el-table-column prop="code" label="编号" width="70px"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="date" label="时间"> </el-table-column>
      <el-table-column prop="author" label="作者"> </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="1000"
      size="mini"
    >
    </el-pagination>
  </div>
</template>

<script>
const baseUrl = process.env.BASE_URL;
import request from "../../utils/request.js";
export default {
  props: ["infoType"],
  data() {
    return {
      infoList: [],
    };
  },
  async created() {
    const res = await request.get(`/${this.infoType}List`);
    this.infoList = res.data;
  },
  methods: {
    openDialog(row, col) {
      //   window.open(baseUrl + "fly/index.html", "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  .el-table{
    // overflow: auto;
  }
}
</style>