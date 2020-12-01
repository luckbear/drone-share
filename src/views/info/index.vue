<template>
  <div class="app-container">
    <div class="f-container">
      <div class="cell-container">
        <!-- 企业分布 -->
        <div class="cell-pane">
          <div class="cell">
            <iframe :src="iframeUrl" style="height: 100%; width: 100%"></iframe>
          </div>
        </div>
        <!-- 贵州行业比例 -->
        <div class="cell-pane">
          <div class="cell">
            <div class="title">贵州行业比例</div>
            <v-pie
              :data="industryPercent"
              style="height: 100%"
              :settings="{ offsetY: 130 }"
            ></v-pie>
          </div>
        </div>
      </div>
      <div class="cell-container">
        <!-- 行业信息 -->
        <div class="cell-pane">
          <div class="cell">
            <div class="title">行业信息</div>
            <info-item infoType="industry" />
          </div>
        </div>
        <!-- 新闻 -->
        <div class="cell-pane">
          <div class="cell">
            <div class="title">新闻</div>
            <info-item infoType="news" />
          </div>
        </div>
      </div>
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell">
            <div class="title">法律法规</div>
            <info-item infoType="law" />
          </div>
        </div>
        <div class="cell-pane">
          <div class="cell">
            <div class="title">专家库</div>
            <info-item infoType="expert"></info-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const iframeUrl = process.env.BASE_URL + "fly/index2.html";
import InfoItem from "./InfoItem";
import VPie from "v-charts/lib/pie.common";
import request from "../../utils/request.js";

export default {
  components: {
    VPie,
    InfoItem,
  },
  data() {
    return {
      iframeUrl,
      industryPercent: {
        columns: ["comType", "count"],
        rows: [],
      },
    };
  },

  async created() {
    try {
      const res = await request.get("/industryPercentList");
      if (res.code === 0) {
        this.industryPercent.rows = res.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>


<style lang="scss" scoped>
.app-container {
  padding: 0;
  background-color: #f1f2f5;
}
.f-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .cell-container {
    flex: 1;
    display: flex;
    overflow-y: scroll;
    &:nth-child(1) {
      .cell-pane {
        padding-bottom: 0;
      }
    }
    &:nth-child(2) {
      .cell-pane {
        padding-bottom: 0;
      }
    }
    .cell-pane {
      height: 100%;
      width: 50%;
      padding: 10px;
      background-color: #fff;
      &:nth-child(1) {
        padding-right: 5px;
      }
      &:nth-child(2) {
        padding-left: 5px;
      }

      .cell {
        box-shadow: 0px 0px 38px 2px rgba(155, 155, 167, 0.49);
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        background-color: #fff;
        .title {
          height: 30px;
          line-height: 30px;
          text-align: center;
          padding-top: 3px;
          background-color: #fff;
          color: #909399;
          //   border-bottom: 1px solid rgba(204, 204, 204, 0.363);
        }
      }
    }
  }
}
</style>