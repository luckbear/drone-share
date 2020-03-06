<template>
  <div class="dashboard-container">
    <main-map />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MainMap from "../map/MainMap";
import ProviderInfo from "../infolist/ProviderInfo";

export default {
  name: "Dashboard",
  components: {
    MainMap,
    ProviderInfo
  },
  data() {
    return {
      activeName: "provider"
    };
  },
  computed: {
    ...mapGetters(["name"])
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    height: calc(100vh - 50px);
  }
}
</style>
