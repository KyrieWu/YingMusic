<template>
  <!-- 新碟上架 -->
  <div class="recAlbumlist_container">
    <div class="head">
      <h2>{{ $t("home.newAlbum") }}</h2>
    </div>
    <div class="nav">
      <a @click="area = 'ALL'" :class="{ active: area == 'ALL' }">精彩推荐</a>
      <a
        v-for="(item, index) in altumAreas"
        :key="item"
        @click="area = index"
        :class="{ active: area == index }"
        >{{ item }}</a
      >
      <div class="showAll">
        <router-link to="/allAltumList">{{ $t("home.seeMore") }}</router-link>
      </div>
    </div>
    <div class="content">
      <square-item-list :square-items="squareItems"></square-item-list>
    </div>
  </div>
</template>

<script lang="ts">
name: "RecPlayList";
</script>
<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { getNewAlbum } from "@/api/home";
import SquareItemList from "@/components/SquareItemList.vue";

interface AlbumArea {
  ZH: string;
  EA: string;
  KR: string;
  JP: string;
}

let PlayListData = ref<AlbumInfo[]>([]);
let altumAreas = ref<AlbumArea>({
  ZH: "华语",
  EA: "欧美",
  KR: "韩国",
  JP: "日本",
});

let area = ref("ALL");

let squareItems = ref<SquareItemProps[]>([]);

let getAltums = async () => {
  let result = await getNewAlbum(area.value, 10, 0);
  PlayListData.value = result.albums;
  squareItems.value = [];
  PlayListData.value.forEach((item) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        picUrl: item.picUrl,
        name: item.name,
        artistId: item.artist.id,
        artistName: item.artist.name,
        routerPath: "/altumDetail",
      })
    );
  });
};

watch(
  () => area.value,
  () => {
    getAltums();
  }
);

onBeforeMount(() => {
  getAltums();
});
</script>

<style scoped lang="scss">
.recAlbumlist_container {
  .head {
    width: 100%;
    height: 7rem;
    text-align: center;

    h2 {
      line-height: 7rem;
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--color-text);
    }
  }

  .nav {
    width: 100%;
    height: 5rem;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    color: var(--color-text);
    margin-bottom: 10px;

    a {
      margin: 0 24px;
      text-decoration: none;
      line-height: 4rem;

      &:hover {
        color: var(--color-primary);
      }
    }

    .showAll {
      position: absolute;
      top: 0px;
      right: 0;
    }

    .active {
      color: var(--color-primary);
    }
  }
}

@media (max-width: 1500px) {
  .recAlbumlist_container {
    min-width: 1492px;
  }
}
</style>
