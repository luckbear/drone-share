<template>
  <div class="container">
    <div class="search" v-if="tableType != 'fundation'">
      <el-input
        v-model="keyWord"
        size="mini"
        :placeholder="`输入${tableType == 'info' ? '标题' : '姓名'}关键字`"
      ></el-input>
      <el-button type="primary" size="mini" @click="getInfoList">
        搜索
      </el-button>
    </div>

    <el-dialog :visible.sync="isOpenNews" width="70%" top="0">
      <iframe
        :src="`${baseUrl}static/${infoType}/${pdfFileName}.pdf`"
        style="width: 100%; height: 100%"
      ></iframe>
    </el-dialog>

    <el-table
      :data="infoList"
      size="mini"
      @row-click="openDialog"
      height="100%"
      v-if="tableType == 'info'"
    >
      <el-table-column prop="code" label="编号" width="70px"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="date" label="时间"> </el-table-column>
      <el-table-column prop="author" label="作者"> </el-table-column>
    </el-table>

    <template v-if="tableType == 'expert'">
      <el-table :data="infoList" size="mini" height="100%">
        <el-table-column prop="code" label="编号" width="70px">
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="company" label="单位"> </el-table-column>
        <el-table-column prop="grade" label="职称"> </el-table-column>
      </el-table>
    </template>

    <template v-if="infoType == 'class'">
      <el-table :data="infoList" style="width: 100%" height="100%" size="mini">
        <el-table-column prop="code" label="编号"> </el-table-column>
        <el-table-column prop="beginDate" label="开班日期"> </el-table-column>
        <el-table-column prop="duration" label="授课时长"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="authOrg" label="授权机构"> </el-table-column>
        <el-table-column prop="info" label="信息内容"> </el-table-column>
        <el-table-column prop="releaseDate" label="发布日期"> </el-table-column>
      </el-table>
    </template>

    <template v-if="infoType == 'em'">
      <el-table :data="infoList" style="width: 100%" height="100%" size="mini">
        <el-table-column prop="code" label="编号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="联系方式"> </el-table-column>
        <el-table-column prop="authOrg" label="授权机构"></el-table-column>
        <el-table-column
          prop="categoryGrade"
          label="类别等级"
        ></el-table-column>
        <el-table-column prop="levelGrade" label="级别等级"></el-table-column>
        <el-table-column
          prop="driverGrade"
          label="驾驶员等级"
        ></el-table-column>
      </el-table>
    </template>

    <el-pagination
      background
      layout="prev, pager, next,total,sizes"
      size="mini"
      :total="total"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
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
      baseUrl,
      infoList: [],
      pageSize: 10,
      pageNum: 1,
      keyWord: "",
      total: 0,
      isOpenNews: false,
      pdfFileName: "",
    };
  },
  created() {
    this.getInfoList();
  },
  computed: {
    tableType() {
      if (this.infoType == "expert") {
        return "expert";
      }
      if (this.infoType == "class" || this.infoType == "em") {
        return "fundation";
      }

      return "info";
    },
  },
  methods: {
    async getInfoList() {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        keyWord: this.keyWord,
      };
      const url = `/${this.infoType}List`;
      const method = "get";
      const res = await request({ url, method, params });
      this.infoList = res.data;
      this.total = res.count;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getInfoList();
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getInfoList();
    },

    openDialog(row, col) {
      this.pdfFileName = row.content;
      this.isOpenNews = true;
    },
  },
};
</script>


<style lang="scss">
.container {
  .el-dialog__header {
    height: 50px;
  }
  .el-dialog__body {
    height: calc(100vh);
  }
}
</style>
<style lang="scss" scoped>
.container {
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  position: relative;
  .search {
    // width: 100px;
    // margin-left: 50px;
    position: absolute;
    // bottom: 1px;
    top: -25px;
    right: 20px;
    z-index: 1000;
    .el-input {
      width: 120px;
    }
  }
}
</style>