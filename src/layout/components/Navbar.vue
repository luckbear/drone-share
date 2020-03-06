<template>
  <div class="navbar">
    <div class="logo">
      <svg-icon icon-class="无人机" class="drone"></svg-icon>
      <span>无人机共享平台</span>
    </div>
    <div class="user-wrap">
      <!-- <span class="welcome">欢迎你xxx</span> -->
      <span>
        <a href="javascript:;" @click="loginVisible = true">登陆</a> /
        <a href="javascript:;" @click="registerVisible = true">注册</a>
      </span>

      <el-dropdown>
        <svg-icon icon-class="user" class="user" style="color:#fff"></svg-icon>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :visible.sync="loginVisible"
      title="请输入账号密码"
      width="30%"
      style="max-width:1900px"
      v-if="loginVisible"
    >
      <login />
    </el-dialog>

    <el-dialog
      title="注册账户"
      :visible.sync="registerVisible"
      v-if="registerVisible"
      top="10vh"
      width="40%"
    >
      <register></register>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Login from "../../views/login";
import Register from "../../views/register";

export default {
  components: {
    Login,
    Register
  },
  data() {
    return {
      loginVisible: false,
      registerVisible: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    openLogin() {
      this.loginVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #52b8bc;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;

  .logo {
    height: 100%;
    color: #fff;
    display: inline-flex;
    align-items: center;
    .drone {
      width: 35px;
      height: 35px;
      margin: 0 20px 0 30px;
    }
    span {
      font-size: 20px;
    }
  }

  .user-wrap {
    height: 100%;
    color: #fff;
    display: inline-flex;
    align-items: center;
    .user {
      margin: 0 20px 0 20px;
      width: 25px;
      height: 25px;
      cursor: pointer;
    }
  }
}
</style>
