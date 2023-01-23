<template>
  <div class="artistDetail_container">
    <div class="artist_main">
      <div class="artist_img">
        <router-link
          :to="{ path: '/artistDetail', query: { id: route.query.id } }"
        >
          <img
            :src="playListData.artist && getImageUrl(playListData.artist)"
            alt=""
          />
        </router-link>
      </div>
      <div class="artist_detail">
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
            <i
              class="mod_btn__icon_attention"
              ref="mod_btn__icon_attention"
            ></i>
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
        <router-link
          :to="{
            path: '/artistDetail/artistSongs',
            query: { id: route.query.id },
          }"
          class="more"
          >查看全部</router-link
        >
        <div class="mod_songlist">
          <ul class="songlist__header">
            <li class="songlist__header_empty"></li>
            <li class="songlist__header_name">歌名</li>
            <li class="songlist__header_album">专辑</li>
            <li class="songlist__header_time">时间</li>
          </ul>
          <ul class="songlist__list">
            <li v-for="(item, index) in hotSongDetail" :key="item.id">
              <div class="songlist__item">
                <div class="songlist__number">{{ index + 1 }}</div>
                <div class="songlist__play">
                  <a class="list_menu__item list_menu__play" title="play">
                    <i class="list_menu__icon_play"></i>
                  </a>
                </div>
                <div class="songlist__songname">
                  <span class="songlist__songname_txt">{{ item.name }}</span>
                </div>

                <div class="songlist__album">
                  <router-link to="/albumDetail" :title="item.al.name">
                    {{ item.al.name }}
                  </router-link>
                </div>
                <div class="songlist__time">{{ timestampToTime(item.dt) }}</div>
                <div class="songlist__add">
                  <a class="list_menu__item list_menu__add" title="add">
                    <i class="list_menu__icon_add"></i>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="related_playlist" v-if="mvList.length !== 0">
      <div class="title">MVs:</div>
      <router-link
        :to="{
          path: '/artistDetail/artistMVs',
          query: { id: route.query.id },
        }"
        class="more"
        >查看全部</router-link
      >
      <m-v-item :mv-list="mvList"></m-v-item>
    </div>
    <div class="related_playlist" v-if="squareItems.length !== 0">
      <div class="title">专辑:</div>
      <router-link
        :to="{
          path: '/artistDetail/artistAlbums',
          query: { id: route.query.id },
        }"
        class="more"
        >查看全部</router-link
      >
      <square-item-list :square-items="squareItems"></square-item-list>
    </div>
    <div class="related_playlist" v-if="simiartistsInfos.length !== 0">
      <div class="title">相似歌手:</div>
      <aritst-item :artists-infos="simiartistsInfos"></aritst-item>
    </div>
    <div
      class="more_show"
      v-if="
        route.path == '/artistDetail/artistMVs' ||
        route.path == '/artistDetail/artistAlbums' ||
        route.path == '/artistDetail/artistSongs'
      "
    >
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
import AritstItem from "@/components/RoundItem.vue";
import { timestampToTime } from "@/utils/utils";

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

