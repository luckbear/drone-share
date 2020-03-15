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

  // next();
  // determine whether the user has logged in
  const hasToken = getToken();
  const hasUserInfo = store.getters.userInfo;

  if (hasToken && !hasUserInfo) {
    store.commit("user/SET_USERINFO", JSON.parse(localStorage.getItem(hasToken)));
  }

  if (to.meta.isLogin) {
    if (hasToken) {
      next();
    } else {
      Message.error("请先进行登陆！");
      next(from.path);
      NProgress.done();
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
