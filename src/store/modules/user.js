import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: ""
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO: (state, info) => {
    state.userInfo = info;
  },
  UPDATE_USERINFO: (state, info) => {
    state.userInfo = info;
    localStorage.setItem(state.token, JSON.stringify(info));
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          if (response.code == 1) {
            commit("SET_TOKEN", response.access_token);
            commit("SET_USERINFO", response.user_name);
            commit("UPDATE_USERINFO", response.user_name);
            setToken(response.access_token);
            resolve();
          }else{
            reject()
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token)
      //   .then(response => {
      //     const { data } = response;

      //     if (!data) {
      //       reject("Verification failed, please Login again.");
      //     }

      //     const { name, avatar } = data;

      //     commit("SET_USERINFO", name);
      //     commit("SET_AVATAR", avatar);
      //     resolve(data);
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
      commit("SET_USERINFO", "aaaa");
      resolve();
    });
  },

  // user logout
  logout({ commit, state }) {
    localStorage.removeItem(state.token);
    removeToken(); // must remove  token  first
    // resetRouter();
    commit("RESET_STATE");

    // return new Promise((resolve, reject) => {
    //   logout(state.token)
    //     .then(() => {
    //       removeToken(); // must remove  token  first
    //       resetRouter();
    //       commit("RESET_STATE");
    //       resolve();
    //     })
    //     .catch(error => {
    //       reject(error);
    //     });
    // });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      localStorage.setItem(state.token, "");
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
