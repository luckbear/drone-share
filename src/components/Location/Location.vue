<template>
  <el-form-item label="详细地址">
    <el-autocomplete
      v-model="addressInput"
      placeholder="请定位公司地址"
      prefix-icon="el-icon-search"
      :fetch-suggestions="querySearchLocationAsync"
      v-if="form.companyAddress==''"
      @select="addressAdviceSelect"
    ></el-autocomplete>
    <el-tag closable v-else @close="handleTagClose">{{form.companyAddress}}</el-tag>
    <el-tooltip class="item" effect="dark" content="点击进行定位" placement="top-start">
      <el-button type="primary" icon="el-icon-location-outline" @click="getLocation"></el-button>
    </el-tooltip>
    <span class="input-tips">自动定位不准时请手动搜索地址</span>
  </el-form-item>
</template>

<script>
import axios from "axios";
import { getAdministrativDivision } from "@/utils/index";

const geodeKey = "a4d407ac14f869095063169e1fccfb93";

export default {
  data() {
    return {
      addressInput: "",
      form: {
        companyAddress: "",
        companyLon: "",
        companyLat: "",
        province: "",
        city: "",
        district: ""
      }
    };
  },
  watch: {
    form: {
      handler(val) {
        console.log(val);
        this.$emit("input", val);
      },
      deep: true
    }
  },
  methods: {
    querySearchLocationAsync(queryString, cb) {
      if (queryString) {
        axios
          .get(
            `https://restapi.amap.com/v3/assistant/inputtips?key=${geodeKey}&keywords=${queryString}`
          )
          .then(res => {
            if (res.data.status == 1) {
              let searchResults = res.data.tips;
              let canidateList = [];
              searchResults.forEach(el => {
                canidateList.push({
                  value: el.district + el.address + el.name,
                  location: el.location,
                  administrativDivision: getAdministrativDivision(el.district)
                });
              });
              cb(canidateList);
            }
          });
      }
    },

    addressAdviceSelect(e) {
      this.form.companyAddress = e.value;
      this.form.companyLat = e.location.split(",")[1];
      this.form.companyLon = e.location.split(",")[0];

      // this.form.companyLocation = [
      //   e.location.split(",")[1],
      //   e.location.split(",")[0]
      // ];
      // this.administrativDivision = e.administrativDivision;
      this.form.province = e.administrativDivision.province;
      this.form.city = e.administrativDivision.city;
      this.form.district = e.administrativDivision.district;
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.showPosition,
          this.locationError
        );
      } else {
      }
    },
    //浏览器定位成功
    showPosition(position) {
      let coords = position.coords;
      axios
        .get(
          `https://restapi.amap.com/v3/geocode/regeo?key=${geodeKey}&location=${coords.longitude},${coords.latitude}`
        )
        .then(res => {
          if (res.data.status == 1) {
            const info = res.data.regeocode;
            this.form.companyAddress = info.formatted_address;
            this.form.province = info.addressComponent.province;
            this.form.city = info.addressComponent.city;
            this.form.district = info.addressComponent.district;
            this.addressInput = "";
            this.form.companyLat = coords.latitude;
            this.form.companyLon = coords.longitude;
            // this.form.companyLocation = [coords.latitude, coords.longitude];
          }
        });
    },
    //浏览器定位错误
    locationError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.$message.error(
            "您拒绝获取位置信息，请修改浏览器设置或手动输入地址！"
          );
          break;
        case error.POSITION_UNAVAILABLE:
          this.$message.error("无法获取位置，请手动输入地址！");
          break;
        case error.TIMEOUT:
          this.$message.error("获取位置超时，请手动输入地址！");
          break;
        case error.UNKNOWN_ERROR:
          this.$message.error("定位失败，请手动输入地址！");
          break;
      }
    },
    //标签关闭
    handleTagClose() {
      this.addressInput = "";
      for (let key in this.form) {
        this.form[key] = "";
      }
    }
  }
};
</script>

<style>
</style>