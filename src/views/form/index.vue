<template>
  <div class="app-container">
    <el-row class="shadow-container">
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <el-form size="small" label-width="100px">
            <el-form-item label="我要发布：">
              <el-select v-model="infoType">
                <el-option label="供应信息" value="provideInfo"></el-option>
                <el-option label="需求信息" value="demandInfo"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="发布类型">
              <el-radio-group v-model="submitType">
                <el-radio label="companyData">航测数据</el-radio>
                <el-radio label="airspace">空域</el-radio>
                <el-radio label="project">项目</el-radio>
                <el-radio label="drone" v-if="infoType=='demandInfo'">无人机</el-radio>
                <el-radio label="driver" v-if="infoType=='demandInfo'">飞手</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="标题">
              <el-input v-model="name"></el-input>
            </el-form-item>

            <el-form-item label="项目类型" v-if="submitType=='project'">
              <el-select v-model="projectType">
                <el-option v-for="item in companyOptions[1].value" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>

            <!-- 无人机/飞手 -->
            <el-form-item
              v-for="option in companySource"
              :key="option.name"
              :label="option.label"
              v-if="(submitType=='drone'&&option.name =='droneTypes')||(submitType=='driver'&&option.name =='driverGrades')"
            >
              <div style="display:flex;">
                <template v-for="item in option.value">
                  <div style="margin-right:20px">
                    <div class="input-tips">{{Object.keys(item)[0]}}</div>
                    <el-input-number v-model="supplies[option.name][Object.keys(item)[0]]" :min="0"></el-input-number>
                  </div>
                </template>
              </div>
            </el-form-item>

            <el-form-item label="选择地区" v-if="(submitType!='drone')&&(submitType!='driver')">
              <div class="mb-5">
                <div class="input-tips">选择省</div>
                <el-select v-model="province" filterable @change="handleProvinceChange">
                  <el-option v-for="item in provinceList" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </div>
              <div class="mb-5">
                <div class="input-tips">选择市</div>
                <el-select
                  v-model="city"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="handleCityChange"
                >
                  <el-option v-for="item in cityList" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </div>
              <div class="mb-5">
                <div class="input-tips">选择县</div>
                <el-select v-model="district" placeholder="请选择" filterable clearable>
                  <el-option v-for="item in districtList" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </div>
            </el-form-item>

            <template v-if="submitType=='companyData'">
              <el-form-item label="数据类型">
                <el-select placeholder="选择数据类型" v-model="companyData.type">
                  <el-option label="正射影像" value="dom"></el-option>
                  <el-option label="倾斜摄影" value="obliquePhotograph"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="航测面积">
                <el-input class="mini-input" placeholder="输入面积" v-model="companyData.area"></el-input>
                <span class="input-tips">平方千米</span>
              </el-form-item>

              <el-form-item label="拍摄日期">
                <el-date-picker type="date" placeholder="选择日期" class="mini-input" v-model="date"></el-date-picker>
              </el-form-item>

              <el-form-item label="分辨率">
                <el-input class="mini-input" placeholder="输入分辨率" v-model="companyData.resolution "></el-input>
              </el-form-item>

              <el-form-item label="精度">
                <el-input class="mini-input" placeholder="输入精度" v-model="companyData.precision"></el-input>
              </el-form-item>
            </template>

            <el-form-item label="备注">
              <el-input type="textarea" :rows="4" v-model="notes"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="grid-content bg-purple-light">
          <div class="title" style="padding:20px;">
            <span>推荐列表:</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { companyOptions, companySource } from "../../utils/options";
export default {
  data() {
    return {
      companyOptions,
      companySource,
      infoType: "provideInfo",
      submitType: "companyData",
      projectType: "应急",
      companyData: {
        type: "dom",
        area: "",
        resolution: "",
        precision: ""
      },
      date: "",
      notes: "",
      name: "",
      province: "贵州省",
      city: "贵阳市",
      district: "",
      street: "",
      provinceList: [],
      cityList: [],
      districtList: [],
      supplies: {
        driverGrades: { 视距内等级: 0, 超视距等级: 0, 教员等级: 0 },
        droneTypes: { 多旋翼: 0, 固定翼: 0, 垂直起降: 0 }
      }
    };
  },
  created() {
    this.getRegion("中国", "provinceList");
    this.getRegion("贵州省", "cityList");
    this.getRegion("贵阳市", "districtList");
  },
  methods: {
    getRegion(keyWords, target) {
      axios
        .get(
          `http://api.tianditu.gov.cn/administrative?postStr={"searchWord":"${keyWords}","searchType":"1","needSubInfo":"true","needAll":"false","needPolygon":"false","needPre":"false"}&tk=1902c209c7a7480dfb962751b839b91e`
        )
        .then(res => {
          this[target] = res.data.data[0].child;
        });
    },
    handleProvinceChange(e) {
      this.getRegion(e, "cityList");
      this.city = "";
      this.district = "";
      this.street = "";
    },
    handleCityChange(e) {
      this.getRegion(e, "districtList");
      this.district = "";
      this.street = "";
    }
  }
};
</script>

<style scoped lang="scss">
.app-container {
  .el-input,
  .el-textarea {
    width: 400px;
  }
  .mini-input {
    width: 200px;
  }

  .mb-5 {
    margin-bottom: 5px;
  }
}
</style>

