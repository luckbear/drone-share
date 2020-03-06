<template>
  <div class="container">
    <div class="form-container">
      <el-form>
        <el-form-item label="用户名">
          <el-input placeholder="用户名" v-model="registerInfo.username"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerInfo: {
        userName: "",
        password: "",
        rePassword: ""
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 50px);
  background-color: #f1f2f5;
  padding: 10px;
  .form-container {
    height: 100%;
    background-color: #fff;
    box-shadow: 0px 0px 38px 2px rgba(25, 25, 27, 0.29);
    border-radius: 5px;
    padding: 10px;
    .el-input {
      width: 300px;
    }
  }
}
</style>>