const getImageUrl = (item: any) => {
  if (item.img1v1Url) {
    let img1v1ID = item.img1v1Url.split("/");
    img1v1ID = img1v1ID[img1v1ID.length - 1];
    if (img1v1ID === "5639395138885805.jpg") {
      // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
      return "https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512";
    }
  }
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl || item.cover;
  return `${img?.replace("http://", "https://")}?param=512y512`;
};
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .artistDetail_container {
    min-width: 1492px;
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

.artistDetail_container {
  margin-top: 64px;

  padding: {
    top: 2rem;
    left: 10vw;
    right: 10vw;
    bottom: 10rem;
  }

  .artist_main {
    height: 35rem;
    position: relative;
    display: flex;
    flex-direction: row;

    .artist_img {
      margin-top: 18px;

      img {
        height: 300px;
        width: 300px;
        border-radius: 50%;
        // margin-right: 56px;
        display: block;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 16px -8px;
        object-fit: cover;
      }
    }

    .artist_detail {
      padding-top: 28px;
      margin-left: 3rem;

      .title {
        margin-left: 0.8rem;
        font-size: 4rem;
        color: var(--color-text);
        margin-bottom: 2rem;
        font-weight: 600;
        line-height: 4rem;
      }

      .art {
        font-size: 18px;
        color: var(--color-text);
        //margin-bottom: 3rem;

        .icon_singer {
          display: block;
          width: 18px;
          height: 18px;
          background: url(@/assets/icons/作者.png) no-repeat center/cover;
          float: left;
          //margin-top: 3px;
          margin-left: 10px;
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
        margin-left: 10px;
        margin-bottom: 10px;
        color: var(--color-text);

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

      .mod_about {
        margin-top: 2rem;
        margin-left: 10px;
        color: var(--color-text);

        .about_tit {
          font-size: 1.6rem;
          font-weight: 600;
        }

        .about_cont {
          height: 4.2rem;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          font-size: 14px;
          opacity: 0.68;
          margin-top: 10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          cursor: pointer;
          white-space: pre-line;
        }
      }

      .data_actions {
        font-size: 14px;
        margin-left: 10px;
        margin-top: 4rem;

        .mod_btn_blue {
          border-radius: 0.8rem;
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
          border-radius: 0.8rem;
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

          .mod_btn__icon_like {
            background: url("@/assets/icons/加关注\(人\).png") no-repeat
              center/cover;
            float: left;
            width: 25px;
            height: 25px;
            margin-top: 5px;
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
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 3rem;

    li {
      list-style: none;
    }

    .detail_layout__main {
      //float: left;
      width: 100%;

      .mod_songlist {
        width: 100%;
        height: 100%;

        .songlist__header {
          font-size: 1.4rem;
          display: flex;
          flex-direction: row;
          height: 5rem;
          width: 100%;
          line-height: 50px;
          color: var(--color-text);

          .songlist__header_empty {
            width: 6%;
            height: 100%;
            margin-left: 1rem;
          }
          .songlist__header_name {
            width: 57%;
            height: 100%;
            display: inline-block;
          }

          .songlist__header_album {
            width: 17%;
            height: 100%;
            display: inline-block;
          }

          .songlist__header_time {
            width: 15%;
            height: 100%;
            text-align: end;
          }
        }

        .songlist__list {
          font-size: 1.4rem;
          width: 100%;
          display: block;

          .songlist__item {
            width: 100%;
            height: 5rem;
            position: relative;
            display: flex;
            line-height: 50px;
            color: var(--color-text);
            overflow: hidden;
            border-radius: 1rem;

            .songlist__number {
              opacity: 0.7;
              width: 1%;
              height: 100%;
              margin-left: 1rem;
            }
            .songlist__play {
              width: 5%;
              height: 100%;
              opacity: 0;

              .list_menu__item {
                width: 4rem;
                height: 4rem;
                background-color: transparent;
                display: block;

                .list_menu__icon_play {
                  background: url("@/assets/icons/播放-blue.png") no-repeat
                    center/cover;
                  width: 4rem;
                  height: 4rem;
                  display: inline-block;
                  margin-top: 0.5rem;
                  margin-left: 1.5rem;

                  &:active {
                    transform: scale(0.95);
                  }
                }

                &:hover {
                  transform: scale(1.05);
                }
              }
            }

            .songlist__songname {
              width: 57%;
              height: 100%;
              position: relative;
              font-size: 1.8rem;
              font-weight: 600;
              user-select: none;

              .songlist__songname_txt {
                max-width: 72%;
                box-sizing: border-box;
                float: left;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 56%;
                margin-right: 8px;
                white-space: nowrap;
                font-size: 14px;
                display: block;
              }
            }

            .songlist__album {
              width: 17%;
              height: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .songlist__time {
              width: 15%;
              height: 100%;
              opacity: 0.7;
              text-align: end;
            }

            .songlist__add {
              width: 4%;
              height: 100%;
              opacity: 0;

              .list_menu__item {
                width: 4rem;
                height: 4rem;
                background-color: transparent;
                display: block;
                position: relative;

                .list_menu__icon_add {
                  background: url("@/assets/icons/添加-blue.png") no-repeat
                    center/cover;
                  width: 4rem;
                  height: 4rem;
                  display: inline-block;
                  margin-top: 0.5rem;
                  margin-left: 1rem;

                  &:active {
                    transform: scale(0.95);
                  }
                }

                &:hover {
                  transform: scale(1.05);
                }
              }
            }
            a {
              color: var(--color-text);

              &:hover {
                color: var(--color-primary);
                text-decoration: none;
              }
            }

            &:hover {
              background-color: var(--color-secondary-bg-for-transparent);

              .songlist__add,
              .songlist__play {
                opacity: 1;
              }
            }
          }
        }
      }
    }

    .detail_layout_other {
      font-size: 14px;
      width: 25%;
      //float: left;
      color: var(--color-text);
      line-height: 21px;
      margin-left: 5px;

      .about_cont {
        height: 80px;
        width: 100%;
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
        display: --webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }

      .about_cont_up {
        height: 80px;
      }

      .about_more {
        display: block;
        margin-top: 15px;

        &:hover {
          color: var(--color-primary);
          text-decoration: none;
        }
      }

      .pack_up {
        display: block;
        margin-top: 15px;

        &:hover {
          color: var(--color-primary);
          text-decoration: none;
        }
      }
    }
  }

  .related_playlist {
    width: 100%;
    margin-top: 5rem;

    .title {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--color-text);
      margin-left: 1rem;
      margin-bottom: 2.5rem;
    }
  }
}
</style>
