<template>
  <div class="app-container">
    <div class="f-container">
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell">
            <!-- <fly-chart /> -->
          </div>
        </div>
        <div class="cell-pane">
          <div class="cell">
            <el-table :data="classData" style="width: 100%">
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
      </div>
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell">
            <el-table :data="emData" style="width: 100%">
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
          </div>
        </div>
        <div class="cell-pane">
          <div class="cell">
            <el-carousel type="card" :style="{height:'100%'}">
              <el-carousel-item v-for="item in 3" :key="item" :style="{height:'100%'}">
                <img :src="url+item+'.jpeg'" alt="">
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FlyChart from "./FlyChart.vue";
export default {
  components: {
    FlyChart,
  },
  data() {
    return {
      url:process.env.BASE_URL+'static/'+'images/',
      classData: [],
      emData: [],
    };
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
  .cell-container {
    height: 50%;
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
        img{
          height: 100%;
        }
      }
    }
  }
}
</style>