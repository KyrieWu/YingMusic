<template>
  <div class="FM-container">此功能正在开发中。。。</div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { getDjCatelist } from "@/api/dj";

onBeforeMount(async () => {
  let res = await getDjCatelist();
  console.log(res);
});
</script>

<style scoped lang="scss">
.FM-container {
  margin-top: 138px;
  height: 500px;
  font-size: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
