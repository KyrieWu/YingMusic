<template>
  <!-- 新碟上架 -->
  <div class="albumlist-container">
    <div class="head">
      <h2>新碟上架</h2>
    </div>
    <div class="nav">
      <a @click="area = 'ALL'" :class="{active:area == 'ALL'}">精彩推荐</a>
      <a v-for="(item, index) in altumAreas" :key="item" @click="area = index" :class="{ active: area == index }">{{
          item
      }}</a>
      <div class="showAll">
        <router-link to="/allAltumList">更多&#8594</router-link>
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
import { onBeforeMount, ref, watch } from 'vue'
import { getNewAlbum } from '@/api/home'
import SquareItemList from '@/components/SquareItemList.vue'

interface AlbumArea {
  ZH: string,
  EA: string,
  KR: string,
  JP: string
}


let PlayListData = ref<AlbumInfo[]>([])
let altumAreas = ref<AlbumArea>({
  ZH: '华语', EA: '欧美', KR: '韩国', JP: '日本'
})

let area = ref('ALL')

let squareItems = ref<SquareItemProps[]>([])


let getAltums = async () => {
  let result = await getNewAlbum(area.value, 10, 0);
  PlayListData.value = result.albums
  squareItems.value = []
  PlayListData.value.forEach(item => {
    squareItems.value.push(Object.freeze({
      id: item.id,
      picUrl: item.picUrl,
      name: item.name,
      artistId: item.artist.id,
      artistName: item.artist.name,
      routerPath: '/altumDetail'
    }))
  })
}

watch(() => area.value, () => {
  getAltums()
})

onBeforeMount(() => {
  getAltums()
})
</script>

<style scoped lang="scss">
@media (max-width:1500px) {
  .albumlist-container {
    min-width: 1487px;
  }

  .item {
    float: none;
  }

}

.albumlist-container {
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

    .active {
      color: var(--color-primary);
    }
  }

  .content {
    width: 90%;
    height: 84%;
    margin: 0 auto;
  }
}
</style>
