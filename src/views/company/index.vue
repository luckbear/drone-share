<template>
  <div class="dashboard-container">
    <main-map class="map-com"></main-map>
    <div class="info-list">
      <div class="title">
        <i class="el-icon-tickets"></i> 供需信息列表
      </div>

      <el-form size="mini">
        <!-- 供需选择 -->
        <el-form-item class="mb10">
          <el-radio-group v-model="infoType">
            <el-radio-button label="supplyInfo">
              <svg-icon icon-class="供应"></svg-icon>供应信息
            </el-radio-button>
            <el-radio-button label="demandInfo">
              <svg-icon icon-class="需求"></svg-icon>需求信息
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 公司筛选 -->
        <template v-if="infoType=='supplyInfo'">
          <el-form-item class="company-filter">
            <el-tabs type="border-card">
              <el-tab-pane v-for="property in companyOptions" :key="property.name">
                <span slot="label">
                  <el-badge
                    :value="companyFilterForm[property.name].length"
                    class="item"
                    type="primary"
                  >{{property.label}}</el-badge>
                </span>
                <el-checkbox-group v-model="companyFilterForm[property.name]">
                  <el-checkbox v-for="item in property.value" :key="item" :label="item"></el-checkbox>
                </el-checkbox-group>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </template>

        <el-form-item label="选择类型" label-width="80px" v-else>
          <el-select v-model="demandType">
            <el-option
              v-for="item in companyOptions[1].value"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 行政区划选择 -->
        <district-select v-model="administrativDivision" labelWidth="80px"></district-select>

        <!-- 提交筛选 -->
        <div class="filter-btn">
          <el-button
            type="primary"
            size="small"
            :icon="isLoading?'el-icon-loading':''"
            @click="getCompany"
          >查询</el-button>
        </div>
      </el-form>

      <!-- 结果列表 -->
      <div class="result-list">
        <!-- <el-alert type="success">
          <span slot="title">共有数据x条</span>
        </el-alert>-->
        <!-- 公司列表 -->
        <div>
          <el-card class="company-list" v-if="infoType=='supplyInfo'">
            <div slot="header" class="clearfix">
              <span>中国航天科技有限公司</span>
            </div>
            <div>
              地址:
              <el-button type="text">北京市西城区新街口街道赵登禹路76号</el-button>
            </div>
            <div>
              联系方式:
              <el-button type="text">17112345677</el-button>
            </div>

            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <span class="main-color">公司属性</span>
                </template>
                <div style="display:flex; margin-top:7px">
                  <div>公司类型：</div>
                  <div>
                    <el-badge :value="12" class="item">
                      <el-tag size="mini">科研</el-tag>
                    </el-badge>
                  </div>
                </div>
                <div style="display:flex; margin-top:7px">
                  <div>公司类型：</div>
                  <div>
                    <el-badge :value="12" class="item">
                      <el-tag size="mini">科研</el-tag>
                    </el-badge>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MainMap from "../map/MainMap";
import { companyOptions } from "../../utils/options";
import DistrictSelect from "@/components/districtSelect/DistrictSelect";
import CommonFilter from "@/components/CommonFilter";
import { getUserList } from "@/api/user";

export default {
  name: "Dashboard",
  components: {
    MainMap,
    DistrictSelect,
    CommonFilter
  },
  data() {
    return {
      companyOptions,
      isLoading: false,
      infoType: "supplyInfo",
      companyFilterForm: {
        companyTypes: [
          "科研",
          "制造",
          "系统开发",
          "销售",
          "培训",
          "行业应用",
          "科普教育"
        ],
        businessFields: [
          "应急",
          "救援",
          "水利",
          "电力",
          "植保",
          "环保",
          "安防",
          "勘察",
          "测绘",
          "航拍"
        ]
      },
      demandType: "应急",
      administrativDivision: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    getCompany() {
      this.isLoading = true;
      getUserList(1, 5, { ...this.companyFilterForm }).then(res => {
        this.isLoading = false;
        console.log(res);
      });
    }
  }
};
</script>




<style lang="scss">
.dashboard {
  &-container {
    height: calc(100vh - 50px);
    display: flex;
    .svg-icon {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }

    .info-list {
      width: 450px;
      display: flex;
      flex-direction: column;

      .el-radio-button__inner {
        width: 225px;
      }

      .title {
        padding: 10px;
        text-align: center;
        color: #3dc1c7;
        font-size: 18px;
      }

      .mb10 {
        margin-bottom: 10px;
      }
      .ml10 {
        margin-left: 10px;
      }

      .info-item {
        // margin-left: 10px;
        // margin: 0;
      }

      .company-filter {
        margin-bottom: 0px;
        .el-tabs {
          box-shadow: none;
        }
        .el-tabs--border-card {
          border-bottom: none;
        }
        .el-badge__content.is-fixed {
          top: 8px;
        }
        .el-tabs__content {
          padding: 5px 5px 5px 20px;
        }
        .el-checkbox {
          margin-right: 27px;
        }
      }

      .result-list {
        flex: 1;
        overflow: auto;
        padding: 10px;
        .company-list {
          .el-card__header {
            padding: 8px 20px;
            color: #fff;
            background-color: #3dc1c7;
          }
          .el-card__body {
            padding: 0px 20px;
            .el-button--text {
              padding: 6px 0;
            }
          }
        }
      }

      .filter-btn {
        text-align: center;
        .el-button {
          width: 100px;
        }
      }
    }
    .map-com {
      flex: 1;
    }
  }
}
</style>
