import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  next();
  // determine whether the user has logged in
  const hasToken = getToken();

  // if (to.meta.isLogin) {
  //   if (hasToken) {
  //     const hasGetUserInfo = store.getters.name;
  //     if (hasGetUserInfo) {
  //       next();
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch("user/getInfo");

  //         next();
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch("user/resetToken");
  //         Message.error("Has Error");
  //         next("/dashboard");
  //         NProgress.done();
  //       }
  //     }
  //   } else {
  //     Message.error("请先进行登陆！");
  //     next(from.path);
  //     NProgress.done();
  //   }
  // } else {
  //   next();
  // }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
