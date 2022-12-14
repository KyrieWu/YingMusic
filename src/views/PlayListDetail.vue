<template>
  <div class="playlist-container">
    <div class="playlist-main">
      <div class="playlist-img">
        <img :src="playListData.coverImgUrl" alt="" />
      </div>
      <div class="playlist-detail">
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
                <a href="" class="data_info_tags" v-for="(item, index) in playListData.tags" :key="index">{{ item }}</a>
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
        <div class="data_actions">
          <a class="mod_btn_green" @click="playAllSong(trackInfos)">
            <i class="mod_btn_green__icon_play"></i>
            <span>播放全部</span>
          </a>
          <a class="mod_btn" @click="toLikeplaylist">
            <i class="mod_btn__icon_like" ref="mod_btn__icon_like"></i>
            <span>收藏</span>
          </a>
          <a href="" class="mod_btn">
            <i class="mod_btn__icon_commend"></i>
            <span>评论</span>
          </a>
        </div>
      </div>
    </div>
    <div class="detail_layout">
      <div class="detail_layout__main">
        <div class="mod_songlist">
          <ul class="songlist__header">
            <li class="songlist__header_name">歌曲</li>
            <li class="songlist__header_author">歌手</li>
            <li class="songlist__header_album">专辑</li>
            <li class="songlist__header_time">时长</li>
          </ul>
          <ul class="songlist__list">
            <li v-for="(item, index) in trackInfos" :key="item.id">
              <div class="songlist__item songlist__item--even">
                <div class="songlist__number songlist__number--top">
                  {{ index + 1 }}
                </div>
                <div class="songlist__songname">
                  <span class="songlist__songname_txt"><a :title="item.name" @click="toSongDetail(item)">{{
                      item.name
                  }}</a></span>

                  <div class="mod_list_menu">
                    <a class="list_menu__item list_menu__play" title="播放" @click="playSong(item)"><i
                        class="list_menu__icon_play"></i></a><a class="list_menu__item list_menu__add" title="添加到歌单"><i
                        class="list_menu__icon_add"></i></a>
                  </div>
                </div>
                <div class="songlist__artist">
                  <router-link :to="{
                    path: '/artistDetail',
                    query: { id: item.ar[0].id },
                  }" class="playlist__author" :title="item.ar[0].name">{{ item.ar[0].name }}</router-link>
                </div>
                <div class="songlist__album">
                  <router-link :to="{ path: '/altumDetail', query: { id: item.al.id } }" :title="item.al.name">{{
                      item.al.name
                  }}</router-link>
                </div>
                <div class="songlist__time">{{ timestampToTime(item.dt) }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="detail_layout_other">
        <div class="mod_about">
          <h3 class="about_tit">简介</h3>
          <div class="about_cont" :class="{ about_cont_up: isPackUp }" ref="about_cont">
            {{ playListData.description }}
          </div>
          <a class="about_more" v-if="isPackUp" @click="packDown">展开&#8595;</a>
          <a class="pack_up" v-if="!isPackUp" @click="packUp">收起&#8593;</a>
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
import { onBeforeMount, onMounted, ref, watch, onUpdated } from "vue";
import { SongInfo } from "@/types/SongInfo";
import { timestampToTime } from "@/utils/utils";
import { useStore } from "vuex";
import { SquareItemProps } from "@/types/SquareItemProps";
import SquareItemList from "@/components/SquareItemList.vue";
import { onBeforeRouteUpdate } from "vue-router";
import { Songlist } from "@/types/SongList";
import { ReccategoryPlaylistInfo } from "@/types/RecPlayList";

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

const getsongLists = async (id: number) => {
  let res = (await getSongListInfo(id)) as unknown as Songlist;
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
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .playlist-container {
    min-width: 1487px;
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
  margin-top: 64px;

  .playlist-main {
    width: 75%;
    height: 35rem;
    position: relative;
    margin: 0 auto;

    .playlist-img {
      width: 30%;
      height: 78%;
      float: left;
      margin-top: 50px;

      img {
        width: 70%;
        height: 100%;
        margin-left: 50px;
        border-radius: 5%;
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
    width: 75%;
    height: 70rem;
    margin: 0 auto;

    li {
      list-style: none;
    }

    .detail_layout__main {
      float: left;
      width: 70%;
      height: 100%;
      margin-left: 10px;

      .mod_songlist {
        width: 95%;
        height: 100%;

        .songlist__header {
          font-size: 14px;
          position: relative;
          height: 5rem;
          width: 100%;
          display: block;
          line-height: 50px;

          li {
            float: left;
            opacity: 0.7;
            color: var(--color-text);
          }

          .songlist__header_name {
            width: 45%;
            height: 100%;
            display: inline-block;
            padding-left: 45px;
          }

          .songlist__header_author {
            width: 18%;
            height: 100%;
            display: inline-block;
          }

          .songlist__header_album {
            width: 18%;
            height: 100%;
            display: inline-block;
          }

          .songlist__header_time {
            width: 8%;
            height: 100%;
          }
        }

        .songlist__list {
          font-size: 14px;
          height: 50px;
          width: 100%;
          display: block;

          .songlist__item {
            width: 100%;
            height: 5rem;
            position: relative;
            display: block;
            line-height: 50px;
            color: var(--color-text);
            overflow: hidden;
            border-radius: 1rem;

            .songlist__number {
              opacity: 0.7;
              width: 34px;
              height: 100%;
              position: absolute;
              margin-left: 1rem;
            }

            .songlist__songname {
              width: 45%;
              height: 100%;
              font-weight: 500;
              float: left;
              padding-left: 45px;
              position: relative;

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

              .mod_list_menu {
                width: 50%;
                height: 100%;
                margin-left: 200px;
                opacity: 0;
                z-index: 100;
                position: absolute;
                //right: -5rem;

                .list_menu__item {
                  width: 4rem;
                  height: 4rem;
                  background-color: transparent;
                  display: block;
                  position: relative;
                  margin-left: 8rem;
                  margin-top: 5px;
                  float: left;

                  .list_menu__icon_play {
                    background: url("@/assets/icons/播放-blue.png") no-repeat center/cover;
                    width: 4rem;
                    height: 4rem;
                    display: inline-block;

                    &:active {
                      transform: scale(0.95);
                    }
                  }

                  .list_menu__icon_add {
                    background: url("@/assets/icons/添加-blue.png") no-repeat center/cover;
                    width: 4rem;
                    height: 4rem;
                    display: inline-block;

                    &:active {
                      transform: scale(0.95);
                    }
                  }

                  &:hover {
                    transform: scale(1.05);
                  }
                }

                .list_menu__add {
                  margin-left: 10px;
                }
              }
            }

            .songlist__artist {
              width: 18%;
              height: 100%;
              float: left;
              margin-left: -1px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .songlist__album {
              width: 17%;
              height: 100%;
              float: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .songlist__time {
              width: 11%;
              height: 100%;
              float: left;
              opacity: 0.7;
              margin-left: 10px;
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

              .mod_list_menu {
                opacity: 1;
              }
            }
          }
        }
      }
    }

    .detail_layout_other {
      font-size: 14px;
      width: 27%;
      float: left;
      color: var(--color-text);
      line-height: 21px;
      margin-left: 5px;

      .about_cont {
        // height: 80px;
        width: 100%;
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
        display: --webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
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
    width: 75%;
    margin: 0 auto;

    .title {
      font-size: 2rem;
      font-weight: 600;
      color: var(--color-text);
      margin-left: 4rem;
    }
  }
}
</style>
