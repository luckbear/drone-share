<template>
  <div class="app-container publish-container">
    <el-row class="shadow-container">
      <div class="page-nav">
        <span>
          <i class="el-icon-document-add">发布信息</i>
        </span>
      </div>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-form size="mini" label-width="120px" :model="form" :rules="rules" ref="form">
            <el-form-item label="我要发布：">
              <el-select v-model="form.type" @change="initForm">
                <el-option
                  label="供应信息"
                  value="supplyInfo"
                  :disabled="$store.getters.userInfo.companyName ==''"
                ></el-option>
                <el-option label="需求信息" value="demandInfo"></el-option>
              </el-select>
              <span
                class="input-tips"
                style="color:red;"
                v-if="$store.getters.userInfo.companyName ==''"
              >去个人中心绑定公司后才可以发布供应信息</span>
            </el-form-item>

            <el-form-item label="发布类型">
              <el-radio-group v-model="submitType" @change="initForm">
                <el-radio label="aerialData">航测数据</el-radio>
                <el-radio label="airspace">空域</el-radio>
                <el-radio label="project">项目</el-radio>
                <el-radio label="drones" v-if="form.type=='demandInfo'">无人机</el-radio>
                <el-radio label="drivers" v-if="form.type=='demandInfo'">飞手</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="标题" prop="name">
              <el-input v-model="form.name" placeholder="简单描述您的信息"></el-input>
            </el-form-item>

            <el-form-item label="项目类型" v-if="submitType=='project'" prop="businessFields">
              <el-select v-model="form.businessFields" @change="queryInfo">
                <el-option
                  v-for="item in companyOptions[1].value"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 行政区划选择 -->
            <district-select
              v-model="administrativDivision"
              v-if="(submitType!='drone')&&(submitType!='driver')"
            ></district-select>

            <!-- 无人机飞手 -->
            <template v-if="editorTableColumns&&editorTableColumns.length>0">
              <el-table-editor
                :columns="editorTableColumns"
                :tableAttrs="tableAttrs"
                :rules="droneAndDriverRules[submitType]"
                class="table-editer"
                ref="tableEdit"
                v-model="form[submitType]"
              >
                <!-- <template v-slot:isSale="{ data }" v-if="submitType=='drones'">
                  <el-radio-group v-model="data.isSale">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </template>-->
              </el-table-editor>
            </template>

            <!-- 文件上传 -->
            <el-form-item
              label="上传数据范围"
              v-if="form.type=='supplyInfo'&&submitType=='aerialData'||form.type=='supplyInfo'&&submitType=='airspace'"
            >
              <el-button type="primary" icon="el-icon-upload" @click="uploadVisible=true">点击上传</el-button>
              <el-tag
                closable
                @close="handleUploadTagClose"
                v-if="form.region != ''"
              >{{uploadFileName}}</el-tag>
              <span class="input-tips" v-else>暂无上传数据</span>
            </el-form-item>

            <el-form-item label="项目面积" v-if="submitType=='project'">
              <el-input v-model="form.area" class="mini-input"></el-input>
              <span class="input-tips">平方千米</span>
            </el-form-item>

            <template v-if="submitType=='aerialData'">
              <el-form-item label="数据类型" prop="aerialDataType">
                <el-select placeholder="选择数据类型" v-model="form.aerialDataType" @change="queryInfo">
                  <el-option label="正射影像" value="正射影像"></el-option>
                  <el-option label="倾斜摄影" value="倾斜摄影"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="航测面积">
                <el-input class="mini-input" placeholder="输入面积" v-model="form.area"></el-input>
                <span class="input-tips">平方千米</span>
              </el-form-item>

              <el-form-item label="拍摄日期">
                <el-date-picker
                  type="daterange"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  class="mini-input"
                  v-model="date"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="分辨率">
                <el-input class="mini-input" placeholder="输入分辨率" v-model="form.resolution "></el-input>
              </el-form-item>

              <el-form-item label="精度">
                <el-input class="mini-input" placeholder="输入精度" v-model="form.precision"></el-input>
              </el-form-item>
            </template>

            <el-form-item label="备注">
              <el-input type="textarea" :rows="4" v-model="form.notes"></el-input>
            </el-form-item>

            <div>
              <el-button
                type="primary"
                class="submit-btn"
                size="small"
                :disabled="isLoading"
                :icon="isLoading?'el-icon-loading':''"
                @click="submitInfo('form')"
              >提交信息</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <div class="title" style="padding:5px;">
            <span>推荐列表:</span>
            <div>
              <el-table :data="relustList" size="mini" height="100%">
                <el-table-column prop="name" label="名称" v-if="!isSupplyDroneOrDriver"></el-table-column>

                <el-table-column label="位置">
                  <template
                    slot-scope="scope"
                  >{{scope.row['province']+scope.row['city']||''+scope.row['district']||''}}</template>
                </el-table-column>

                <el-table-column
                  v-for="item in filterFields"
                  :key="item.prop"
                  :label="item.label"
                  :width="item.prop=='area'?'45px':''"
                >
                  <template slot-scope="scope">{{scope.row[item.prop]}}</template>
                </el-table-column>
                <el-table-column label="发布人">
                  <template slot-scope="scope">{{scope.row['companyName']||scope.row['username']}}</template>
                </el-table-column>
                <el-table-column label="联系方式">
                  <template slot-scope="scope">
                    <span v-if="token">{{scope.row['contact']}}</span>
                    <span v-else>登陆后查看</span>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
              <el-pagination
                background
                layout="prev, pager, next, sizes,total"
                :page-size="pageSize"
                :page-sizes="[10,15,20,30]"
                :current-page="page"
                :total="total"
                size="mini"
                @size-change="queryInfo"
                @current-change="queryInfo"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="上传文件并预览"
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
import ElTableEditor from "ele-table-editor";
import { LGeoJson } from "vue2-leaflet";
import MainMap from "../map/MainMap";
import DistrictSelect from "../../components/districtSelect/DistrictSelect";
import { mapGetters } from "vuex";

