<template>
  <div class="dashboard-container">
    <main-map class="map-com">
      <template v-if="infoType=='supplyInfo'">
        <l-marker
          v-for="item in companyListHasLatlon"
          :key="item.companyName"
          :lat-lng="[item.companyLat,item.companyLon]"
        >
          <l-tooltip>{{item.companyName}}</l-tooltip>
        </l-marker>
      </template>
    </main-map>
    <div class="info-list">
      <div class="title">
        <i class="el-icon-tickets"></i> 供需信息列表
      </div>

      <el-form size="mini">
        <!-- 供需选择 -->
        <el-form-item class="mb10">
          <el-radio-group v-model="infoType" @change="getCompany">
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
                <el-checkbox v-model="checkAll[property.name]">全选</el-checkbox>
                <el-checkbox-group
                  v-model="companyFilterForm[property.name]"
                  @change="handleChange"
                >
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
            :disabled="isLoading"
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
        <div class="company-list-container" v-if="infoType=='supplyInfo'" v-loading="isLoading">
          <el-card
            class="company-list"
            v-for="item in companyList"
            :key="item.companyName"
            shadow="hover"
          >
            <div slot="header" class="clearfix">
              <span>{{item.companyName}}</span>
            </div>
            <div>
              地址:
              <el-button type="text">{{item.companyAddress}}</el-button>
            </div>
            <div>
              联系方式:
              <el-button type="text" v-if="token">{{item.contact}}</el-button>
              <el-button type="text" v-else>请登陆后查看</el-button>
            </div>

            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <span class="main-color">公司属性</span>
                </template>
                <div style="display:flex; margin-top:7px">
                  <div>公司类型：</div>
                  <div>
                    <!-- <el-badge
                      :value="12"
                      class="item"
                      v-for="type in item.companyTypes"
                      :key="type"
                    >-->
                    <el-tag v-for="type in item.companyTypes" :key="type" size="mini">{{type}}</el-tag>
                    <!-- </el-badge> -->
                  </div>
                </div>
                <div style="display:flex; margin-top:7px">
                  <div>业务范围：</div>
                  <div>
                    <!-- <el-badge
                      :value="12"
                      class="item"
                      v-for="filed in item.businessFields"
                      :key="filed"
                    >-->
                    <el-tag v-for="filed in item.businessFields" :key="filed" size="mini">{{filed}}</el-tag>
                    <!-- </el-badge> -->
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </div>

        <el-table :data="projectList" size="mini" height="100%" v-else v-loading="isLoading">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="businessFields" label="类型" width="50px"></el-table-column>
          <el-table-column prop="area" label="面积" width="45px"></el-table-column>
          <el-table-column label="位置">
            <template
              slot-scope="scope"
            >{{scope.row['province']+scope.row['city']||''+scope.row['district']||''}}</template>
          </el-table-column>
          <el-table-column label="发布人">
            <template slot-scope="scope">{{scope.row.userInfo.username}}</template>
          </el-table-column>
          <el-table-column label="联系方式">
            <template slot-scope="scope">
              <span v-if="token">{{scope.row.userInfo.contact}}</span>
              <span v-else>登陆查看</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next, sizes,total"
          :page-size="pageSize"
          :page-sizes="[10,15,20,30]"
          :current-page="page"
          :total="total"
          size="mini"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MainMap from "../map/MainMap";
import { LMarker, LTooltip } from "vue2-leaflet";
import { companyOptions } from "../../utils/options";
import DistrictSelect from "@/components/districtSelect/DistrictSelect";
import CommonFilter from "@/components/CommonFilter";
import { getUserList, getInfoList } from "@/api/user";

