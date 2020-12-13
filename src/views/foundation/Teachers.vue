<template>
  <div class="app-container">
    <div class="search">
      <el-input v-model="keyWord"></el-input>
      <el-button @click="getData">搜索</el-button>
    </div>
    <div class="content">
      <div class="wrap" v-for="item in teacherData" :key="item.code">
        <div class="img-wrap">
          <img :src="`${url + item.imgPath}.jpeg`" alt="" />
        </div>
        <div class="instruction">
          <p><span>姓名:</span>{{ item.name }}</p>
          <p><span>教龄:</span>{{ item.teachingAge }}</p>
          <p><span>授课类型:</span>{{ item.classType }}</p>
          <p><span>简介:</span>{{ item.instruction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTeacherList } from "@/api/user";

export default {
  data() {
    return {
      url: process.env.BASE_URL + "static/" + "teacher/",
      teacherData: [],
      keyWord: "",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const teacherRes = await getTeacherList(this.keyWord);
        if (teacherRes.code == 0) {
          this.teacherData = teacherRes.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .search {
    padding: 20px;
    .el-input {
      width: 200px;
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .wrap {
      display: flex;
      width: 400px;
      height: 200px;
      .img-wrap {
        height: 100%;
        width: 50%;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .instruction {
        width: 50%;
        padding: 10px;
        background-color: rgba(189, 182, 182, 0.151);
        color: rgb(68, 64, 64);
        span {
          // color:#3dc1c7 ;
        }
        p {
          margin: 10px 0px;
        }
      }
    }
  }
}
</style>
