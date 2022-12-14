<template>
  <div class="allAlbum-container">
    <div class="head">
      <div class="panel">
        <div class="categorie-content">
          <div class="categories-list">
            <div class="item" v-for="(item, index) in altumAreas" :key="index">
              <a class="item_name" :class="{ active: area === index }" @click="area = index">{{ item }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="album_content">
      <div class="title">全部新碟:</div>
      <square-item-list :square-items="squareItems"></square-item-list>
    </div>
    <div ref="show_more" v-show="squareItems.length !== 0">
      <lazy-more></lazy-more>
    </div>
  </div>
</template>

<script lang="ts">
name: "AllMVLList";
</script>
<script setup lang="ts">
import { getNewAlbum } from "@/api/home";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { SquareItemProps } from "@/types/SquareItemProps";
import SquareItemList from "@/components/SquareItemList.vue";
import LazyMore from "@/components/LazyMore.vue";
import { AlbumInfo } from "@/types/Album";

interface AlbumArea {
  ALL: string;
  ZH: string;
  EA: string;
  KR: string;
  JP: string;
}

interface Albums {
  albums: AlbumInfo[];
  code: number;
  total: number;
}

let area = ref("ALL");
let albums = ref<AlbumInfo[]>([]);
let altumAreas = ref<AlbumArea>({
  ALL: "全部",
  ZH: "华语",
  EA: "欧美",
  KR: "韩国",
  JP: "日本",
});
let squareItems = ref<SquareItemProps[]>([]);
let offset = ref(0);
let show_more = ref();

watch(
  () => area.value,
  () => {
    getAlbumS();
  }
);

const getAlbumS = async () => {
  offset.value = 0;
  let res = (await getNewAlbum(
    area.value,
    20,
    offset.value
  )) as unknown as Albums;
  albums.value = res.albums;
  squareItems.value = [];
  addSquareItem();
};

const addSquareItem = () => {
  albums.value.forEach((item) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        picUrl: item.picUrl,
        name: item.name,
        artistId: item.artist.id,
        artistName: item.artist.name,
        routerPath: "/altumDetail",
        publishTime: item.publishTime,
      })
    );
  });
};

onBeforeMount(() => {
  getAlbumS();
});

onMounted(() => {
  let ob = new IntersectionObserver(async (changes) => {
    let item = changes[0];
    if (item.isIntersecting) {
      offset.value += 1;
      let res = (await getNewAlbum(
        area.value,
        20,
        offset.value
      )) as unknown as Albums;
      albums.value = res.albums;
      addSquareItem();
    }
  });
  ob.observe(show_more.value);
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .allAlbum-container {
    min-width: 1487px;
  }
}

.allAlbum-container {
  margin-top: 138px;
  padding-top: 40px;
  width: 100vw;

  .head {
    width: 75vw;
    margin: 0 auto;
    position: relative;
    margin-left: 24rem;

    .panel {
      width: 100%;
      padding: 1rem;

      //background-color: var(--color-secondary-bg);
      color: var(--color-text);

      .categorie-content {
        display: flex;

        .categories-list {
          margin-left: 3rem;
          display: flex;
          flex-wrap: wrap;

          .item {
            user-select: none;
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 16px;
            transition: 0.2s;
            min-width: 50px;
            margin-left: 3rem;

            .item_name {
              display: block;
              text-align: center;
              text-decoration: none;
              border-radius: 10px;
              padding: 5px;

              &:hover {
                background-color: var(--color-primary-bg);
                color: var(--color-primary);
              }

              &:active {
                transform: scale(0.98);
                transition: transform 0.2s;
              }
            }
          }

          .active {
            color: var(--color-primary);
            background-color: var(--color-primary-bg);
          }
        }
      }
    }
  }

  .album_content {
    width: 80%;
    margin: auto;

    .title {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--color-text);
      margin-left: 4rem;
      margin-top: 5rem;
    }
  }
}
</style>
