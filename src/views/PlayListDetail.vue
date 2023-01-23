<template>
  <div class="playlistDetail_container">
    <div class="playlist_main">
      <div class="playlist_img">
        <img :src="getImageUrl(playListData)" alt="" />
      </div>
      <div class="playlist_detail">
        <div class="title">
          <h1>{{ playListData.name }}</h1>
        </div>
        <div class="art">
          <i class="icon_singer"></i>
          <!-- <a href="">{{ playListData.creator.nickname }}</a> -->
        </div>
        <ul class="data_info">
          <li class="data_info_item">
            <div class="data_tag_box">
              标签:&nbsp;
              <span>
                <a
                  href=""
                  class="data_info_tags"
                  v-for="(item, index) in playListData.tags"
                  :key="index"
                  >{{ item }}</a
                >
              </span>
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              播放量:&nbsp; {{ (playListData.playCount / 10000).toFixed(1) }}万
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              收藏量:&nbsp;
              {{ (playListData.subscribedCount / 10000).toFixed(1) }}万
            </div>
          </li>
        </ul>
        <div class="mod_about">
          <h3 class="about_tit">简介:</h3>
          <div class="about_cont">{{ playListData.description }}</div>
        </div>
        <div class="data_actions">
          <a class="mod_btn_green" @click="playAllSong(trackInfos)">
            <i class="mod_btn_green__icon_play"></i>
            <span>播放全部</span>
          </a>
          <a class="mod_btn" @click="toLikeplaylist">
            <i class="mod_btn__icon_like" ref="mod_btn__icon_like"></i>
            <span>收藏</span>
          </a>
        </div>
      </div>
    </div>
    <div class="detail_layout">
      <div class="detail_layout__main">
        <div class="mod_songlist">
          <ul class="songlist__header">
            <li class="songlist__header_empty"></li>
            <li class="songlist__header_name">歌曲</li>
            <li class="songlist__header_author">歌手</li>
            <li class="songlist__header_album">专辑</li>
            <li class="songlist__header_time">时长</li>
          </ul>
          <ul class="songlist__list">
            <li v-for="(item, index) in trackInfos" :key="item.id">
              <div class="songlist__item">
                <div class="songlist__number">
                  {{ index + 1 }}
                </div>
                <div class="songlist__play">
                  <a
                    class="list_menu__item list_menu__play"
                    :title="$t('songItem.play')"
                    @click="playSong(item)"
                  >
                    <i class="list_menu__icon_play"></i>
                  </a>
                </div>
                <div class="songlist__songname">
                  <span class="songlist__songname_txt"
                    ><a :title="item.name" @click="toSongDetail(item)">{{
                      item.name
                    }}</a></span
                  >
                </div>
                <div class="songlist__artist">
                  <router-link
                    :to="{
                      path: '/artistDetail',
                      query: { id: item.ar[0].id },
                    }"
                    class="playlist__author"
                    :title="item.ar[0].name"
                    >{{ item.ar[0].name }}</router-link
                  >
                </div>
                <div class="songlist__album">
                  <router-link
                    :to="{ path: '/altumDetail', query: { id: item.al.id } }"
                    :title="item.al.name"
                    >{{ item.al.name }}</router-link
                  >
                </div>
                <div class="songlist__time">{{ timestampToTime(item.dt) }}</div>
                <div class="songlist__add">
                  <a
                    class="list_menu__item list_menu__add"
                    :title="$t('songItem.add')"
                    @click="addToPlaylist(item)"
                  >
                    <i class="list_menu__icon_add"></i>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="related_playlist">
      <div class="title">相关歌单：</div>
      <square-item-list :square-items="squareItems"></square-item-list>
    </div>
  </div>
</template>

<script lang="ts">
name: "PlayListDetail";
</script>
<script setup lang="ts">
import { getSongListInfo, getRelatedPlayList } from "@/api/PlayList";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { timestampToTime } from "@/utils/utils";
import { useStore } from "vuex";
import SquareItemList from "@/components/SquareItemList.vue";
import { onBeforeRouteUpdate } from "vue-router";
import NProgress from "nprogress";

interface relatedPlaylist {
  code: 200;
  playlists: playlistsdata[];
}

interface playlistsdata {
  coverImgUrl: string;
  creator: creator;
  id: string;
  name: string;
}

interface creator {
  userId: string;
  nickname: string;
}

const store = useStore();

const route = useRoute();
const router = useRouter();

let playListData = ref({} as ReccategoryPlaylistInfo);
let trackInfos = ref<SongInfo[]>([]);
let laylists = ref<playlistsdata[]>([]);

