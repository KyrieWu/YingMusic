<template>
  <div class="artists-container">
    <div class="head">
      <div class="panel">
        <div class="categorie-content">
          <!-- <a class="categories">全部</a> -->
          <div class="categories-list">
            <div class="item">
              <a class="item_name" :class="{ active: init === '-1' }" @click="init = '-1'">热门</a>
            </div>
            <div class="item" v-for="(item, index) in Initial" :key="index">
              <a class="item_name" :class="{ active: init === `${item}` }" @click="init = `${item}`">{{ item }}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="categorie-content">
          <!-- <a class="categories">全部</a> -->
          <div class="categories-list">
            <div class="item" style="margin-right: 2rem" v-for="(item, index) in TypeValue" :key="index">
              <a class="item_name" :class="{ active: type === TypeKey[index] }" @click="type = TypeKey[index]">{{ item
              }}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="categorie-content">
          <!-- <a class="categories">全部</a> -->
          <div class="categories-list">
            <div class="item" style="margin-right: 2rem" v-for="(item, index) in AreaValue" :key="index">
              <a class="item_name" :class="{ active: area === AreeKey[index] }" @click="area = AreeKey[index]">{{ item
              }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <aritst-item :artists-infos="artistsInfos"></aritst-item>
    </div>
    <div v-show="artistsInfos.length !== 0" ref="show_more">
      <lazy-more />
    </div>
  </div>
</template>

<script lang="ts">
name: "AllArtists";
</script>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { getCateArtist } from "@/api/artist";
import {
  Initial,
  TypeKey,
  TypeValue,
  AreaValue,
  AreeKey,
} from "@/utils/cateArtistInfo";
import AritstItem from "@/components/AritstItem.vue";
import { Artists, ArtistsInfo } from "../types/Aritsts";
import LazyMore from "@/components/LazyMore.vue";

let artistsInfos = ref<ArtistsInfo[]>([]);
let type = ref(-1);
let area = ref(-1);
let init = ref("-1");
let offset = ref(0);
let show_more = ref();

watch(
  () => type.value,
  () => {
    getArtists();
  }
);
watch(
  () => init.value,
  () => {
    getArtists();
  }
);
watch(
  () => area.value,
  () => {
    getArtists();
  }
);

let getArtists = async () => {
  offset.value = 0;
  let res = (await getCateArtist(
    type.value,
    area.value,
    init.value,
    offset.value
  )) as unknown as Artists;
  artistsInfos.value = [];
  res.artists.forEach((item) => {
    artistsInfos.value.push(Object.freeze(item));
  });
};

onBeforeMount(() => {
  getArtists();
});

onMounted(() => {
  let ob = new IntersectionObserver(async (changes) => {
    let item = changes[0];
    if (item.isIntersecting) {
      offset.value += 1;
      console.log(offset.value);
      let res = (await getCateArtist(
        type.value,
        area.value,
        init.value,
        offset.value
      )) as unknown as Artists;
      res.artists.forEach((item) => {
        artistsInfos.value.push(Object.freeze(item));
      });
    }
  });
  ob.observe(show_more.value);
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .artists-container {
    min-width: 1487px;
  }
}

.artists-container {
  margin-top: 138px;
  padding-top: 40px;
  width: 100vw;

  .panel {
    width: 76%;
    margin: 0 auto;
    //margin-left: 25rem;
    //border-radius: 10px;
    padding: 1rem;

    //background-color: var(--color-secondary-bg);
    color: var(--color-text);

    .categorie-content {
      display: flex;

      .categories {
        font-size: 24px;
        font-weight: 700;
        opacity: 0.68;
        margin-left: 24px;
        min-width: 24px;
        height: 26px;
      }

      .categories-list {
        margin-left: 24px;
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

          &:first-child {
            margin-right: 2.5rem;
          }
        }

        .active {
          color: var(--color-primary);
          background-color: var(--color-primary-bg);
        }
      }
    }
  }

  .content {
    width: 90%;
    margin: 0 auto;
    margin-top: 5rem;
  }
}
</style>
