<template>
  <div>
    <el-form size="mini" inline>
      <el-form-item v-for="option in options" :key="option.name" :label="option.label">
        <el-select v-model="formData[option.name]" placeholder="请选择">
          <el-option v-for="item in option.value" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-button size="mini" type="primary">筛选</el-button>
    </el-form>
  </div>
</template>

<script>
import { options } from "@/utils/options";
export default {
  data() {
    return {
      options,
      formData: {
        companyTypes: "",
        businessFields: "",
        droneTypes: "",
        droneUsages: "",
        driverGrades: ""
      }
    };
  }
};
</script>

<style>
</style>