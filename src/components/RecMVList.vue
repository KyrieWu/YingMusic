<template>
  <!-- MV -->
  <div class="recMVList_container">
    <div class="head">
      <h2>MV</h2>
    </div>
    <div class="nav">
      <a @click="mvType = ''" :class="{ active: mvType == '' }">精彩推荐</a>
      <a
        v-for="item in navList"
        :key="item"
        @click="mvType = item"
        :class="{ active: mvType == item }"
        >{{ item }}</a
      >
      <div class="showAll">
        <router-link to="/allMVList">{{ $t("home.seeMore") }}</router-link>
      </div>
    </div>
    <div class="content">
      <m-v-item :mv-list="mvList"></m-v-item>
    </div>
  </div>
</template>

<script lang="ts">
name: "RecPlayList";
</script>
<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { getMVList } from "@/api/home";
import MVItem, { MVProps } from "@/components/MVItem.vue";

let navList = ref(["内地", "港台", "欧美", "韩国", "日本"]);

let mvDatas = ref<MVInfo[]>([]);
let mvType = ref("");
let mvList = ref<MVProps[]>([]);

watch(
  () => mvType.value,
  () => {
    getRecMV();
  }
);

const getRecMV = async () => {
  let result = await getMVList(mvType.value);
  mvDatas.value = result.data;
  mvList.value = [];
  mvDatas.value.forEach((item) => {
    mvList.value.push(
      Object.freeze({
        id: item.id,
        name: item.name,
        picUrl: item.cover,
        artistId: item.artistId,
        artistName: item.artistName,
      })
    );
  });
};

onBeforeMount(() => {
  getRecMV();
});
</script>

<style scoped lang="scss">
.recMVList_container {
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

    .active {
      color: var(--color-primary);
    }

    .showAll {
      position: absolute;
      top: 0px;
      right: 0;
    }
  }
}

@media (max-width: 1500px) {
  .recMVList_container {
    min-width: 1492px;
  }
}
</style>
