<template>
  <div class="register-container app-container">
    <el-form
      label-width="120px"
      size="small"
      :model="form"
      :rules="rules"
      status-icon
      ref="form"
      class="register-form shadow-container"
    >
      <div class="page-nav">
        <span>
          <i class="el-icon-info"></i>用户信息
        </span>
        <el-button
          size="mini"
          class="edit-btn"
          icon="el-icon-edit"
          type="primary"
          @click="bindCompany(true)"
        ></el-button>
      </div>

      <el-form-item label="用户名" prop="username">
        <template v-if="isEditObj['username']">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          <span class="input-tips">3到10个字符</span>
          <!-- <el-button size="mini" type="primary">确定</el-button> -->
          <!-- <el-button size="mini" type="primary" @click="isEditObj['username']=false">取消</el-button> -->
        </template>
        <template v-else>
          <span>{{form.username}}</span>
          <!-- <el-button
            size="mini"
            class="edit-btn"
            icon="el-icon-edit"
            type="primary"
            @click="isEditObj['username']=true"
          ></el-button>-->
        </template>
      </el-form-item>

      <el-form-item label="联系方式" style="margin-bottom:5px" prop="contact">
        <template v-if="isEditObj['contact']">
          <el-input v-model="form.contact" placeholder="邮箱或者手机号"></el-input>
          <!-- <el-button size="mini" type="primary" @click="handleModify('contact')">确定</el-button> -->
          <!-- <el-button size="mini" type="primary" @click="isEditObj['contact']=false">取消</el-button> -->
        </template>

        <template v-else>
          <span>{{form.contact}}</span>
          <!-- <el-button
            size="mini"
            class="edit-btn"
            icon="el-icon-edit"
            type="primary"
            @click="isEditObj['contact']=true"
          ></el-button>-->
        </template>
      </el-form-item>

      <!-- <el-form-item>
        <el-button type="text" @click="bindCompany">点击绑定公司信息</el-button>
      </el-form-item>-->

      <!-- 公司信息 -->
      <template>
        <el-form-item label="公司名称" prop="companyName">
          <template v-if="isEditObj['companyName']">
            <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
            <!-- <el-button size="mini" type="primary" v-if="!isBindCompany">确定</el-button> -->
            <!-- <el-button
              size="mini"
              type="primary"
              v-if="!isBindCompany"
              @click="isEditObj['companyName']=false"
            >取消</el-button>-->
          </template>

          <template v-else>
            <span>{{form.companyName||'无'}}</span>
            <!-- <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              class="edit-btn"
              @click="isEditObj['companyName']=true"
            ></el-button>-->
          </template>
        </el-form-item>

        <el-form-item label="详细地址" prop="companyAddress">
          <template v-if="isEditObj['companyAddress']">
            <el-autocomplete
              v-model="addressInput"
              placeholder="请定位公司地址"
              prefix-icon="el-icon-search"
              :fetch-suggestions="querySearchLocationAsync"
              v-if="form.companyAddress==null||form.companyAddress==''"
              @select="addressAdviceSelect"
              style="margin-bottom:15px;"
            ></el-autocomplete>
            <el-tag
              closable
              v-else
              @close="handleTagClose"
              style="margin-bottom:15px;"
            >{{form.companyAddress}}</el-tag>
            <el-tooltip class="item" effect="dark" content="点击进行定位" placement="top-start">
              <el-button type="primary" icon="el-icon-location-outline" @click="getLocation"></el-button>
            </el-tooltip>
            <span class="input-tips">自动定位不准或无法定位时请手动搜索地址</span>
            <br />
            <!-- <el-button
              size="mini"
              type="primary"
              @click="handleModify('companyAddress')"
              v-if="!isBindCompany"
            >确定</el-button>-->
            <!-- <el-button
              size="mini"
              type="primary"
              v-if="!isBindCompany"
              @click="isEditObj['companyAddress']=false"
            >取消</el-button>-->
          </template>

          <template v-else>
            <span>{{form.companyAddress|| '无'}}</span>
            <!-- <el-button
              size="mini"
              icon="el-icon-edit"
              class="edit-btn"
              type="primary"
              @click="isEditObj['companyAddress']=true"
            ></el-button>-->
          </template>
        </el-form-item>

        <el-form-item
          v-for="option in companyOptions"
          :key="option.name"
          :label="option.label"
          :prop="option.name"
        >
          <el-checkbox-group v-model="form[option.name]" :disabled="!isEditObj[option.name]">
            <el-checkbox v-for="item in option.value" :key="item" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
          <template v-if="isEditObj[option.name]">
            <!-- <el-button size="mini" type="primary" v-if="!isBindCompany">确定</el-button> -->
            <!-- <el-button
              size="mini"
              type="primary"
              v-if="!isBindCompany"
              @click="isEditObj[option.name]=false"
            >取消</el-button>-->
          </template>
          <!-- <el-button
            size="mini"
            icon="el-icon-edit"
            class="edit-btn"
            type="primary"
            v-else
            @click="isEditObj[option.name]=true"
          ></el-button>-->
        </el-form-item>
      </template>
      <div>
        <el-button
          class="submit-btn"
          :disabled="!isEdit"
          :icon="isLoading?'el-icon-loading':''"
          type="primary"
          @click="handleModify('form')"
        >提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { companyOptions } from "../../utils/options";
