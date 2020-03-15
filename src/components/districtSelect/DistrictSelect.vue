
<template>
  <el-form-item label="选择地区" :label-width="labelWidth" class="district-select">
    <el-select v-model="province" filterable @change="handleProvinceChange" value-key="name">
      <el-option v-for="item in provinceList" :key="item.name" :label="item.name" :value="item"></el-option>
    </el-select>

    <el-select
      v-model="city"
      filterable
      clearable
      placeholder="请选择"
      @change="handleCityChange"
      value-key="name"
    >
      <el-option v-for="item in cityList" :key="item.name" :label="item.name" :value="item"></el-option>
    </el-select>

    <el-select
      v-model="district"
      placeholder="请选择"
      filterable
      clearable
      @change="handleDistrictChange"
      value-key="name"
    >
      <el-option v-for="item in districtList" :key="item.name" :label="item.name" :value="item"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import axios from "axios";
export default {
  props: ["labelWidth"],
  data() {
    return {
      province: "",
      city: "",
      district: "",
      provinceList: [],
      cityList: [],
      districtList: []
    };
  },
  computed: {},
  created() {
    this.getRegion("中国", "provinceList", () => {
      this.province = this.provinceList.find(el => el.name == "贵州省");
      this.updateParent();
    });
    this.getRegion("贵州省", "cityList");

    // this.getRegion("贵阳市", "districtList");
  },
  methods: {
    getRegion(keyWords, target, callback) {
      if (keyWords == "") return;
      axios
        .get(
          `http://api.tianditu.gov.cn/administrative?postStr={"searchWord":"${keyWords}","searchType":"1","needSubInfo":"true","needAll":"false","needPolygon":"false","needPre":"false"}&tk=1902c209c7a7480dfb962751b839b91e`
        )
        .then(res => {
          this[target] = res.data.data[0].child;
          callback && callback();
        });
    },
    handleProvinceChange(e) {
      this.getRegion(e.name, "cityList");
      this.city = "";
      this.district = "";
      this.updateParent();
    },
    handleCityChange(e) {
      if (e) {
        this.getRegion(e.name, "districtList");
      }
      this.district = "";
      this.districtListr = [];
      this.updateParent();
    },
    handleDistrictChange(e) {
      this.updateParent();
    },
    updateParent() {
      let centerLatLng = [this.province.lat, this.province.lnt];
      this.city && (centerLatLng = [this.city.lat, this.city.lnt]);
      this.district && (centerLatLng = [this.district.lat, this.district.lnt]);
      this.$emit("input", {
        province: this.province && this.province.name,
        city: this.city && this.city.name,
        district: this.district && this.district.name,
        centerLat: centerLatLng[0],
        centerLon: centerLatLng[1]
      });
    }
  }
};
</script>

<style lang="scss" >
.district-select {
  .el-form-item__content {
    display: flex;
    max-width: 405px;
    .el-select {
      margin-right: 5px;
    }
  }
}
</style>