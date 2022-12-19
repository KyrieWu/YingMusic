<template>
  <div class="playlist-container">
    <div class="playlist-main">
      <div class="playlist-img">
        <router-link :to="{ path: '/artistDetail', query: { id: route.query.id } }">
          <img :src="playListData.artist?.cover" alt="" />
        </router-link>
      </div>
      <div class="playlist-detail">
        <div class="title">
          <h1>{{ playListData.artist?.name }}</h1>
        </div>
        <!-- <div class="art">
          <i class="icon_singer"></i>
          <a href="">{{ playListData.creator.nickname }}</a>
        </div> -->
        <ul class="data_info">
          <li class="data_info_item">
            <div class="data_tag_box">
              职业:&nbsp;
              <span> {{ playListData.identify?.imageDesc }} </span>
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              单曲:&nbsp; {{ playListData.artist?.musicSize }}
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              专辑:&nbsp;
              {{ playListData.artist?.albumSize }}
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              MV:&nbsp;
              {{ playListData.artist?.mvSize }}
            </div>
          </li>
        </ul>
        <div class="data_actions">
          <a class="mod_btn_blue" @click="playAllSong(hotSongDetail)">
            <i class="mod_btn_green__icon_play"></i>
            <span>播放热门歌曲</span>
          </a>
          <a class="mod_btn" @click="attentionArt">
            <i class="mod_btn__icon_attention" ref="mod_btn__icon_attention"></i>
            <span ref="attention_text">关注</span>
          </a>
          <!-- <a href="" class="mod_btn">
            <i class="mod_btn__icon_commend"></i>
            <span>评论</span>
          </a> -->
        </div>
      </div>
    </div>
    <div class="detail_layout" v-if="route.path == '/artistDetail'">
      <div class="detail_layout__main">
        <div class="layout_head">热门歌曲:</div>
        <router-link :to="{
          path: '/artistDetail/artistSongs',
          query: { id: route.query.id },
        }" class="more">查看全部</router-link>
        <artist-song-item :hot-song-detail="hotSongDetail"></artist-song-item>
      </div>
      <div class="detail_layout__mv" v-if="mvList.length !== 0">
        <div class="title">MVs:</div>
        <router-link :to="{
          path: '/artistDetail/artistMVs',
          query: { id: route.query.id },
        }" class="more">查看全部</router-link>
        <m-v-item :mv-list="mvList"></m-v-item>
      </div>
      <div class="detail_layout__album" v-if="squareItems.length !== 0">
        <div class="title">专辑:</div>
        <router-link :to="{
          path: '/artistDetail/artistAlbums',
          query: { id: route.query.id },
        }" class="more">查看全部</router-link>
        <square-item-list :square-items="squareItems"></square-item-list>
      </div>
      <div class="detail_layout__simiArt" v-if="simiartistsInfos.length !== 0">
        <div class="title">相似歌手:</div>
        <aritst-item :artists-infos="simiartistsInfos"></aritst-item>
      </div>
    </div>
    <div class="more_show" v-if="
  route.path == '/artistDetail/artistMVs' ||
  route.path == '/artistDetail/artistAlbums' ||
  route.path == '/artistDetail/artistSongs'
    ">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
name: "PlayList";
</script>
<script setup lang="ts">
import {
  getArtistDetail,
  getArtistHotSong,
  getSimitArtist,
} from "@/api/artist";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import MVItem, { MVProps } from "@/components/MVItem.vue";
import { getArtistMV } from "@/api/mv";
import SquareItemList from "@/components/SquareItemList.vue";
import { getArtAlbum } from "@/api/altum";
import ArtistSongItem from "@/components/ArtistSongItem.vue";
import AritstItem from "@/components/AritstItem.vue";

interface HotSong {
  artist: object;
  code: number;
  hotSongs: SongInfo[];
  more: boolean;
}

interface ArtistMv {
  code: number;
  hasMore: boolean;
  mvs: ArtistMvInfo[];
  time: number;
}

interface ArtistAlbum {
  artist: object;
  code: number;
  hotAlbums: AlbumInfo[];
  more: boolean;
}

interface SimitArtist {
  artists: ArtistsInfo[];
  code: number;
}

interface ArtDetailData {
  artist: ArtistsInfo;
  blacklist: boolean;
  identify: {
    actionUrl: string;
    imageDesc: string;
    imageUrl?: string;
  };
  preferShow: number;
  secondaryExpertIdentiy: [];
  showPriMsg: boolean;
  videoCount: number;
}

const store = useStore();

const route = useRoute();
const router = useRouter();

