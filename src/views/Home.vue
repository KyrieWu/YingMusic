<template>
  <div class="container">
    <banner />
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
import Banner from "../components/Banner.vue";
import RecPlayList from "../components/RecPlayList.vue";
import RecArtists from "../components/RecArtists.vue";
import RecNewAlbumList from "../components/RecNewAlbumList.vue";
import RecTopList from "../components/RecTopList.vue";
import RecMVList from "../components/RecMVList.vue";
import DailyRecommend from '@/components/DailyRecommend.vue'
import { useStore } from 'vuex'

const store = useStore()
</script>

<style scoped lang="scss">
.container {
  margin-top: 64px;
}
</style>
