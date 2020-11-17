<template>
  <div class="app-container">
    <div class="container shadow-container">
      <div class="cell-container">
        <div class="cell-pane">
          <div class="cell"></div>
        </div>
        <div class="cell-pane"></div>
      </div>
      <div class="cell-container"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.app-container{
    padding: 0;
}
.container {
  .cell-container {
    height: 50%;
    display: flex;
    .cell-pane {
      height: 100%;
      width: 50%;
      padding: 10px;
      .cell {
        //   box-shadow: ;
      }
    }
  }
}
</style>