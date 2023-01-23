<template>
  <div class="home_container">
    <!-- <banner /> -->
    <daily-recommend v-if="store.state.isLogin" />
    <rec-play-list />
    <rec-artists />
    <rec-new-album-list />
    <rec-top-list />
    <rec-m-v-list />
  </div>
</template>

<script lang="ts">
name: "HomeItem";
</script>
<script setup lang="ts">
//import Banner from "../components/Banner.vue";
import RecPlayList from "../components/RecPlayList.vue";
import RecArtists from "../components/RecArtists.vue";
import RecNewAlbumList from "../components/RecNewAlbumList.vue";
import RecTopList from "../components/RecTopList.vue";
import RecMVList from "../components/RecMVList.vue";
import DailyRecommend from "@/components/DailyRecommend.vue";
import { useStore } from "vuex";

const store = useStore();
</script>

<style scoped lang="scss">
.home_container {
  margin-top: 64px;

  padding: {
    top: 1rem;
    left: 10vw;
    right: 10vw;
    bottom: 1rem;
  }
}

@media (max-width: 1336px) {
  .home_container {
    padding: 0 5vw;
  }
}
</style>
