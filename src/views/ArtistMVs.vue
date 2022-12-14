<template>
  <div class="container">
    <div class="title">全部MV:</div>
    <m-v-item :mv-list="mvList"></m-v-item>
    <div ref="show_more" v-show="mvList.length !== 0 && mvList.length > 20">
      <LazyMore />
    </div>
  </div>
</template>

<script lang="ts">
name: "ArtistMVs";
</script>
<script setup lang="ts">
import MVItem, { MVProps } from "@/components/MVItem.vue";
import { getArtistMV } from "@/api/mv";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import LazyMore from "@/components/LazyMore.vue";
import { ArtistMvInfo } from "@/types/MVInfo";

interface ArtistMv {
  code: number;
  hasMore: boolean;
  mvs: ArtistMvInfo[];
  time: number;
}

const route = useRoute();

let mvs = ref<ArtistMvInfo[]>([]);
let mvList = ref<MVProps[]>([]);
let limit = ref(20);
let show_more = ref();
let offset = ref(0);

const getArtMV = async () => {
  let artMV = (await getArtistMV(
    route.query.id,
    limit.value,
    offset.value
  )) as unknown as ArtistMv;
  mvs.value = artMV.mvs;
  mvList.value = [];
  addMVList();
};

const addMVList = () => {
  mvs.value.forEach((item) => {
    mvList.value.push(
      Object.freeze({
        id: item.id,
        name: item.name,
        picUrl: item.imgurl,
        artistId: item.artist?.id,
        playCount: item.playCount,
      })
    );
  });
};

onBeforeMount(() => {
  getArtMV();
});

onMounted(() => {
  let ob = new IntersectionObserver(async (changes) => {
    let item = changes[0];
    if (item.isIntersecting) {
      offset.value += 1;
      let artMV = (await getArtistMV(
        route.query.id,
        limit.value,
        offset.value
      )) as unknown as ArtistMv;
      mvs.value = artMV.mvs;
      addMVList();
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
