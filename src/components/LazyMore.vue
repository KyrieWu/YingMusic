<template>
  <div class="show_more" ref="show_more">
    <div class="line"></div>
    <div class="title">加载更多</div>
  </div>
</template>

<script lang="ts">
name: "LazyMore";
</script>
<script setup lang="ts"></script>

<style scoped lang="scss">
.show_more {
  width: 100%;
  height: 4rem;
  position: relative;

  .line {
    width: 100%;
    height: 2px;
    background-color: var(--color-secondary-bg-for-transparent);
    opacity: 0.8;
  }

  .title {
    position: absolute;
    width: 10rem;
    height: 100%;
    top: -2rem;
    left: 47%;
    background-color: var(--color-secondary-bg-for-transparent);
    text-align: center;
    font-size: 1.7rem;
    letter-spacing: 2px;
    line-height: 4rem;
    color: var(--color-text);
    border-radius: 10px;
  }
}
</style>
