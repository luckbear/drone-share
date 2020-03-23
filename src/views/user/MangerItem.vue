<template>
  <div class="manger-item">
    <div :class="{'submit-info':isEdit}">
      <template v-if="isEdit">
        <el-button
          type="primary"
          size="mini"
          @click="commitUpdate"
          :disabled="isLoading"
          :icon="isLoading?'el-icon-loading':''"
        >提交</el-button>
        <el-button type="primary" size="mini" @click="cancelChange">取消</el-button>
      </template>
      <el-button type="primary" icon="el-icon-edit" size="mini" v-else @click="isEdit = true">修改</el-button>
    </div>
    <el-table-editor
      :columns="fileds[type]"
      :tableAttrs="tableAttrs"
      ref="table"
      class="table-editer"
      :rules="rules[type]"
      v-model="userInfo[type]"
      v-if="isEdit"
    >
      <!-- <template v-slot:isSale="{ data }" v-if="type=='droneData'">
        <el-radio-group v-model="data.isSale">
          <el-radio label="是">是</el-radio>
          <el-radio label="否">否</el-radio>
        </el-radio-group>
      </template>-->
    </el-table-editor>

    <el-table size="mini" :data="userInfo[type]" v-else>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        v-for="item in fileds[type].filter(el=>el.type!='index')"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="fotmatColumn"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import ElTableEditor from "ele-table-editor";
import { droneFields, driverFields, rules } from "@/utils/options";
import { saveDrone } from "@/api/user";
import _deepClone from "lodash/cloneDeep";

export default {
  props: {
    type: String
  },
  components: {
    ElTableEditor
  },
  data() {
    return {
      fileds: {
        drones: droneFields,
        drivers: driverFields
      },
      userInfo: {},
      tableAttrs: {
        size: "mini"
      },
      isEdit: false,
      rules,
      isLoading: false
    };
  },
  created() {
    this.initUserinfo();
  },
  methods: {
    commitUpdate() {
      this.$refs["table"]
        .validate()
        .then(() => {
          this.isLoading = true;
          saveDrone(this.userInfo[this.type], this.userInfo.userId, this.type)
            .then(res => {
              if (res.code == 1) {
                this.$store.commit("user/UPDATE_USERINFO", this.userInfo);
                this.$message.success("修改成功");
                this.isEdit = false;
                this.isLoading = false;
              } else {
                this.isLoading = false;
              }
            })
            .catch(err => {
              this.isLoading = false;
            });
        })
        .catch(({ errors, fields }) => {
          console.log(errors, fields);
        });
    },
    cancelChange() {
      this.isEdit = false;
      this.initUserinfo();
    },
    fotmatColumn(row, column) {
      if (column.property == "buyTime") {
        if (row["buyTime"]) {
          return row["buyTime"].slice(0, 10);
        } else {
          return "";
        }
      } else {
        return row[column.property];
      }
    },
    initUserinfo() {
      this.userInfo = _deepClone(this.$store.getters.userInfo);
    }
  }
};
</script>

<style lang="scss">
.manger-item {
  position: relative;
  .submit-info {
    position: absolute;
    left: 100px;
  }
  .ele-table-editor-btn {
    margin-bottom: 5px;
    .el-button {
      padding: 6px 15px;
    }
  }
}
</style>