export default {
  name: "Company",
  components: {
    MainMap,
    DistrictSelect,
    CommonFilter,
    LMarker,
    LTooltip
  },
  data() {
    return {
      companyOptions,
      isLoading: false,
      infoType: "supplyInfo",
      companyFilterForm: {
        companyTypes: [],
        businessFields: []
      },
      checkAll: {
        companyTypes: true,
        businessFields: true
      },
      demandType: "应急",
      administrativDivision: "",
      companyList: [],
      projectList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      isLogin: this.$store.getters.token != ""
    };
  },
  created() {
    this.unWatch = this.$watch("administrativDivision", () => {
      this.getCompany();
    });
  },
  watch: {
    checkAll: {
      handler(newVal) {
        ["companyTypes", "businessFields"].forEach(el => {
          if (newVal[el]) {
            this.companyFilterForm[el] = this.companyOptions.find(
              option => option.name == el
            ).value;
          } else if (
            this.companyFilterForm[el].length ==
            this.companyOptions.find(option => option.name == el).value.length
          ) {
            this.companyFilterForm[el] = [];
          }
        });
      },
      deep: true,
      immediate: true
    },
    companyFilterForm: {
      handler(val) {
        ["companyTypes", "businessFields"].forEach(el => {
          this.checkAll[el] =
            val[el].length ==
            this.companyOptions.find(option => option.name == el).value.length;
        });
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["token"]),
    companyListHasLatlon() {
      return this.companyList.filter(el => {
        return Boolean(el.companyLat) && Boolean(el.companyLon);
      });
    }
  },

  methods: {
    getCompany() {
      this.isLoading = true;
      if (this.infoType == "supplyInfo") {
        getUserList(this.page, this.pageSize, {
          ...this.companyFilterForm,
          ...this.administrativDivision
        })
          .then(res => {
            this.isLoading = false;
            if (res.code == 1) {
              this.unWatch && this.unWatch();
              this.total = res.datas.total;
              this.companyList = res.datas.datas.filter(el => {
                return el.companyName != "" || el.companyName != null;
              });
            }
            // console.log(res);
          })
          .catch(err => {
            this.isLoading = false;
          });
      } else {
        getInfoList(this.page, this.pageSize, {
          businessFields: this.demandType,
          type: this.infoType
        })
          .then(res => {
            this.isLoading = false;
            if (res.code == 1) {
              this.total = res.datas.total;
              this.projectList = res.datas.datas;
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
    },
    handleChange(val) {
      // this.companyFilterForm[type]=
      // console.log(val);
    },
    handleSizeChange() {
      this.getCompany();
    },
    handleCurrentChange() {
      this.getCompany();
    }
  }
};
</script>


<style lang="scss" scoped>
.el-tag {
  margin-right: 10px;
}
</style>

// <style lang="scss">
// .dashboard {
//   &-container {
//     height: calc(100vh - 50px);
//     display: flex;
//     .svg-icon {
//       width: 15px;
//       height: 15px;
//       margin-right: 5px;
//     }

//     .info-list {
//       width: 450px;
//       display: flex;
//       flex-direction: column;

//       .el-radio-button__inner {
//         width: 225px;
//       }

//       .title {
//         padding: 10px;
//         text-align: center;
//         color: #3dc1c7;
//         font-size: 18px;
//       }

//       .mb10 {
//         margin-bottom: 10px;
//       }
//       .ml10 {
//         margin-left: 10px;
//       }

//       .info-item {
//         // margin-left: 10px;
//         // margin: 0;
//       }

//       .company-filter {
//         margin-bottom: 0px;
//         .el-tabs {
//           box-shadow: none;
//         }
//         .el-tabs--border-card {
//           border-bottom: none;
//         }
//         .el-badge__content.is-fixed {
//           top: 8px;
//         }
//         .el-tabs__content {
//           padding: 5px 5px 5px 20px;
//         }
//         .el-checkbox {
//           margin-right: 27px;
//         }
//       }

//       .result-list {
//         flex: 1;
//         overflow: auto;
//         padding: 10px;
//         display: flex;
//         flex-direction: column;
//         .company-list-container {
//           flex: 1;
//           height: 100%;
//           overflow: auto;
//           .company-list {
//             margin-bottom: 10px;
//             .el-card__header {
//               padding: 8px 20px;
//               color: #fff;
//               background-color: #3dc1c7;
//             }
//             .el-card__body {
//               padding: 0px 20px;
//               .el-button--text {
//                 padding: 6px 0;
//               }
//             }
//           }
//         }
//       }

//       .filter-btn {
//         text-align: center;
//         .el-button {
//           width: 100px;
//         }
//       }
//     }
//     .map-com {
//       flex: 1;
//     }
//   }
// }
//
</style>