import { infoRelease, getInfoList, getUserList } from "../../api/user";
import {
  droneFields,
  driverFields,
  companyOptions,
  filterOptions,
  rules
} from "@/utils/options";
import shp from "shpjs";

const inputNumColumn = {
  prop: "number",
  label: "数量",
  content: {
    type: "el-input-number",
    attrs: {
      size: "mini",
      mini: "1"
    }
  }
};

const _droneFields = droneFields.slice(1, droneFields.length);
const _driverFields = driverFields.slice(1, driverFields.length);

const filterDic = {
  drones: _droneFields,
  drivers: _driverFields,
  airspace: [],
  aerialData: [
    filterOptions[0],
    { prop: "area", label: "面积" },
    { prop: "date", label: "拍摄日期" },
    { prop: "resolution", label: "分辨率" },
    { prop: "precision", label: "精度" }
  ]
};

// droneFields.push(inputNumColumn);
// driverFields.push(inputNumColumn);

export default {
  components: {
    MainMap,
    LGeoJson,
    DistrictSelect,
    ElTableEditor
  },
  data() {
    return {
      companyOptions,
      page: 1,
      pageSize: 10,
      total: 0,
      tableAttrs: {
        size: "mini"
      },
      relustList: [],
      date: "",
      isLoading: false,
      form: {
        aerialDataType: "",
        area: "",
        businessFields: "",
        date: "",
        drones: [],
        drivers: [],
        name: "",
        notes: "",
        resolution: "",
        precision: "",
        region: "",
        type: "demandInfo",
        userId: this.$store.getters.userInfo.userId
      },
      submitType: "aerialData",
      administrativDivision: "",
      uploadVisible: false,
      geojson: [],
      uploadFileName: "",
      droneAndDriverRules: rules,
      rules: {
        name: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ],
        businessFields: {
          required: true,
          message: "请选择类型",
          trigger: "change"
        },
        aerialDataType: {
          required: true,
          message: "请选择数据类型",
          trigger: "change"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["token"]),
    editorTableColumns() {
      if (this.form.type == "demandInfo") {
        if (this.submitType == "drones") {
          return droneFields.filter(el => {
            return (
              el.prop != "droneMaker" &&
              el.prop != "buyTime" &&
              el.prop != "isSale" &&
              el.prop != "maxLoad"
            );
          });
        }

        if (this.submitType == "drivers") {
          return driverFields;
        }
      } else {
        return [];
      }
    },
    filterFields() {
      if (this.submitType == "drones" && this.form.type == "demandInfo") {
        return filterDic[this.submitType].filter(el => {
          return (
            el.prop != "buyTime" &&
            el.prop != "droneMaker" &&
            el.prop != "maxLoad"
          );
        });
      }
      return filterDic[this.submitType];
    },
    isSupplyDroneOrDriver() {
      let isSupply = this.form.type == "supplyInfo";
      return (
        (isSupply && this.submitType == "drones") ||
        (isSupply && this.submitType == "drivers")
      );
    }
  },
  created() {
    this.initForm();
  },

  methods: {
    queryInfo() {
      let _form = { ...this.form };
      delete this.administrativDivision.centerLat;
      delete this.administrativDivision.centerLon;
      _form.type = _form.type === "supplyInfo" ? "demandInfo" : "supplyInfo";

      if (this.isSupplyDroneOrDriver) {
        this.getCompanyList();
      } else {
        getInfoList(this.page, this.pageSize, {
          ..._form,
          ...this.administrativDivision,
          releaseType: this.submitType
        }).then(res => {
          this.formatData(res.datas);
        });
      }
    },
    getCompanyList() {
      getUserList(this.page, this.pageSize, {
        ...this.form,
        ...this.administrativDivision
      }).then(res => {
        // console.log(res);
        // this.formatData(res.datas);
        let result = res.datas;
        // console.log(result);

        result.datas.forEach(el => {
          for (let key in el[this.submitType][0]) {
            el[key] = el[this.submitType][0][key];
          }
        });
        this.relustList = result.datas;
        this.total = result.total;
      });
    },
    formatData(result) {
      if (this.submitType == "drones" || this.submitType == "drivers") {
        result.datas.forEach(el => {
          for (let key in el[this.submitType][0]) {
            el[key] = el[this.submitType][0][key];
          }
        });
      }

      result.datas.forEach(el => {
        for (let key in el["userInfo"]) {
          el[key] = el["userInfo"][key];
        }
      });
      this.relustList = result.datas;
      this.total = result.total;
    },
    submitInfo(formName) {
      let isNotDrone = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.submitType == "drones" || this.submitType == "drivers") {
            isNotDrone = false;
            if (this.form[this.submitType].length == 0) {
              this.$message.warning("请至少添加一条记录！");
              return;
            }
            this.$refs["tableEdit"]
              .validate()
              .then(() => {
                this.releaseInfo();
                return;
              })
              .catch(err => {
                console.log(err);
              });
          }
          isNotDrone && this.releaseInfo();
        }
      });
    },
    initForm() {
      this.relustList = [];
      // this.queryInfo();
      for (let key in this.form) {
        if (key === "drones" || key === "drivers") {
          this.form[key] = [];
        } else if (key != "type" && key != "userId") {
          this.form[key] = "";
        }
      }
      this.queryInfo();
    },
    releaseInfo() {
      this.isLoading = true;
      if (this.form.region) {
        this.form.region = JSON.stringify(this.form.region);
      }
      if (this.date) {
        this.form.date = this.date[0] + "-" + this.date[1];
      }
      infoRelease({
        ...this.form,
        ...this.administrativDivision,
        releaseType: this.submitType
      })
        .then(res => {
          this.isLoading = false;
          if (res.code == 1) {
            // this.initForm();
          }
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
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
      this.map = null;
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
        this.$message.warning("没有正确解析shp文件");
      } else {
        this.form.region = this.geojson;
        this.$message.success("成功解析shp文件");
      }
      this.uploadVisible = false;
    },
    handleUploadCancle() {
      this.$message("上传取消");
      this.uploadVisible = false;
    },
    handleUploadTagClose() {
      this.form.region = "";
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
.publish-container {
  .table-editer {
    margin-left: 60px;
    margin-bottom: 20px;
  }
}

.ele-table-editor-btn {
  margin-bottom: 5px;
  .el-button {
    padding: 7px 15px;
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

  .submit-btn {
    margin-left: 200px;
    margin-top: 20px;
    width: 100px;
  }
}
</style>

