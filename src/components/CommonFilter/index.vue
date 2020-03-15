<template>
  <div class="info-list">
    <div class="title">
      <i class="el-icon-tickets"></i> 供需信息列表
    </div>

    <el-form size="mini" label-position="right">
      <!-- 供需选择 -->
      <el-form-item class="mb10">
        <el-radio-group v-model="infoType">
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
        <el-select v-model="form[option.prop]" clearable>
          <el-option v-for="item in option.content.options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <!-- 行政区划选择 -->
      <district-select v-model="administrativDivision" labelWidth="85px"></district-select>

      <!-- 提交筛选 -->
      <div class="filter-btn">
        <el-button
          type="primary"
          size="small"
          :icon="isLoading?'el-icon-loading':''"
          @click="queryInfo"
        >查询</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { droneFields, filterOptions, driverFields } from "../../utils/options";
import DistrictSelect from "@/components/districtSelect/DistrictSelect";
import { getInfoList } from "@/api/user";

export default {
  props: {
    filterType: String
  },
  components: { DistrictSelect },
  data() {
    return {
      infoType: "supplyInfo",
      isLoading: false,
      form: {
        aerialDataType: "正射影像",
        businessFields: "应急",
        droneType: "多旋翼",
        droneUsage: "地理测绘",
        driverLicenceSource: "AOPO",
        driverType: "多旋翼",
        grade: "一",
        driverGrade: "视距内等级"
      },
      administrativDivision: ""
    };
  },
  computed: {
    filterOption() {
      if (
        this.filterType == "aerialDataType" ||
        this.filterType == "businessFields"
      ) {
        return filterOptions.filter(el => el.prop == this.filterType);
      }

      if (this.filterType == "droneData") {
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

      if (this.filterType == "driverData") {
        return driverFields.filter(el => el.type != "index");
      }
    }
  },
  methods: {
    queryInfo() {
      getInfoList(1, 5, { ...this.form, ...this.administrativDivision }).then(
        res => {
          console.log(res);
        }
      );
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