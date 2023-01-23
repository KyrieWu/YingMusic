<template>
  <!-- 模块列表 -->
  <nav>
    <router-link
      to="/allPlayList"
      class="icon-item"
      :class="{ active: route.name === 'allPlayList' }"
    >
      {{ $t("nav.playlists") }}
    </router-link>
    <router-link
      to="/allArtists"
      class="icon-item"
      :class="{ active: route.name === 'allArtists' }"
    >
      {{ $t("nav.artists") }}
    </router-link>
    <router-link
      to="/allTopList"
      class="icon-item"
      :class="{ active: route.name === 'allTopList' }"
    >
      {{ $t("nav.charts") }}
    </router-link>
    <!-- <router-link
      to="/allFMList"
      class="icon-item"
      :class="{ active: route.name === 'allFMList' }"
    >
      {{ $t("nav.fm") }}
    </router-link> -->
    <router-link
      to="/allMVList"
      class="icon-item"
      :class="{ active: route.name === 'allMVList' }"
    >
      MV
    </router-link>
    <router-link
      to="/allAltumList"
      class="icon-item"
      :class="{ active: route.name === 'allAltumList' }"
    >
      {{ $t("nav.album") }}
    </router-link>
  </nav>
</template>

<script lang="ts">
name: "IconList";
</script>
<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  nav {
    min-width: 1487px;
  }
}

@media (max-width: 1336px) {
  nav {
    padding: 0 10vw;
  }
}

nav {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 74px;

  padding: {
    right: 30vw;
    left: 30vw;
  }

  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  user-select: none;

  .icon-item {
    width: 7rem;
    height: 6rem;
    display: block;
    cursor: pointer;
    padding-top: 2px;
    text-align: center;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 6rem;
    color: var(--color-text);

    padding: {
      right: 5px;
      left: 5px;
    }

    text-decoration: none;

    &:hover {
      border-bottom: 1px solid var(--color-primary);
      color: var(--color-primary);
    }
  }

  .active {
    border-bottom: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
}
</style>
