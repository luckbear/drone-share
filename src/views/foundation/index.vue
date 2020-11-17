<template>
  <div class="app-container">
    <div class="f-container">
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell"></div>
        </div>
        <div class="cell-pane">
          <div class="cell"></div>
        </div>
      </div>
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell"></div>
        </div>
        <div class="cell-pane">
          <div class="cell"></div>
        </div>
      </div>
      <!-- <div class="cell-container"></div> -->
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
  background-color: #f1f2f5;
}
.f-container {
  height: 100%;
  .cell-container {
    height: 50%;
    display: flex;
    &:nth-child(1){
      .cell-pane{
        padding-bottom: 0;
      }
    }
    .cell-pane {
      height: 100%;
      width: 50%;
      padding: 10px;
      &:nth-child(1) {
        padding-right: 5px;
      }
      &:nth-child(2) {
        padding-left: 5px;
      }

      .cell {
        box-shadow: 0px 0px 38px 2px rgba(155, 155, 167, 0.49);
        height: 100%;
        border-radius: 8px;
      }
    }
  }
}
</style>