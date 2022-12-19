<template>
  <!-- 推荐歌单 -->
  <div class="recommend-container">
    <div class="head">
      <h2>歌单推荐</h2>
    </div>
    <div class="nav">
      <a :class="{ active: catTag === '为你推荐' }" @click="getPlayList">精彩推荐</a>
      <a :class="{ active: catTag === item }" @click="getcategoryPlayList(item)" v-for="item in navList" :key="item">{{
          item
      }}</a>
      <div class="showAll">
        <router-link to="/allPlayList">更多&#8594</router-link>
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
import { onBeforeMount, ref } from 'vue'
import { getRecPlayList, getReccategoryPlayList } from '@/api/home'
import SquareItemList from '@/components/SquareItemList.vue'


let PlayListData = ref<PlayListInfo[] | ReccategoryPlaylistInfo[]>([])
let catTag = ref('')

let navList = ref(['华语', '流行', '摇滚', '民谣', '电子'])

let squareItems = ref<SquareItemProps[]>([])


const getcategoryPlayList = async (cat: string) => {
  let result = await getReccategoryPlayList(10, cat, 0);
  PlayListData.value = result.playlists
  squareItems.value = []
  PlayListData.value.forEach(item => {
    squareItems.value.push(Object.freeze({
      id: item.id,
      picUrl: item.coverImgUrl,
      name: item.name,
      routerPath: '/songlistDetail'
    }))
  })
  catTag.value = cat
}

const getPlayList = async () => {
  let result = await getRecPlayList();
  PlayListData.value = result.result;
  squareItems.value = []
  PlayListData.value.forEach(item => {
    squareItems.value.push(Object.freeze({
      id: item.id,
      picUrl: item.picUrl,
      name: item.name,
      routerPath: '/songlistDetail'
    }))
  })

  catTag.value = "为你推荐"
}


onBeforeMount(() => {
  getPlayList()
})
</script>

<style scoped lang="scss">
@media (max-width:1500px) {
  .recommend-container {
    min-width: 1487px;
  }
}

.active {
  color: var(--color-primary);
}

.recommend-container {
  width: 100vw;
  height: 85rem;
  // background: url(https://y.qq.com/ryqq/static/media/bg_detail.bb32b2d1.jpg?max_age=2592000) 50% 0 repeat-x;

  .head {
    width: 100%;
    height: 8%;
    text-align: center;
    letter-spacing: 10px;

    h2 {
      line-height: 100px;
      font-size: 30px;
      color: var(--color-text);
    }
  }

  .nav {
    width: 100%;
    height: 8%;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    color: var(--color-text);
    margin-bottom: 20px;

    a {
      margin: 0 24px;
      text-decoration: none;
      line-height: 100px;

      &:hover {
        color: var(--color-primary);
      }
    }

    .showAll {
      position: absolute;
      top: 0px;
      right: 240px;
    }
  }

  .content {
    width: 90%;
    height: 84%;
    margin: 0 auto;
  }
}
</style>
