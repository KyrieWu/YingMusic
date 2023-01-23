<template>
  <footer>
    <p>
      本项目仅供个人学习研究使用，禁止用于商业及非法用途。 基于<a
        href="https://opensource.org/licenses/MIT"
        target="_blank"
        >MIT license</a
      >
      许可进行开源。
    </p>
    <p>
      <a href="https://github.com/KyrieWu/YingMusic" target="_blank">GitHub</a>
    </p>
  </footer>
</template>

<script lang="ts">
export default {
  name: "Footer",
};
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  footer {
    min-width: 1487px;
  }
}
footer {
  width: 100vw;
  height: 10rem;
  background-color: #f9f9f9;
  color: rgba(60, 60, 60, 0.7);
  font-size: 1.4rem;
  text-align: center;
  padding-top: 2rem;

  a {
    text-decoration: none;
    font-size: 1.6rem;
    color: var(--color-text);

    &:hover {
      color: rgba(60, 60, 60, 0.7);
    }
  }
}
</style>
