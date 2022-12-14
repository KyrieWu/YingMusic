<template>
  <div class="mv_container">
    <div class="mv_video">
      <video
        width="1276"
        height="718"
        class="video"
        :src="mvUrl.url"
        controls
      ></video>
    </div>
    <div class="mv_info">
      <div class="mv_name">
        <router-link
          :to="{ path: '/artistDetail', query: { id: mvDetail.artistId } }"
          >{{ mvDetail.artistName }} </router-link
        >&nbsp;—&nbsp;{{ mvDetail.name }}
        <div class="mv_icon" @click="toLikeMv">
          <i class="mv_like_icon" ref="mv_like_icon" title="收藏"></i>
        </div>
      </div>

      <div class="playCount">
        <span
          >播放量:&nbsp;{{ (mvDetail.playCount / 10000).toFixed(1) }}万</span
        >
        <span>发行时间:&nbsp;{{ mvDetail.publishTime }}</span>
      </div>
    </div>
    <div class="content">
      <div class="title">相关推荐：</div>
      <m-v-item :mv-list="mvList"></m-v-item>
    </div>
  </div>
</template>

<script lang="ts">
name: "MVDetail";
</script>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref, onUpdated } from "vue";
import { getMVUrl, getMVDetail, getArtistMV } from "@/api/mv";
import { useRoute } from "vue-router";
import MVItem, { MVProps } from "@/components/MVItem.vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useStore } from "vuex";
import { MVData, MVInfo, ArtistMvInfo } from "@/types/MVInfo";

interface ArtistMv {
  code: number;
  hasMore: boolean;
  mvs: ArtistMvInfo[];
  time: number;
}

interface MVURLData {
  code: number;
  expi: number;
  fee: number;
  id: number;
  md5: string;
  msg: string;
  mvFee: number;
  promotionVo: null;
  r: number;
  size: number;
  st: number;
  url: string;
}

const route = useRoute();
const store = useStore();

let mvUrl = ref({} as MVURLData);
let mvDetail = ref({} as MVInfo);
let artistmvs = ref<ArtistMvInfo[]>([]);
let mvList = ref<MVProps[]>([]);
let mv_like_icon = ref();
let likeMVStatus = ref(1);

const getmvurl = async (id: number) => {
  let res = await getMVUrl(id);
  console.log(res);
  mvUrl.value = res.data;
};

const getartMV = async (id: number) => {
  let mvD = await getMVDetail(id);
  mvDetail.value = mvD.data;
  let artistMV = (await getArtistMV(
    mvDetail.value.artistId,
    5,
    0
  )) as unknown as ArtistMv;
  artistmvs.value = artistMV.mvs;
  mvList.value = [];
  addMVList();
};

const addMVList = () => {
  artistmvs.value.forEach((item) => {
    mvList.value.push(
      Object.freeze({
        id: item.id,
        name: item.name,
        picUrl: item.imgurl,
        artistId: item.artist?.id,
        artistName: item.artist?.name,
      })
    );
  });
};

const toLikeMv = async () => {
  let res = await store.dispatch("LikeMV", {
    mvid: route.query.id,
    t: likeMVStatus.value,
  });

  if (res == 200) {
    if (likeMVStatus.value == 1) {
      likeMVStatus.value = 2;
      mv_like_icon.value.style.background =
        "url('已收藏.png') no-repeat center/cover";
    } else {
      likeMVStatus.value = 1;
      mv_like_icon.value.style.background =
        "url('收藏.png') no-repeat center/cover";
    }
  }
};

onMounted(() => {
  getmvurl(Number(route.query.id));
  getartMV(Number(route.query.id));

  let isLikeMV = store.state.likeMVlist?.filter(
    (item: any) => item.vid == route.query.id
  );

  if (isLikeMV.length > 0) {
    likeMVStatus.value = 2;
    mv_like_icon.value.style.background =
      "url('已收藏.png') no-repeat center/cover";
  } else {
    likeMVStatus.value = 1;
    mv_like_icon.value.style.background =
      "url('收藏.png') no-repeat center/cover";
  }
});

onBeforeRouteUpdate((to, from) => {
  if (to.query.id !== from.query.id) {
    getmvurl(Number(to.query.id));
    getartMV(Number(to.query.id));

    let isLikeMV = store.state.likeMVlist?.filter(
      (item: any) => item.id == to.query.id
    );

    if (isLikeMV.length > 0) {
      likeMVStatus.value = 2;
      mv_like_icon.value.style.background =
        "url('已收藏.png') no-repeat center/cover";
    } else {
      likeMVStatus.value = 1;
      mv_like_icon.value.style.background =
        "url('收藏.png') no-repeat center/cover";
    }
  }
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .mv_container {
    min-width: 1487px;
  }
}

.mv_container {
  margin-top: 64px;
  width: 100vw;

  .mv_video {
    padding-top: 3rem;

    padding: {
      left: 15vw;
      right: 15vw;
    }

    display: flex;
    justify-content: center;

    .video {
      border-radius: 20px;
    }
  }

  .mv_info {
    padding-top: 2rem;
    position: relative;

    padding: {
      left: 16.9vw;
      right: 16.9vw;
    }

    .mv_name {
      font-size: 2rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .mv_icon {
      width: 3.5rem;
      height: 3.5rem;
      cursor: pointer;
      float: left;
      margin-top: -0.5rem;
      margin-right: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;

      .mv_like_icon {
        background: url("@/assets/icons/收藏.png") no-repeat center/cover;
        float: left;
        width: 3rem;
        height: 3rem;
        //margin-top: 5px;
        margin-right: 4px;
      }

      &:hover {
        background-color: var(--color-secondary-bg-for-transparent);
      }

      &:active {
        transform: scale(0.97);
      }
    }

    .playCount {
      font-size: 1.4rem;
      color: var(--color-text);
      opacity: 0.7;
      margin-top: 1.5rem;

      span {
        &:first-child {
          margin-right: 1.5rem;
        }
      }
    }
  }

  .content {
    width: 83.5%;
    height: 25rem;
    margin: 0 auto;
    margin-top: 6rem;

    .title {
      font-size: 2rem;
      font-weight: 600;
      color: var(--color-text);
      margin-left: 16rem;
      margin-bottom: -4rem;
    }
  }
}
</style>
