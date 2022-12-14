<template>
  <HeaderItem />
  <!-- <MessageItem message="手机号或密码错误" type="warn" v-if="store.state.showPlayerBar"></MessageItem> -->
  <NavBar v-if="$route.meta.musicHall" />
  <main>
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomeItem', 'LibraryItem', 'SearchItem']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
  <play-bar v-show="store.state.showPlayerBar"></play-bar>
</template>

<script setup lang="ts">
import HeaderItem from "./components/HeaderItem.vue";
import PlayBar from "@/components/PlayBar.vue";
import NavBar from "@/components/NavBar.vue";
import { useStore } from "vuex";
import MessageItem from "./components/Message/MessageItem.vue";

const store = useStore();
</script>

<style scoped>
#app {
  margin: 0;
  padding: 0;
}

main {
  /* position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0; */
  overflow: auto;
  padding-bottom: 96px;
  box-sizing: border-box;
  scrollbar-width: none;
}

@media (max-width: 1500px) {
  main {
    padding-bottom: 96px;
  }
}
</style>
