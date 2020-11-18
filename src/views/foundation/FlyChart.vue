<template>
  <iframe :src="url" frameborder="0" class="container"></iframe>
</template>

<script>

const url = process.env.BASE_URL + "fly/index.html";

export default {
  data() {
    return {
      url,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>