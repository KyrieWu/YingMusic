<template>
  <!-- MV -->
  <div class="albumlist-container">
    <div class="head">
      <h2>MV</h2>
    </div>
    <div class="nav">
      <a @click="mvType = ''" :class="{active:mvType==''}">精彩推荐</a>
      <a v-for="item in navList" :key="item" @click="mvType = item" :class="{ active: mvType == item }">{{ item }}</a>
      <div class="showAll">
        <router-link to="/allMVList">更多&#8594</router-link>
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
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { getMVList } from '../api/home'
import { MVData, MVInfo } from '../types/MVInfo'
import MVItem, { MVProps } from '@/components/MVItem.vue'

let navList = ref(['内地', '港台', '欧美', '韩国', '日本'])

let mvDatas = ref<MVInfo[]>([])
let mvType = ref('')
let mvList = ref<MVProps[]>([])

watch(() => mvType.value, () => {
  getRecMV()
})

const getRecMV = async () => {
  let result = await getMVList(mvType.value) as unknown as MVData;
  mvDatas.value = result.data;
  mvList.value = []
  mvDatas.value.forEach(item => {
    mvList.value.push(Object.freeze({
      id: item.id,
      name: item.name,
      picUrl: item.cover,
      artistId: item.artistId,
      artistName: item.artistName
    }))
  })
}

onBeforeMount(() => {
  getRecMV()
})
</script>

<style scoped lang="scss">
@media (max-width:1500px) {
  .albumlist-container {
    min-width: 1487px;
  }

}

.albumlist-container {
  width: 100vw;
  //height: 55rem;
  position: relative;
  display: block;
  // background: url(https://y.qq.com/ryqq/static/media/bg_detail.bb32b2d1.jpg?max_age=2592000) 50% 0 repeat-x;

  .head {
    width: 100%;
    height: 6rem;
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
    height: 4.4rem;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    color: var(--color-text);
    margin-bottom: 4rem;

    a {
      margin: 0 24px;
      text-decoration: none;
      line-height: 100px;

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