let playListData = ref({} as ArtDetailData);
let hotSongDetail = ref<SongInfo[]>([]);
let mvList = ref<MVProps[]>([]);
let squareItems = ref<SquareItemProps[]>([]);
let simiartistsInfos = ref<ArtistsInfo[]>([]);

let mod_btn__icon_attention = ref();
let attention_text = ref();
let attentionArtStatus = ref(1);

const playAllSong = (songs: any[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

const getArtDetail = async (id: number) => {
  let res = await getArtistDetail(id);
  playListData.value = res.data;
};

const getArtHotSong = async (id: number) => {
  let res2 = (await getArtistHotSong(id)) as unknown as HotSong;
  hotSongDetail.value = res2.hotSongs.slice(0, 10);
};

const getArtMV = async (id: number) => {
  let artMV = (await getArtistMV(id, 10, 0)) as unknown as ArtistMv;
  mvList.value = [];
  artMV.mvs.forEach((item) => {
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

const getArtAlbums = async (id: number) => {
  let res = (await getArtAlbum(id, 10, 0)) as unknown as ArtistAlbum;
  squareItems.value = [];
  res.hotAlbums.forEach((item) => {
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

const getsimitArtist = async (id: number) => {
  if (store.state.isLogin) {
    let res = (await getSimitArtist(id)) as unknown as SimitArtist;
    simiartistsInfos.value = res.artists.slice(0, 6);
  }
};

onMounted(() => {
  let id = Number(route.query.id);
  getArtDetail(id);
  getArtHotSong(id);
  getArtMV(id);
  getArtAlbums(id);
  getsimitArtist(id);

  let isLikeSong = store.state.likeArtistlist?.filter(
    (item: any) => item.id == route.query.id
  );

  if (isLikeSong.length > 0) {
    attentionArtStatus.value = 2;
    mod_btn__icon_attention.value.style.background =
      "url('已关注(人).png') no-repeat center/cover";
    attention_text.value.innerText = "已关注";
  } else {
    attentionArtStatus.value = 1;
    mod_btn__icon_attention.value.style.background =
      "url('加关注\(人\).png') no-repeat center/cover";
    attention_text.value.innerText = "关注";
  }
});

onBeforeRouteUpdate((to, from) => {
  if (to.query.id !== from.query.id) {
    let id = Number(to.query.id);
    getArtDetail(id);
    getArtHotSong(id);
    getArtMV(id);
    getArtAlbums(id);
    getsimitArtist(id);

    let isLikeSong = store.state.likeArtistlist?.filter(
      (item: any) => item.id == to.query.id
    );

    if (isLikeSong.length > 0) {
      attentionArtStatus.value = 2;
      mod_btn__icon_attention.value.style.background =
        "url('已关注(人).png') no-repeat center/cover";
      attention_text.value.innerText = "已关注";
    } else {
      attentionArtStatus.value = 1;
      mod_btn__icon_attention.value.style.background =
        "url('加关注\(人\).png') no-repeat center/cover";
      attention_text.value.innerText = "关注";
    }
  }
});

const attentionArt = async () => {
  let res = await store.dispatch("LikeArt", {
    artid: Number(route.query.id),
    t: Number(attentionArtStatus.value),
  });
  if (res == 200) {
    if (attentionArtStatus.value == 1) {
      attentionArtStatus.value = 2;
      mod_btn__icon_attention.value.style.background =
        "url('已关注(人).png') no-repeat center/cover";
      attention_text.value.innerText = "已关注";
    } else {
      attentionArtStatus.value = 1;
      mod_btn__icon_attention.value.style.background =
        "url('加关注\(人\).png') no-repeat center/cover";
      attention_text.value.innerText = "关注";
    }
  }
};
</script>

<style scoped lang="scss">
@media (max-width: 1750px) {
  .playlist-container {
    min-width: 1727px;
  }

  .playlist-img,
  .detail_layout__main,
  li,
  .songlist__songname,
  .list_menu__item,
  .songlist__artist,
  .songlist__album,
  .songlist__time,
  .detail_layout_other,
  .songlist__songname_txt,
  .playlist-img,
  .list_menu__item {
    float: none;
  }
}

.playlist-container {
  width: 100vw;
  //padding: 0 15vw;
  margin: 0 auto;
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .playlist-main {
    width: 80%;
    height: 35rem;
    position: relative;
    margin-bottom: 3rem;

    .playlist-img {
      width: 30%;
      height: 85%;
      float: left;
      margin-top: 50px;

      img {
        width: 68%;
        height: 100%;
        margin-left: 50px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .playlist-detail {
      width: 60%;
      height: 71.5%;
      padding-top: 50px;
      float: left;

      .title {
        font-size: 1.5rem;
        color: var(--color-text);

        h1 {
          font-weight: 600;
        }
      }

      .art {
        font-size: 18px;
        color: var(--color-text);

        .icon_singer {
          display: block;
          width: 18px;
          height: 18px;
          background: url(@/assets/icons/作者.png) no-repeat center/cover;
          float: left;
          margin-top: 3px;
          margin-right: 10px;
        }

        a {
          text-decoration: none;

          &:hover {
            color: var(--color-primary);
          }
        }
      }

      .data_info {
        list-style: none;
        padding: 0;
        font-size: 14px;
        display: block;

        .data_info_item {
          margin-bottom: 8px;
          font-weight: 400;

          .data_info_tags {
            text-decoration: none;
            margin-right: 12px;

            &:hover {
              color: var(--color-primary);
            }
          }
        }
      }

      .data_actions {
        margin-top: 10px;
        font-size: 14px;

        .mod_btn_blue {
          border-radius: 5px;
          font-size: 14px;
          margin-right: 6px;
          padding: 0 23px;
          height: 38px;
          line-height: 38px;
          display: inline-block;
          white-space: nowrap;
          box-sizing: border-box;
          overflow: hidden;
          background-color: var(--color-primary);
          color: #fff;
          margin-right: 10px;

          .mod_btn_green__icon_play {
            background: url("@/assets/icons/播放.png") no-repeat center/cover;
            width: 30px;
            height: 30px;
            float: left;
            margin-top: 4px;
            margin-left: -20px;
          }

          &:hover {
            background-color: var(--color-primary);
            text-decoration: none;
            transform: scale(1.05);
            transition: transform 0.3s ease-in-out;
          }

          &:active {
            transform: scale(0.95);
            transition: transform 0.3s ease-in-out;
          }
        }

        .mod_btn {
          border-radius: 5px;
          font-size: 14px;
          margin-right: 6px;
          padding: 0 23px;
          height: 38px;
          line-height: 38px;
          display: inline-block;
          white-space: nowrap;
          box-sizing: border-box;
          overflow: hidden;
          color: var(--color-text);
          border: 1px solid #333;
          margin-right: 10px;

          .mod_btn__icon_attention {
            background: url("@/assets/icons/加关注\(人\).png") no-repeat center/cover;
            float: left;
            width: 25px;
            height: 25px;
            margin-top: 5px;
            margin-right: 4px;
          }

          .mod_btn__icon_commend {
            background: url("@/assets/icons/评论.png") no-repeat center/cover;
            float: left;
            width: 25px;
            height: 25px;
            margin-top: 6px;
            margin-right: 4px;
          }

          &:hover {
            background-color: var(--color-secondary-bg-for-transparent);
            text-decoration: none;
          }

          &:active {
            transform: scale(0.98);
          }
        }
      }
    }
  }

  .detail_layout {
    width: 80%;
    //height: 70rem;
    margin-left: 2rem;
    display: flex;
    flex-direction: column;

    li {
      list-style: none;
      display: block;
    }

    .detail_layout__main {
      //float: left;
      width: 100%;
      //margin-bottom: 30rem;
      height: 70rem;
      position: relative;

      .layout_head {
        font-size: 2.5rem;
        margin-left: 4rem;
        color: var(--color-text);
      }

      .more {
        position: absolute;
        top: 0;
        right: 6rem;
        font-size: 1.4rem;
        text-decoration: none;

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    .detail_layout__mv {
      width: 100%;
      height: 45rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      margin-bottom: 10rem;
      position: relative;

      .title {
        font-size: 2.5rem;
        font-weight: 600;
        color: var(--color-text);
        margin-left: 2rem;
        margin-bottom: 2rem;
        //margin-top: 5rem;
      }

      .more {
        position: absolute;
        top: 2rem;
        right: 4rem;
        font-size: 1.4rem;
        text-decoration: none;

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    .detail_layout__album {
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      position: relative;
      margin-bottom: 4rem;

      .title {
        font-size: 2.5rem;
        font-weight: 600;
        color: var(--color-text);
        margin-left: 2rem;
      }

      .more {
        position: absolute;
        top: 2rem;
        right: 4rem;
        font-size: 1.4rem;
        text-decoration: none;

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    .detail_layout__simiArt {
      width: 100%;
      height: 45rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;

      position: relative;

      .title {
        font-size: 2.5rem;
        font-weight: 600;
        color: var(--color-text);
        margin-left: 2rem;
        margin-bottom: 3rem;
      }
    }
  }

  .more_show {
    width: 79%;
  }
}
</style>
