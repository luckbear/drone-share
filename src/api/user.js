import {service as request,service_data} from "@/utils/request";

export function vv(data) {
  return request({
    url: "",
    method: "post",
    data
  });
}

export function register(data) {
  return request({
    url: "/user/register",
    method: "post",
    data
  });
}

export function login(params) {
  return request({
    url: "/oauth/token",
    method: "get",
    params: {
      ...params,
      grant_type: "password",
      client_id: "demoApp",
      client_secret: "demoAppSecret"
    }
  });
}

export function updateUserInfo(data) {
  return request({
    url: "/user/update",
    method: "post",
    data
  });
}

export function infoRelease(data) {
  return request({
    url: "/informationRelease/release",
    method: "post",
    data
  });
}

export function saveDrone(data, userId, type) {
  let postData;
  if (type == "drones") {
    postData = { drones: data, userId };
  } else {
    postData = { drivers: data, userId };
  }
  return request({
    url: type == "drones" ? "drone/save" : "driver/save",
    method: "post",
    data: postData
  });
}

export function getUserList(pageNum, pageSize, data) {
  return request({
    url: "/user/list/" + pageNum + "/" + pageSize,
    method: "post",
    data
  });
}

export function getInfoList(pageNum, pageSize, data) {
  return request({
    url: "/informationRelease/list/" + pageNum + "/" + pageSize,
    method: "post",
    data
  });
}

export function getClassList(pageNum, pageSize) {
  return service_data({
    url: "/classList/",
  });
}

export function getEmList(pageNum, pageSize) {
  return service_data({
    url: "/emList/",
    method: "get",

  });
}
export function getTeacherList(keyWord, pageSize) {
  return service_data({
    url: "/teacherList",
    method: "get",
    params: {
      pageNum: 1, pageSize, keyWord
    }
  });
}
export function getEmPercentList(pageNum, pageSize) {
  return service_data({
    url: "/emPercentList/",
    method: "get",
  });
}



export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post"
  });
}
