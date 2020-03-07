<template>
  <div class="app-container publish-container">
    <el-row class="shadow-container">
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <el-form size="small" label-width="100px">
            <el-form-item label="我要发布：">
              <el-select v-model="infoType">
                <el-option label="供应信息" value="supplyInfo"></el-option>
                <el-option label="需求信息" value="demandInfo"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="发布类型">
              <el-radio-group v-model="submitType">
                <el-radio label="aerialData">航测数据</el-radio>
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
              <el-select v-model="businessFields">
                <el-option
                  v-for="item in companyOptions[1].value"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 无人机/飞手 -->
            <el-form-item
              v-for="option in companySource"
              :key="option.name"
              :label="option.label"
              v-if="(submitType=='drone'&&option.name =='droneTypes')||(submitType=='driver'&&option.name =='driverLicenceSource')"
            >
              <div style="display:flex;">
                <template v-for="item in option.value">
                  <div style="margin-right:20px;">
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
                  <el-option
                    v-for="item in provinceList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
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
                  <el-option
                    v-for="item in cityList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </div>
              <div class="mb-5">
                <div class="input-tips">选择县</div>
                <el-select v-model="district" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in districtList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>

            <!-- 文件上传 -->
            <el-form-item
              label="上传数据范围"
              v-if="infoType=='supplyInfo'&&submitType=='aerialData'||infoType=='supplyInfo'&&submitType=='airspace'"
            >
              <el-button type="primary" icon="el-icon-upload" @click="uploadVisible=true">点击上传</el-button>
              <el-tag
                closable
                @close="handleUploadTagClose"
                v-if="aerialData.region != ''"
              >{{uploadFileName}}</el-tag>
              <span class="input-tips" v-else>暂无上传数据</span>
            </el-form-item>

            <el-form-item label="项目面积" v-if="submitType=='project'">
              <el-input v-model="area" class="mini-input"></el-input>
              <span class="input-tips">平方千米</span>
            </el-form-item>

            <template v-if="submitType=='aerialData'">
              <el-form-item label="数据类型">
                <el-select placeholder="选择数据类型" v-model="aerialData.type">
                  <el-option label="正射影像" value="dom"></el-option>
                  <el-option label="倾斜摄影" value="obliquePhotograph"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="航测面积">
                <el-input class="mini-input" placeholder="输入面积" v-model="aerialData.area"></el-input>
                <span class="input-tips">平方千米</span>
              </el-form-item>

              <el-form-item label="拍摄日期">
                <el-date-picker type="date" placeholder="选择日期" class="mini-input" v-model="date"></el-date-picker>
              </el-form-item>

              <el-form-item label="分辨率">
                <el-input class="mini-input" placeholder="输入分辨率" v-model="aerialData.resolution "></el-input>
              </el-form-item>

              <el-form-item label="精度">
                <el-input class="mini-input" placeholder="输入精度" v-model="aerialData.precision"></el-input>
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

    <el-dialog
      title="上传文件"
      :visible.sync="uploadVisible"
      top="0"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      class="upload-file"
      @close="uploadClose"
    >
      <div class="upload-container">
        <el-upload
          action="console"
          :auto-upload="false"
          :on-change="file2url"
          accept=".zip"
          :limit="1"
          class="upload-component"
        >
          <el-button size="small" type="primary" icon="el-icon-folder-opened">点击选择文件</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >将shapefile中的所有文件压缩为ZIP，文件中不要包含目录。每个ZIP文件只能包含一个shapefile 文件集</div>
        </el-upload>
        <el-divider></el-divider>
        <div class="map-container">
          <main-map @mapReady="mapReady">
            <l-geo-json
              :geojson="geojson"
              @ready="geojsonReady"
              v-if="Object.keys(geojson).length!=0"
            ></l-geo-json>
          </main-map>
        </div>
        <div slot="footer" class="footer">
          <el-button @click="handleUploadCancle" size="small">取 消</el-button>
          <el-button type="primary" @click="submitUpload" size="small">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { companyOptions, companySource } from "../../utils/options";
import { LGeoJson } from "vue2-leaflet";
import MainMap from "../map/MainMap";
import shp from "shpjs";
export default {
  components: {
    MainMap,
    LGeoJson
  },
  data() {
    return {
      companyOptions,
      companySource,
      infoType: "supplyInfo",
      submitType: "aerialData",
      businessFields: "应急",
      aerialData: {
        type: "dom",
        area: "",
        resolution: "",
        precision: "",
        region: ""
      },
      date: "",
      notes: "",
      name: "",
      area: "",
      province: "贵州省",
      city: "贵阳市",
      district: "",
      street: "",
      provinceList: [],
      cityList: [],
      districtList: [],
      supplies: {
        driverLicenceSource: { AOPA: 0, UTC: 0, ASFC: 0 },
        droneTypes: { 多旋翼: 0, 固定翼: 0, 垂直起降: 0 }
      },
      uploadVisible: false,
      geojson: [],
      uploadFileName: ""
    };
  },
  created() {
    this.getRegion("中国", "provinceList");
    this.getRegion("贵州省", "cityList");
    this.getRegion("贵阳市", "districtList");
  },
  methods: {
    getRegion(keyWords, target) {
      if (keyWords == "") return;
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
    },
    file2url(file, fileList) {
      this.uploadFileName = file.name;
      let reader = new FileReader();
      reader.readAsArrayBuffer(file.raw);

      reader.onload = () => {
        shp(reader.result)
          .then(res => {
            if (Array.isArray(res)) {
              this.$message({
                showClose: true,
                type: "error",
                message: "zip中只能包含一个ship文件，请重新选择！"
              });
              return;
            }
            this.geojson = res;
          })
          .catch(err => {
            console.log(err);
            this.$message.error("解析shp失败，请检查数据");
          });
      };
    },
    uploadClose() {
      this.map = "";
      this.geojson = {};
    },
    mapReady(e) {
      this.map = e;
    },
    geojsonReady(e) {
      this.map.fitBounds(e.getBounds());
    },
    submitUpload() {
      if (Object.keys(this.geojson).length == 0) {
        this.$message.warning("没有正确上传数据范围");
      } else {
        this.aerialData.region = this.geojson;
        this.$message.success("成功上传数据范围");
      }
      this.uploadVisible = false;
    },
    handleUploadCancle() {
      this.$message("上传取消");
      this.uploadVisible = false
    },
    handleUploadTagClose() {
      this.aerialData.region = "";
      this.uploadFileName = "";
    }
  }
};
</script>

<style lang="scss" >
.upload-file {
  .el-dialog {
    height: 100vh;
    margin-bottom: 0;
    .el-dialog__body {
      height: calc(100% - 54px);
    }
  }
}
.upload-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .upload-component {
    padding: 0 50px;
  }
  .map-container {
    flex: 1;
  }
  .footer {
    padding: 10px 0;
    text-align: center;
    .el-button {
      width: 100px;
    }
  }
}
</style>

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

  .upload {
    border: 1px solid rgb(236, 230, 230);
    padding: 20px;
  }
}
</style>

