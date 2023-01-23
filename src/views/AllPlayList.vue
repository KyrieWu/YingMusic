<template>
  <div class="allplaylist_container">
    <play-list-categories style="margin-bottom: 5rem"></play-list-categories>
    <div class="content">
      <square-item-list :square-items="squareItems"></square-item-list>
    </div>
    <div v-show="squareItems.length !== 0" ref="show_more">
      <lazy-more />
    </div>
  </div>
</template>

<script lang="ts">
name: "AllPlayList";
</script>
<script setup lang="ts">
import PlayListCategories from "@/components/PlayListCategories.vue";
import { ref, onBeforeMount, onMounted, watch } from "vue";
import { useStore } from "vuex";
import SquareItemList from "@/components/SquareItemList.vue";
import { getReccategoryPlayList } from "@/api/home";
import LazyMore from "@/components/LazyMore.vue";

const store = useStore();

let PlayListDatas = ref<CatePlayListInfo[]>([]);
let squareItems = ref<SquareItemProps[]>([]);
let show_more = ref();
let offset = ref(0);

const getPlayLists = async () => {
  offset.value = 0;
  let result = (await getReccategoryPlayList(
    20,
    store.state.cat,
    offset.value
  )) as unknown as CatePlayLists;
  PlayListDatas.value = result.playlists;
  squareItems.value = [];
  addSquareItem();
};

const addSquareItem = () => {
  PlayListDatas.value.forEach((item) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        picUrl: item.coverImgUrl,
        name: item.name,
        playCount: item.playCount,
        routerPath: "/songlistDetail",
      })
    );
  });
};

watch(
  () => store.state.cat,
  () => {
    getPlayLists();
  }
);

onBeforeMount(async () => {
  if (store.state.cat) {
    getPlayLists();
  }
});

onMounted(() => {
  let ob = new IntersectionObserver(async (changes) => {
    let item = changes[0];
    if (item.isIntersecting) {
      offset.value += 1;
      let result = (await getReccategoryPlayList(
        20,
        store.state.cat,
        offset.value
      )) as unknown as CatePlayLists;
      PlayListDatas.value = result.playlists;
      addSquareItem();
    }
  });
  ob.observe(show_more.value);
});
</script>

<style scoped lang="scss">
.allplaylist_container {
  margin-top: 138px;
  padding: {
    top: 1rem;
    left: 10vw;
    right: 10vw;
    bottom: 10rem;
  }
  .content {
    width: 100%;
  }
}

@media (max-width: 1336px) {
  .allplaylist_container {
    padding: 0 5vw;
  }
}
@media (max-width: 1500px) {
  .allplaylist_container {
    min-width: 1492px;
  }
}
</style>
