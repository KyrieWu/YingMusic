<template>
  <div class="context-menu">
    <div v-if="showMenu" ref="menu" class="menu" tabindex="-1" :style="{ top: top, left: left }" @click="closeMenu"
      @blur="closeMenu">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, nextTick, ref } from "vue";

const menu = ref();

const data = reactive({
  showMenu: false,
  top: "0px",
  left: "opx",
});

const setMenu = (top: number, left: number): void => {
  nextTick(() => {
    let lastgestHeight =
      window.innerHeight - menu.value.style.offsetHeight - 64;
    let lastgestwidth = window.innerWidth - menu.value.style.offsetWidth - 25;
    if (top > lastgestHeight) top = lastgestHeight;
    if (left > lastgestwidth) left = lastgestwidth;
    data.top = top + "px";
    data.left = left + "px";
  });
};

const closeMenu = (): void => {
  data.showMenu = false;
};

const openMenu = (e: MouseEvent): void => {
  data.showMenu = true;
  nextTick(function () {
    setMenu(e.y, e.x);
    menu.value.focus();
  }.bind(this))

  e.preventDefault();
};

defineExpose({
  openMenu,
  closeMenu,
});

const { showMenu, top, left } = toRefs(data);
</script>

<style lang="scss">
.context-menu {
  width: 100%;
  height: 100%;
  user-select: none;

  .menu {
    position: fixed;
    min-width: 136px;
    max-width: 240px;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: 0 6px 12px -4px rgab(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    box-sizing: border-box;
    padding: 6px;
    z-index: 1000;
    transition: background 125ms ease-out, opacity 125ms ease-out,
      transform 125ms ease-out;

    &:focus {
      outline: none;
    }



    .item {
      font-weight: 600;
      font-size: 14px;
      padding: 10px 14px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--color-text);
      display: flex;
      align-items: center;
      list-style: none;

      &:hover {
        color: var(--color-primary);
        background: var(--color-primary-bg-for-transparent);
        transition: opacity 125ms ease-out, transform 125ms ease-out;
      }

      &:active {
        opacity: 0.75;
        transform: scale(0.95);
      }


      img {
        height: 16px;
        width: 16px;
        margin-right: 5px;
      }
    }
  }
}

@supports (-moz-appearance: none) {
  .menu {
    background-color: var(--color-body-bg) !important;
  }
}
</style>
