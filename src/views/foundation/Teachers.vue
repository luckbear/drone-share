<template>
  <div class="app-container">
    <div
      class="wrap"
      v-for="item in teacherData"
      :key="item.code"
      style="width: 800px; height: 600px"
    >
      <div class="img-wrap">
        <img :src="`${url + item.imgPath}.jpeg`" alt="" />
      </div>
      <div class="instruction">
          <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getTeacherList } from "@/api/user";
export default {
  data() {
    return {
      url: process.env.BASE_URL + "static/" + "images/",
      teacherData: [],
    };
  },
  async created() {
    const teacherRes = await getTeacherList();
    if (teacherRes.code == 0) {
      this.teacherData = teacherRes.data;
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .wrap {
    display: flex;
    margin: auto;
    .img-wrap {
      height: 100%;
      width: 100%;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .instruction{
        // width: ;
    }
  }
}
</style>
