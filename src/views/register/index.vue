<template>
  <div class="register-container">
    <el-form
      label-width="120px"
      size="small"
      :model="form"
      :rules="rules"
      status-icon
      ref="form"
      class="register-form"
    >
      <el-form-item label="注册类型">
        <el-radio v-model="form.userType" label="company">公司身份注册</el-radio>
        <el-radio v-model="form.userType" label="personal">个人身份注册</el-radio>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        <span class="input-tips">3到10个字符</span>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        <span class="input-tips">6到15个数字或者字母</span>
      </el-form-item>

      <el-form-item label="重复密码" prop="rePassword">
        <el-input v-model="form.rePassword" placeholder="请重复密码" show-password></el-input>
      </el-form-item>

      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="form.contact" placeholder="邮箱或者手机号"></el-input>
      </el-form-item>

      <template v-if="form.userType =='company'">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
        </el-form-item>

        <location v-model="administrativDivision"></location>

        <!-- <el-form-item label="详细地址">
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
        </el-form-item>-->

        <el-form-item v-for="option in companyOptions" :key="option.name" :label="option.label">
          <el-checkbox-group v-model="form[option.name]">
            <el-checkbox v-for="item in option.value" :key="item" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </template>
    </el-form>
    <div>
      <el-button class="submit-btn" type="primary" @click="submitInfo('form')">提交注册</el-button>
    </div>
    <div class="tips">
      <span v-if="form.userType =='company'">*登陆后在个人中心更改公司信息*</span>
      <span v-else>*登陆后可以在个人中心添加公司信息*</span>
    </div>
  </div>
</template>

<script>
import { companyOptions, companySource } from "../../utils/options";
import Location from "@/components/Location/Location";
import { register } from "../../api/user";
import axios from "axios";
export default {
  components: {
    Location
  },
  data() {
    const validateusername = (rule, value, callback) => {
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
      administrativDivision: {},
      form: {
        userType: "company",
        username: "",
        password: "",
        rePassword: "",
        contact: "",
        companyName: "",
        companyTypes: [],
        businessFields: []
      },
      rules: {
        username: [
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
        contact: [
          {
            required: true,
            message: "请输入手机号或者邮箱",
            trigger: "blur"
          }
        ],
        rePassword: [
          {
            required: true,
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
          register({ ...this.form, ...this.administrativDivision }).then(
            res => {
              console.log(res);
              if (res.code == -1) {
                return;
              }

              if (res.code == 1) {
                this.$emit("closeCurrentDialog", this.form.username);
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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