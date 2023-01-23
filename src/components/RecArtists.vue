<template>
  <!-- 推荐歌手 -->
  <div class="recArtists_container">
    <div class="head">
      <h2>{{ $t("home.recommendArtist") }}</h2>
      <div class="showAll">
        <router-link to="/allArtists" style="letter-spacing: normal">{{
          $t("home.seeMore")
        }}</router-link>
      </div>
    </div>
    <RoundItem :artists-infos="artistsInfos"></RoundItem>
  </div>
</template>

<script lang="ts">
name: "RecPlayList";
</script>
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { getRecArtists } from "@/api/home";
import RoundItem from "@/components/RoundItem.vue";

let artistsInfos = ref<ArtistsInfo[]>([]);

onBeforeMount(async () => {
  let res = await getRecArtists();
  artistsInfos.value = res.artists;
});
</script>

<style scoped lang="scss">
.recArtists_container {
  margin-bottom: 2rem;

  .head {
    width: 100%;
    height: 7rem;
    text-align: center;
    position: relative;
    margin-bottom: 10px;
    padding-top: 1rem;
    h2 {
      color: var(--color-text);
      line-height: 7rem;
      font-size: 2.5rem;
      font-weight: 600;
    }

    .showAll {
      position: absolute;
      top: 50px;
      right: 20px;
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
}

@media (max-width: 1500px) {
  .recArtists_container {
    min-width: 1492px;
  }
}
</style>
