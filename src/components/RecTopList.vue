<template>
  <!-- 排行榜 -->
  <div class="toplist_container">
    <div class="head">
      <h2>{{ $t("home.charts") }}</h2>
      <div class="showAll">
        <router-link to="/allTopList" style="letter-spacing: normal">{{
          $t("home.seeMore")
        }}</router-link>
      </div>
    </div>
    <square-item-list :squareItems="squareItems" />
  </div>
</template>

<script lang="ts">
name: "TopLIST";
</script>
<script setup lang="ts">
import { getTopList, getPlayListTrack } from "@/api/home";
import { onBeforeMount, ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import SquareItemList from "./SquareItemList.vue";

const store = useStore();
const router = useRouter();

let topListInfo = ref<TopListInfo[]>([]);
let squareItems = ref<SquareItemProps[]>([]);
let topMusicList = ref<Map<string, SongInfo[]>>(new Map());

onBeforeMount(() => {
  getTopMusicList();
});

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

const getTopMusicList = async () => {
  const res = await getTopList();
  const topListInfo = res.list.slice(0, 5);
  topListInfo.forEach((item) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        picUrl: item.coverImgUrl,
        name: item.name,
      })
    );
  });
};

const playAllSong = (songs: SongInfo[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

const playAllMusic = async () => {
  for (let i = 0; i < topListInfo.value.length; i++) {
    const result = await getPlayListTrack(topListInfo.value[i].id, 20);
    topMusicList.value.set(topListInfo.value[i].name, result.songs);
  }
};
</script>

<style scoped lang="scss">
.toplist_container {
  .head {
    width: 100%;
    height: 7rem;
    text-align: center;
    position: relative;
    margin-bottom: 10px;

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
// @media (max-width: 1536px) {
// 	.toplist_container {
// 		//height: 55rem;
// 	}
// }
@media (max-width: 1500px) {
  .toplist_container {
    min-width: 1492px;
  }
}
</style>
