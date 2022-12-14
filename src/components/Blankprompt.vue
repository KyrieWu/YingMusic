<template>
  <div class="blank_prompt">
    <img src="https://y.qq.com/mediastyle/yqq/img/symbol_none.png?max_age=2592000">
    <slot>
      <p class="text">空空如也,请去<router-link to="/allPlayList" class="link">音乐馆</router-link>发现好音乐吧!</p>
    </slot>
  </div>
</template>

<script lang="ts">
name: 'Blankprompt'
</script>
<script setup lang="ts">
</script>

<style scoped lang="scss">
.blank_prompt {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    display: block;
    margin-bottom: 1rem;
  }

  .text {
    font-size: 1.8rem;
    color: var(--color-text);
  }

  .link {
    text-decoration: none;
    cursor: pointer;
    color: var(--color-primary);
  }

}
</style>