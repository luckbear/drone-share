<template>
  <div class="container">
    <el-form label-width="120px" size="small" :model="form" :rules="rules" status-icon ref="form">
      <el-form-item label="注册类型">
        <el-radio v-model="registerType" label="company">公司身份注册</el-radio>
        <el-radio v-model="registerType" label="person">个人身份注册</el-radio>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        <span class="input-tips">3到10个字符</span>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        <span class="input-tips">6到15个数字或者字母</span>
      </el-form-item>

      <el-form-item label="重复密码" prop="rePassword">
        <el-input v-model="form.rePassword" placeholder="请重复密码" show-password></el-input>
      </el-form-item>

      <el-form-item label="联系方式">
        <el-input v-model="form.contact" placeholder="邮箱或者手机号"></el-input>
      </el-form-item>

      <template v-if="registerType =='company'">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
        </el-form-item>

        <el-form-item label="公司地址">
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
        </el-form-item>

        <el-form-item v-for="option in companyOptions" :key="option.name" :label="option.label">
          <el-checkbox-group v-model="form[option.name]">
            <el-checkbox v-for="item in option.value" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item v-for="option in companySource" :key="option.name" :label="option.label">
          <div style="display:flex">
            <template v-for="item in option.value">
              <div style="margin-right:20px">
                <div class="input-tips">{{Object.keys(item)[0]}}</div>
                <el-input-number v-model="form[option.name][Object.keys(item)[0]]" :min="0"></el-input-number>
              </div>
            </template>
          </div>
        </el-form-item>
      </template>
      <div>
        <el-button class="submit-btn" type="primary" @click="submitInfo('form')">提交注册</el-button>
      </div>
    </el-form>
    <div class="tips">
      <span v-if="registerType =='company'">*登陆后在个人中心更改公司信息*</span>
      <span v-else>*登陆后可以在个人中心添加公司信息*</span>
    </div>
  </div>
</template>

<script>
import { companyOptions, companySource } from "../../utils/options";
import axios from "axios";
const geodeKey = "a4d407ac14f869095063169e1fccfb93";
export default {
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
      if (value == "") {
        callback(new Error("请输入重复密码"));
      }
      if (value != this.form.password) {
        callback(new Error("两次输入密码不一致"));
      }
    };
    const validateCompany = (rule, value, callback) => {};

    return {
      companyOptions,
      companySource,
      addressInput: "",
      registerType: "company",
      form: {
        userName: "",
        password: "",
        rePassword: "",
        contact: "",
        companyName: "",
        companyAddress: "",
        companyLocation: "",
        companyTypes: [],
        businessFields: [],
        droneTypes: { 多旋翼: 0, 固定翼: 0, 垂直起降: 0 },
        droneUsages: [],
        driverGrades: { 视距内等级: 0, 超视距等级: 0, 教员等级: 0 }
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
            // validator: validatePassword
          },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        rePassword: [
          {
            required: true,
            message: "请重复输入密码",
            trigger: "blur",
            validator: validateRePassword
          }
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
  created() {},
  methods: {
    submitInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
                  location: el.location
                });
              });
              cb(canidateList);
            }
          });
      }
    },
    addressAdviceSelect(e) {
      this.form.companyAddress = e.value;
      this.form.companyLocation = e.location;
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
            this.form.companyAddress = res.data.regeocode.formatted_address;
            this.addressInput = "";
            this.form.companyLocation =
              coords.longitude + "," + coords.latitude;
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
      this.form.companyLocation = "";
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
.container {
  padding-bottom: 1px;
  .el-input,
  .el-autocomplete {
    width: 300px;
  }
  .submit-btn {
    margin-left: 50%;
    transform: translateX(-50%);
    width: 250px;
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
}
</style>