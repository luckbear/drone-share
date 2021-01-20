<template>
  <div class="container">
    <!-- <div class="search" v-if="tableType != 'fundation'"> -->
    <div class="search">
      <el-input
        v-model="keyWord"
        size="mini"
        placeholder="输入关键字搜索"
      ></el-input>
      <el-button type="primary" size="mini" @click="getInfoList">
        搜索
      </el-button>
    </div>

    <el-dialog :visible.sync="isOpenNews" width="70%" top="0">
      <iframe
        :src="`${baseUrl}static/${infoType}/${pdfFileName}`"
        style="width: 100%; height: 100%"
      ></iframe>
      <!-- <div
        style="margin: auto; height: 100%; width: 100%"
        id="canvas-container"
      >
        <canvas id="pdf-canvas"></canvas>
      </div> -->
    </el-dialog>

    <el-dialog :visible.sync="isOpenExpert" class="expert">
      <div class="wrap">
        <div class="content">
          <img :src="`${baseUrl}static/expert/${expertInfo.imgPath}`" alt="" />
          <p>姓名：{{ expertInfo.name }}</p>
          <p>单位：{{ expertInfo.company }}</p>
          <p>职称：{{ expertInfo.grade }}</p>
          <p>介绍：{{ expertInfo.introduction }}</p>
        </div>
      </div>
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
      <!-- <el-table-column prop="attachment" label="附件"> </el-table-column> -->
    </el-table>

    <template v-if="tableType == 'expert'">
      <el-table
        :data="infoList"
        size="mini"
        height="100%"
        @row-click="openExpert"
      >
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
import {service_data as request} from "../../utils/request.js";
const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");
// PDFJS.GlobalWorkerOptions.workerSrc = "https://cdn.bootcss.com/pdf.js/2.2.228/pdf.worker.js";
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
      isOpenExpert: false,
      pdfFileName: "",
      expertInfo: "",
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
      try {
        const res = await request({ url, method, params });
        this.infoList = res.data;
        this.total = res.count;
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getInfoList();
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getInfoList();
    },

    openExpert(row) {
      this.expertInfo = row;
      this.isOpenExpert = true;
    },

    openDialog(row, col) {
      this.pdfFileName = row.content;
      if (!this.pdfFileName) {
        this.$message({
          message: "没有对应文章详情！",
          duration: 1 * 1000,
        });
        return;
      }
      this.isOpenNews = true;

      // const url = `${baseUrl}static/${this.infoType}/${this.pdfFileName}.pdf`;

      // PDFJS.getDocument(url)
      //   .then((pdf) => {
      //     return pdf.getPage(1);
      //   })
      //   .then((page) => {
      //     // 设置展示比例
      //     const scale = 2;
      //     // 获取pdf尺寸
      //     const viewport = page.getViewport(scale);
      //     // 获取需要渲染的元素
      //     const canvas = document.getElementById("pdf-canvas");
      //     const containerDiv = document.getElementById("canvas-container");
      //     // const height = containerDiv
      //     const context = canvas.getContext("2d");
      //     const devicePixelRatio = window.devicePixelRatio || 1;
      //     const backingStoreRatio =
      //       context.webkitBackingStorePixelRatio ||
      //       context.mozBackingStorePixelRatio ||
      //       context.msBackingStorePixelRatio ||
      //       context.oBackingStorePixelRatio ||
      //       context.backingStorePixelRatio ||
      //       1;
      //     const ratio = devicePixelRatio / backingStoreRatio;
      //     // canvas.height = viewport.height * ratio;
      //     // canvas.width = viewport.width * ratio;
      //     // canvas.style.height = viewport.height + "px";
      //     // canvas.style.width = viewport.width + "px";
      //     canvas.height = viewport.height;
      //     canvas.width = viewport.width;
      //     const renderContext = {
      //       canvasContext: context,
      //       viewport: viewport,
      //     };
      //     page.render(renderContext);
      //   });
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
    height: calc(100vh - 50px);
  }

  .expert {
    .el-dialog__body {
      height: 50vh;
    }
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
  .expert {
    .wrap {
      padding: 0 20px;
      height: 100%;
      overflow: auto;
      img {
        width: 200px;
        height: 100%;
        float: left;
        margin-right: 10px;
      }
      p {
        // line-height: 8px;
        &:last-child {
          line-height: 25px;
        }
      }
    }
  }
}
</style>