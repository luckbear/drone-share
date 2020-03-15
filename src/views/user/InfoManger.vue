<template>
  <div class="info-manger-container app-container">
    <el-tabs v-model="activeName" class="shadow-container">
      <el-tab-pane label="无人机" name="drone">
        <manger-item type="drones"></manger-item>
      </el-tab-pane>
      <el-tab-pane label="飞手" name="driver">
        <manger-item type="drivers"></manger-item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MangerItem from "./MangerItem";
export default {
  components: {
    MangerItem
  },
  data() {
    return {
      activeName: "drone"
    };
  }
};
</script>

<style lang="scss" scoped>
.info-manger-container {
  .shadow-container {
    padding: 20px;
  }
}
</style>