let about_cont = ref();
let isPackUp = ref(true);

let squareItems = ref<SquareItemProps[]>([]);

let mod_btn__icon_like = ref();
let playlistlikestatus = ref(1);

const packDown = () => {
  isPackUp.value = false;
  about_cont.value.style.overflow = "auto";
};

const packUp = () => {
  isPackUp.value = true;
  about_cont.value.style.overflow = "hidden";
};

const playSong = (item: SongInfo): void => {
  store.commit("PLAYSONG", item);
};

const playAllSong = (songs: SongInfo[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

const addToPlaylist = (song: SongInfo) => {
  store.commit("ADDTOPLAYLIST", song);
};

const getsongLists = async (id: number) => {
  let res = (await getSongListInfo(id)) as unknown as Songlist;
  NProgress.done();
  playListData.value = res.playlist;
  trackInfos.value = [];
  playListData.value.tracks.slice(0, 10).forEach((item: SongInfo) => {
    trackInfos.value.push(item);
  });
};

const getrelatedPlayLists = async (id: number) => {
  let res = (await getRelatedPlayList(id)) as unknown as relatedPlaylist;
  laylists.value = res.playlists;
  squareItems.value = [];
  laylists.value.slice(0, 5).forEach((item: any) => {
    squareItems.value.push(
      Object.freeze({
        id: item.id,
        name: item.name,
        picUrl: item.coverImgUrl,
        routerPath: "/songlistDetail",
      })
    );
  });
};

onMounted(() => {
  NProgress.start();
  getsongLists(Number(route.query.id));
  getrelatedPlayLists(Number(route.query.id));

  let isLikeplaylist = store.state.likePlaylist?.filter(
    (item: any) => item.id == route.query.id
  );
  if (isLikeplaylist.length > 0) {
    playlistlikestatus.value = 2;
    mod_btn__icon_like.value.style.background =
      "url('已收藏.png') no-repeat center/cover";
  } else {
    playlistlikestatus.value = 1;
    mod_btn__icon_like.value.style.background =
      "url('收藏.png') no-repeat center/cover";
  }
});

onBeforeRouteUpdate((to, from) => {
  if (to.query.id !== from.query.id) {
    NProgress.start();
    getsongLists(Number(to.query.id));
    getrelatedPlayLists(Number(to.query.id));

    let isLikeplaylist = store.state.likePlaylist?.filter(
      (item: any) => item.id == to.query.id
    );
    if (isLikeplaylist.length > 0) {
      playlistlikestatus.value = 2;
      mod_btn__icon_like.value.style.background =
        "url('已收藏.png') no-repeat center/cover";
    } else {
      playlistlikestatus.value = 1;
      mod_btn__icon_like.value.style.background =
        "url('收藏.png') no-repeat center/cover";
    }
  }
});

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

const toLikeplaylist = async () => {
  let res = await store.dispatch("LikePlaylist", {
    t: Number(playlistlikestatus.value),
    listid: Number(route.query.id),
  });
  if (res == 200) {
    if (playlistlikestatus.value == 1) {
      playlistlikestatus.value = 2;
      mod_btn__icon_like.value.style.background =
        "url('已收藏.png') no-repeat center/cover";
    } else {
      playlistlikestatus.value = 1;
      mod_btn__icon_like.value.style.background =
        "url('收藏.png') no-repeat center/cover";
    }
  }
};

const getImageUrl = (item: any) => {
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace("http://", "https://")}?param=512y512`;
};
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .playlistDetail_container {
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

.playlistDetail_container {
  margin-top: 64px;

  padding: {
    top: 2rem;
    left: 10vw;
    right: 10vw;
    bottom: 10rem;
  }

  .playlist_main {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;

    .playlist_img {
      margin-top: 18px;

      img {
        width: 30rem;
        height: 30rem;
        display: block;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 16px -8px;
        border-radius: 5%;
        object-fit: cover;
      }
    }

    .playlist_detail {
      //padding-top: 28px;
      margin-left: 3rem;

      .title {
        margin-left: 1rem;
        font-size: 2rem;
        line-height: 2rem;
        color: var(--color-text);

        font-weight: 600;
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
          height: 5rem;
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
        margin-top: 3rem;

        .mod_btn_green {
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
            background: url("@/assets/icons/收藏.png") no-repeat center/cover;
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
            width: 39%;
            height: 100%;
            display: inline-block;
          }

          .songlist__header_author {
            width: 18%;
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
              width: 39%;
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

            .songlist__artist {
              width: 18%;
              height: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
