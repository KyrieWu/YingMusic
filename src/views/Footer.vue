<template>
  <footer>
    本项目仅供个人学习研究使用，禁止用于商业及非法用途。 基于<a
      href="https://opensource.org/licenses/MIT"
      target="_blank"
      >MIT license</a
    >
    许可进行开源。<br />
    <a href="https://github.com/KyrieWu/YingMusic" target="_blank">项目地址</a>
  </footer>
</template>

<script lang="ts">
export default {
  name: "Footer",
};
</script>
<script setup lang="ts"></script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  footer {
    min-width: 1487px;
  }
}
footer {
  width: 100vw;
  height: 20rem;
  background-color: #333;
  color: #fff;
  font-size: 1.4rem;
  text-align: center;
  line-height: 100px;
}
</style>
