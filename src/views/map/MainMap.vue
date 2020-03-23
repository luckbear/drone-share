<template>
  <div class="map-container">
    <l-map :zoom="zoom" :max-zoom="32" :center="center" :options="options" @ready="mapReady">
      <slot />
      <l-control-layers :collapsed="true" :sort-layers="true" @ready="layerControlReady" />
      <l-feature-group layer-type="base" name="天地图">
        <l-tile-layer
          v-for="tile in tianditu"
          :key="tile.name"
          :url="tile.url"
          :visible="tile.visible"
        />
      </l-feature-group>
      <l-tile-layer name="影像图" layer-type="base" :visible="false" :url="satellite.url" />
    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LControlLayers,
  LTileLayer,
  LFeatureGroup,
  LGeoJson
} from "vue2-leaflet";
import Vue from "vue";
export default {
  props: {
    isMain: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LMap,
    LControlLayers,
    LTileLayer,
    LFeatureGroup,
    LGeoJson
  },
  data() {
    return {
      zoom: 9,
      center: [26.51, 106.62],
      options: {
        attributionControl: false,
        preferCanvas: true
      },
      tianditu: [
        {
          name: "tianditu",
          visible: true,
          url:
            "https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=1902c209c7a7480dfb962751b839b91e"
        },
        {
          name: "tianditu_label",
          visible: true,
          url:
            "https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=1902c209c7a7480dfb962751b839b91e"
        }
      ],
      satellite: {
        name: "satellite",
        url:
          "https://t2.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=1902c209c7a7480dfb962751b839b91e"
      }
    };
  },

  methods: {
    mapReady(map) {
      if (this.isMain) {
        Vue.prototype.$map = map;
      }
      this.$emit("mapReady", map);
    },
    layerControlReady(e) {
      if (this.isMain) {
        Vue.prototype.$layerControl = e;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  height: 100%;
}
</style>
