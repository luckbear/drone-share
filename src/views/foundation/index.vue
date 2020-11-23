<template>
  <div class="app-container">
    <div class="f-container">
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell">
            <fly-chart />
          </div>
        </div>
        <div class="cell-pane">
          <div class="cell">
            <div class="title" style="background-color:#f1f2f5;padding-bottom:15px;">学员就业行业分布</div>
            <v-pie :data="emPercent"></v-pie>
          </div>
        </div>
      </div>
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell">
            <div class="title">开班信息</div>
            <el-table :data="classData" style="width: 100%" height="100%">
              <el-table-column prop="code" label="编号"> </el-table-column>
              <el-table-column prop="beginDate" label="开班日期">
              </el-table-column>
              <el-table-column prop="duration" label="授课时长">
              </el-table-column>
              <el-table-column prop="title" label="标题"> </el-table-column>
              <el-table-column prop="authOrg" label="授权机构">
              </el-table-column>
              <el-table-column prop="info" label="信息内容"> </el-table-column>
              <el-table-column prop="releaseDate" label="发布日期">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="cell-pane">
          <div class="cell">
            <div class="title">学员就业分布情况</div>
            <el-table :data="emData" style="width: 100%" height="100%">
              <el-table-column prop="code" label="编号"></el-table-column>
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="phone" label="联系方式"> </el-table-column>
              <el-table-column
                prop="authOrg"
                label="授权机构"
              ></el-table-column>
              <el-table-column
                prop="categoryGrade"
                label="类别等级"
              ></el-table-column>
              <el-table-column
                prop="levelGrade"
                label="级别等级"
              ></el-table-column>
              <el-table-column
                prop="driverGrade"
                label="驾驶员等级"
              ></el-table-column>
            </el-table>
            <!-- <el-carousel :style="{ height: '100%' }">
              <el-carousel-item
                v-for="item in teacherData"
                :key="item.name"
                :style="{ height: '100%' }"
              >
                <div class="teacher-info">
                  <p>姓名：{{ item.name || "" }}</p>
                  <p>教龄：{{ item.teachingAge || "" }} (年)</p>
                  <p>授课类型：{{ item.classType || "" }}</p>
                </div>
                <img
                  :src="url + (item.imgPath > 3 ? '1' : item.imgPath) + '.jpeg'"
                  alt=""
                />
              </el-carousel-item>
            </el-carousel> -->
          </div>
        </div>
      </div>
      <div class="img-wrapper">
        <div class="cell"></div>
      </div>
    </div>
  </div>
</template>

<script>
import FlyChart from "./FlyChart.vue";
import { getClassList, getEmList, getTeacherList ,getEmPercentList} from "../../api/user.js";
import VPie from 'v-charts/lib/pie.common';
export default {
  components: {
    FlyChart,
    VPie
  },
  data() {
    return {
      url: process.env.BASE_URL + "static/" + "images/",
      classData: [],
      emData: [],
      teacherData: [],
      emPercent:{
        columns:['emIndustry','count'],
        rows:[]
      }
    };
  },
  
  async created() {
    const classRes = await getClassList();;
    if (classRes.code == 0) {
      this.classData = classRes.data;
    }

    const emRes = await getEmList();
    if (emRes.code == 0) {
      this.emData = emRes.data;
    }

    const teacherRes = await getTeacherList();
    if (teacherRes.code == 0) {
      this.teacherData = teacherRes.data;
    }

    const emPercentRes = await getEmPercentList();
    if (emPercentRes.code == 0) {
      this.emPercent.rows = emPercentRes.data;
    }
  },
};
</script>

<style>
.el-carousel__container {
  height: 100%;
}
</style>

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
    height: 40%;
    display: flex;
    &:nth-child(1) {
      .cell-pane {
        padding-bottom: 0;
      }
    }
    .cell-pane {
      height: 100%;
      width: 50%;
      padding: 10px;
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
        .title{
          height: 30px;
          line-height: 30px;
          text-align: center;
          padding-top: 3px;
          background-color: #fff;
          color: #909399;
        }
        .teacher-info {
          position: absolute;
          padding: 0 20px;
          color: #fff;
          background-color: rgba(99, 117, 122, 0.436);
          border-radius: 5px;
          right: 20px;
          bottom: 20px;
        }
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .img-wrapper {
    flex: 1;
    padding: 10px;
    padding-top: 0px;
    .cell {
      box-shadow: 0px 0px 38px 2px rgba(155, 155, 167, 0.49);
      height: 100%;
      border-radius: 8px;
      overflow: hidden;
    }
  }
}
</style>