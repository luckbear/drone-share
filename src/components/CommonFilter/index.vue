<template>
  <div class="dashboard-container">
    <main-map class="map-com" @mapReady="mapReady">
      <template>
        <!-- <l-geo-json
          v-for="item in airspaceGeoList"
          :key="item.username"
          :geojson="JSON.parse(item.region)"
        ></l-geo-json>-->
      </template>
    </main-map>
    <div class="info-list">
      <div class="title">
        <i class="el-icon-tickets"></i> 供需信息列表
      </div>

      <el-form size="mini" label-position="right">
        <!-- 供需选择 -->
        <el-form-item class="mb10">
          <el-radio-group v-model="infoType" @change="queryInfo">
            <el-radio-button label="supplyInfo">
              <svg-icon icon-class="供应"></svg-icon>供应信息
            </el-radio-button>
            <el-radio-button label="demandInfo">
              <svg-icon icon-class="需求"></svg-icon>需求信息
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-for="option in filterOption"
          :key="option.prop"
          :label="option.label"
          label-width="85px"
        >
          <el-select v-model="form[filterType][option.prop]" clearable>
            <el-option
              v-for="item in option.content.options"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 行政区划选择 -->
        <district-select v-model="administrativDivision" labelWidth="85px"></district-select>

        <!-- 提交筛选 -->
        <div class="filter-btn">
          <el-button
            type="primary"
            size="small"
            :disabled="isLoading"
            :icon="isLoading?'el-icon-loading':''"
            @click="queryInfo"
          >查询</el-button>
        </div>
      </el-form>

      <div class="result-list">
        <el-table
          :data="relustList"
          size="mini"
          v-loading="isLoading"
          height="100%"
          @row-click="rowClick"
        >
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
      </div>

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
</template>

<script>
import { droneFields, filterOptions, driverFields } from "../../utils/options";
import DistrictSelect from "@/components/districtSelect/DistrictSelect";
import { getInfoList, getUserList } from "@/api/user";
import MainMap from "../../views/map/MainMap";
import { LGeoJson } from "vue2-leaflet";
import { mapGetters } from "vuex";

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

export default {
  props: {
    filterType: String
  },
  components: { DistrictSelect, MainMap, LGeoJson },
  data() {
    return {
      infoType: "supplyInfo",
      isLoading: false,
      form: {
        aerialData: { aerialDataType: "正射影像" },
        businessFields: "应急",
        drones: { droneType: "多旋翼", droneUsage: "地理测绘" },
        drivers: {
          driverLicenceSource: "AOPA",
          driverType: "多旋翼",
          grade: "一",
          driverGrade: "视距内等级"
        }
      },
      administrativDivision: "",
      page: 1,
      pageSize: 10,
      total: 0,
      // filterDic,
      relustList: []
    };
  },
  created() {
    this.queryInfo();
  },
  computed: {
    ...mapGetters(["token"]),
    isSupplyDroneOrDriver() {
      let isSupply = this.infoType == "supplyInfo";
      return (
        (isSupply && this.filterType == "drones") ||
        (isSupply && this.filterType == "drivers")
      );
    },
    filterOption() {
      if (this.filterType == "aerialData") {
        return filterOptions.filter(el => el.prop == "aerialDataType");
      }

      if (this.filterType == "businessFields") {
        return filterOptions.filter(el => el.prop == this.filterType);
      }

      if (this.filterType == "drones") {
        return droneFields.filter(el => {
          return (
            el.prop != "droneMaker" &&
            el.prop != "buyTime" &&
            el.prop != "isSale" &&
            el.prop != "maxLoad" &&
            el.type != "index"
          );
        });
      }

      if (this.filterType == "drivers") {
        return driverFields.filter(el => el.type != "index");
      }
    },
    filterFields() {
      if (this.filterType == "drones" && this.infoType == "demandInfo") {
        return filterDic[this.filterType].filter(el => {
          return (
            el.prop != "buyTime" &&
            el.prop != "droneMaker" &&
            el.prop != "maxLoad"
          );
        });
      }

      return filterDic[this.filterType];
    },
    airspaceGeoList() {
      if (this.filterType == "airspace" && this.infoType == "supplyInfo") {
        return this.relustList.filter(el => {
          return Boolean(el.region);
        });
      }
    }
  },
  methods: {
    queryInfo() {
      this.isLoading = true;
      delete this.administrativDivision.centerLat;
      delete this.administrativDivision.centerLon;

      if (this.isSupplyDroneOrDriver) {
        this.getCompanyList();
      } else {
        getInfoList(this.page, this.pageSize, {
          ...this.form[this.filterType],
          ...this.administrativDivision,
          type: this.infoType,
          releaseType: this.filterType
        }).then(res => {
          this.formatData(res.datas);
        });
      }
    },
    getCompanyList() {
      getUserList(this.page, this.pageSize, {
        ...this.form[this.filterType],
        ...this.administrativDivision
      }).then(res => {
        // console.log(res);
        // this.formatData(res.datas);
        let result = res.datas;
        // console.log(result);

        result.datas.forEach(el => {
          for (let key in el[this.filterType][0]) {
            el[key] = el[this.filterType][0][key];
          }
        });
        this.isLoading = false;
        this.relustList = result.datas;
        this.addGeo();
        this.total = result.total;
      });
    },
    formatData(result) {
      this.isLoading = false;
      if (this.filterType == "drones" || this.filterType == "drivers") {
        result.datas.forEach(el => {
          for (let key in el[this.filterType][0]) {
            el[key] = el[this.filterType][0][key];
          }
        });
      }

      result.datas.forEach(el => {
        for (let key in el["userInfo"]) {
          el[key] = el["userInfo"][key];
        }
      });
      this.relustList = result.datas;
      this.addGeo();
      this.total = result.total;
    },
    rowClick(e) {
      if (e.region) {
        this.$map.fitBounds(e.$bounds);
      } else if (e.companyLat && e.companyLon) {
        this.$map.setView([e.companyLat, e.companyLon], 15);
      }
    },
    addGeo() {
      if (this.$featureGroup) {
        this.$featureGroup.clearLayers();
      } else {
        this.$featureGroup = L.featureGroup();
        this.$featureGroup.addTo(this.$map);
      }
      this.relustList.forEach(el => {
        if (el.region) {
          const geojsonObj = L.geoJSON(JSON.parse(el.region)).bindTooltip(
            el.name
          );
          // console.log(layer.getLayerId());
          el.$bounds = geojsonObj.getBounds();
          this.$featureGroup.addLayer(geojsonObj);
        } else if (el.companyLat && el.companyLon) {
          const marker = L.marker([el.companyLat, el.companyLon]).bindTooltip(
            el.companyName
          );
          this.$featureGroup.addLayer(marker);
        }
      });
    },
    mapReady(e) {
      this.$map = e;
    }
  }
};
</script>

<style lang="scss" scoped>
.common-filter-container {
  // .filter-btn {
  //   text-align: center;
  //   .el-button {
  //     width: 100px;
  //   }
  // }
}
</style>