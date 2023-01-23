<template>
  <!-- 推荐歌单 -->
  <div class="recPlaylist_container">
    <div class="recPlaylist_head">
      <h2>{{ $t("home.recommendPlaylist") }}</h2>
    </div>
    <div class="recPlaylist_nav">
      <a :class="{ active: catTag === '为你推荐' }" @click="getPlayList"
        >精彩推荐</a
      >
      <a
        :class="{ active: catTag === item }"
        @click="getcategoryPlayList(item)"
        v-for="item in navList"
        :key="item"
        >{{ item }}</a
      >
      <div class="showAll">
        <router-link to="/allPlayList">{{ $t("home.seeMore") }}</router-link>
      </div>
    </div>
    <div class="content">
      <square-item-list :squareItems="squareItems"></square-item-list>
    </div>
  </div>
</template>

<script lang="ts">
name: "RecPlayList";
</script>
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { getRecPlayList, getReccategoryPlayList } from "@/api/home";
import SquareItemList from "@/components/SquareItemList.vue";

let PlayListData = ref<PlayListInfo[] | ReccategoryPlaylistInfo[]>([]);
let catTag = ref("");

let navList = ref(["华语", "流行", "摇滚", "民谣", "电子"]);

let squareItems = ref<SquareItemProps[]>([]);

const getcategoryPlayList = async (cat: string) => {
  let result = await getReccategoryPlayList(10, cat, 0);
  PlayListData.value = result.playlists;
  squareItems.value = [];
  PlayListData.value.forEach((item) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        picUrl: item.coverImgUrl,
        name: item.name,
        routerPath: "/songlistDetail",
      })
    );
  });
  catTag.value = cat;
};

const getPlayList = async () => {
  let result = await getRecPlayList();
  PlayListData.value = result.result;
  squareItems.value = [];
  PlayListData.value.forEach((item) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        picUrl: item.picUrl,
        name: item.name,
        routerPath: "/songlistDetail",
      })
    );
  });

  catTag.value = "为你推荐";
};

onBeforeMount(() => {
  getPlayList();
});
</script>

<style scoped lang="scss">
.active {
  color: var(--color-primary);
}

.recPlaylist_container {
  .recPlaylist_head {
    //padding-top: 1rem;
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

  .recPlaylist_nav {
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
  }
}

@media (max-width: 1500px) {
  .recPlaylist_container {
    min-width: 1492px;
  }
}
</style>
