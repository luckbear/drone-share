<template>
  <div class="dashboard-container">
    <main-map class="map-com"></main-map>
    <common-filter filterType="driverData"></common-filter>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MainMap from "../map/MainMap";
import CommonFilter from "@/components/CommonFilter";

export default {
  name: "Dashboard",
  components: {
    MainMap,
    CommonFilter
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {}
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
          padding: 5px 20px;
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