import { getAdministrativDivision } from "@/utils/index";
import DistrictSelect from "@/components/districtSelect/DistrictSelect";
import _cloneDeep from "lodash/cloneDeep";
import { updateUserInfo } from "@/api/user";

import axios from "axios";
const geodeKey = "a4d407ac14f869095063169e1fccfb93";
export default {
  components: {
    DistrictSelect
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于六位"));
      } else {
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      // if (value == "") {
      //   callback(new Error("请输入重复密码"));
      // }

      if (value != this.form.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    const validateCompany = (rule, value, callback) => {};

    return {
      companyOptions,
      addressInput: "",
      isLoading:false,
      administrativDivision: {},
      isEdit: false,
      isEditObj: {
        companyTypes: false,
        businessFields: false,
        // username: false,
        contact: false,
        companyName: false,
        companyAddress: false
      },
      form: this.$store.getters.userInfo,
      // form: {
      //   username: "",
      //   password: "",
      //   rePassword: "",
      //   contact: "",
      //   companyName: "",
      //   companyAddress: "",
      //   companyLocation: "",
      //   companyTypes: [],
      //   businessFields: []
      // },
      rules: {
        contact: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        companyAddress: [
          { required: true, message: "请输入公司地址", trigger: "blur" }
        ],
        companyTypes: [
          { required: true, message: "至少选择一个", trigger: "change" }
        ],
        businessFields: [
          { required: true, message: "至少选择一个", trigger: "change" }
        ],
        companyName: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur"
            // validator: validateCompany
          },
          { min: 1, max: 25, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    if (this.form.userType != "company") {
      this.form.companyTypes = [];
      this.form.businessFields = [];
    }
  },
  watch: {
    "form.companyAddress"(newVal, oldVal) {
      if (!newVal) {
        this.administrativDivision = {};
        this.form.companyLocation = [];
      }
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
      // this.administrativDivision = e.administrativDivision;
      this.form.companyLat = e.location.split(",")[1];
      this.form.companyLon = e.location.split(",")[0];
      // this.form.companyLocation = [
      //   e.location.split(",")[1],
      //   e.location.split(",")[0]
      // ];
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
      this.form.companyAddress = "";
      this.addressInput = "";
      // this.form.companyLocation = "";
      this.form.companyLat = "";
      this.form.companyLon = "";
    },
    handleModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          delete this.form.password;
          this.isLoading = true;
          updateUserInfo({ ...this.form, ...this.administrativDivision }).then(
            res => {
              if (res.code == -1) {
                this.isLoading = false;
                return;
              }

              if (res.code == 1) {
                this.$store.commit("user/UPDATE_USERINFO", this.form);
                // this.$message.success("修改成功");
                this.bindCompany(false);
                this.isLoading = false;
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    bindCompany(isEdit) {
      this.form.userType = "company";
      for (let key in this.isEditObj) {
        this.isEditObj[key] = isEdit;
      }
      this.isEdit = isEdit;
    }
  }
};
</script>

<style lang="scss">
.el-autocomplete-suggestion {
  width: 400px !important;
  li {
    white-space: normal;
  }
}
</style>

<style lang="scss" scoped>
.register-container {
  .el-input,
  .el-autocomplete {
    width: 300px;
  }
  .submit-btn {
    margin-left: 100px;
    // margin-top: 50px;
    // transform: translateX(-50%);
    width: 150px;
  }

  .location {
    font-size: 20px;
    cursor: pointer;
    &:hover {
      color: #3dc1c7;
    }
  }
  .tips {
    font-size: 12px;
    color: red;
    text-align: center;
    margin: 10px 0px;
  }
  .edit-btn {
    margin-left: 5px;
    padding: 3px 11px;
  }
}
</style>