<template>
  <!-- 推荐歌手 -->
  <div class="artists-container">
    <div class="head">
      <h2>歌手推荐</h2>
      <div class="showAll">
        <router-link to="/allArtists" style="letter-spacing: normal;">更多&#8594</router-link>
      </div>
    </div>
    <div class="content">
      <aritst-item :artists-infos="artistsInfos"></aritst-item>
    </div>

  </div>
</template>

<script lang="ts">
name: "RecPlayList";
</script>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { getRecArtists } from '../api/home'
import { Artists, ArtistsInfo } from '../types/Aritsts'
import AritstItem from '@/components/AritstItem.vue'

let artistsInfos = ref<ArtistsInfo[]>([])

onBeforeMount(async () => {
  let res = await getRecArtists() as unknown as Artists;
  artistsInfos.value = res.artists
})

</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .artists-container {
    min-width: 1487px;
  }

  .item {
    float: none;
  }
}

.artists-container {
  width: 100vw;
  height: 43rem;
  position: relative;
  display: block;
  // background: url(https://y.qq.com/ryqq/static/media/bg_detail.bb32b2d1.jpg?max_age=2592000) 50% 0 repeat-x;

  .head {
    width: 100%;
    height: 16%;
    text-align: center;
    letter-spacing: 10px;
    position: relative;
    margin-bottom: 5rem;

    h2 {
      line-height: 100px;
      font-size: 30px;
    }

    .showAll {
      position: absolute;
      top: 40px;
      right: 270px;
      font-size: 16px;
      color: var(--color-text);

      a {
        text-decoration: none;

        &:hover {
          color: var(--color-primary);
        }
      }
    }
  }

  .content {
    width: 90%;
    height: 84%;
    margin: 0 auto;
  }
}
</style>
