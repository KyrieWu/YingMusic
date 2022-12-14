<template>
  <div class="container">
    <div class="title">全部专辑:</div>
    <square-item-list :square-items="squareItems"></square-item-list>
    <div ref="show_more" v-show="squareItems.length !== 0 && squareItems.length > 20">
      <lazy-more></lazy-more>
    </div>
  </div>
</template>

<script lang="ts">
name: "ArtistAlbums";
</script>
<script setup lang="ts">
import { SquareItemProps } from "@/types/SquareItemProps";
import SquareItemList from "@/components/SquareItemList.vue";
import { getArtAlbum } from "@/api/altum";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import LazyMore from "@/components/LazyMore.vue";
import { AlbumInfo } from "@/types/Album";
import { ArtistsInfo } from "@/types/Aritsts";

interface ArtAlbumResult {
  artist: ArtistsInfo;
  code: number;
  hotAlbums: AlbumInfo[];
  more: boolean;
}

const route = useRoute();

let hotAlbums = ref<AlbumInfo[]>([]);
let squareItems = ref<SquareItemProps[]>([]);
let limit = ref(20);
let offset = ref(0);
let show_more = ref();

const getArtAlbums = async () => {
  let res = (await getArtAlbum(
    route.query.id,
    limit.value,
    offset.value
  )) as unknown as ArtAlbumResult;
  console.log(res);
  hotAlbums.value = res.hotAlbums;
  squareItems.value = [];
  addSquareItem();
};

const addSquareItem = () => {
  hotAlbums.value.forEach((item) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        name: item.name,
        picUrl: item.picUrl,
        routerPath: "/altumDetail",
        artistId: item.artist.id,
        publishTime: item.publishTime,
      })
    );
  });
};

onBeforeMount(() => {
  getArtAlbums();
});

onMounted(() => {
  let ob = new IntersectionObserver(async (changes) => {
    let item = changes[0];
    if (item.isIntersecting) {
      offset.value += 1;
      let res = (await getArtAlbum(
        route.query.id,
        limit.value,
        offset.value
      )) as unknown as ArtAlbumResult;
      hotAlbums.value = res.hotAlbums;
      addSquareItem();
    }
  });
  ob.observe(show_more.value);
});
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;

  .title {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin-left: 3rem;
    margin-bottom: 2rem;
  }
}
</style>
