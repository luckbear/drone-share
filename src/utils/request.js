import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["X-Token"] = getToken();
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;

    if (res.code == -1) {
      Message({
        message: res.msg,
        type: "error"
      });
    }

    if (res.code == 1) {
      Message({
        message: res.msg == "正确响应" ? "提交成功" : res.msg,
        type: "success"
      });
    }

    return res;
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
