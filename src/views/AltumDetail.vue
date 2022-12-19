<template>
  <div class="playlist-container">
    <div class="playlist-main">
      <div class="playlist-img">
        <img :src="albumInfo.picUrl" alt="" />
      </div>
      <div class="playlist-detail">
        <div class="title">
          <h1>{{ albumInfo.name }}</h1>
        </div>
        <ul class="data_info">
          <li class="data_info_item">
            <div class="data_tag_box">
              歌手:&nbsp;
              <span>
                <router-link :to="{
                  path: '/artistDetail',
                  query: { id: albumInfo.artist?.id },
                }" class="data_info_tags" :title="albumInfo.artist?.name" href="">{{ albumInfo.artist?.name }}
                </router-link>
              </span>
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              发行时间:&nbsp; {{ timestampToDate(albumInfo.publishTime) }}
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              发行公司:&nbsp;
              {{ albumInfo.company }}
            </div>
          </li>
        </ul>
        <div class="data_actions">
          <a class="mod_btn_green" @click="playAllSong(trackInfos)">
            <i class="mod_btn_green__icon_play"></i>
            <span>播放全部</span>
          </a>
          <a class="mod_btn" @click="likeAlbum">
            <i class="mod_btn__icon_like" ref="like_icon"></i>
            <span>收藏</span>
          </a>
          <a class="mod_btn">
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
                        class="list_menu__icon_play"></i></a>
                    <a class="list_menu__item list_menu__add" title="添加到歌单" @click="addToPlaylist(item)"><i
                        class="list_menu__icon_add" ref="list_menu__icon_add"></i></a>
                  </div>
                </div>
                <div class="songlist__artist">
                  <router-link :to="{
                    path: '/artistDetail',
                    query: { id: item.ar[0].id },
                  }" class="playlist__author" :title="item.ar[0].name" href="">{{ item.ar[0].name }}</router-link>
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
            {{ albumInfo.description }}
          </div>
          <a class="about_more" v-if="isPackUp" @click="packDown">展开&#8595;</a>
          <a class="pack_up" v-if="!isPackUp" @click="packUp">收起&#8593;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "AltumDetail";
</script>
<script setup lang="ts">
import { getAltumDetail } from "@/api/altum";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, ref, reactive, toRefs } from "vue";
import { timestampToTime, timestampToDate } from "@/utils/utils";
import { useStore } from "vuex";


interface AltumDetailResult {
  album: AlbumInfo;
  code: number;
  resourceState: boolean;
  songs: SongInfo[];
}

const store = useStore();

const route = useRoute();
const router = useRouter();

const data = reactive({
  albumInfo: {} as AlbumInfo,
  trackInfos: [] as SongInfo[],
  isPackUp: true,
  likeAlbumStatus: 1,
});

let about_cont = ref();

let like_icon = ref();
let list_menu__icon_add = ref();

const packDown = () => {
  data.isPackUp = false;
  about_cont.value.style.overflow = "auto";
};

const packUp = () => {
  data.isPackUp = true;
  about_cont.value.style.overflow = "hidden";
};

const playSong = (item: SongInfo): void => {
  store.commit("PLAYSONG", item);
};

const playAllSong = (songs: SongInfo[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

onBeforeMount(async () => {
  let res = (await getAltumDetail(
    route.query.id
  )) as unknown as AltumDetailResult;
  data.albumInfo = res.album;
  data.trackInfos = res.songs;

  let isLikeAlbum = store.state.likeAlbumlist?.filter(
    (item: any) => item.id == route.query.id
  );

  if (isLikeAlbum.length > 0) {
    data.likeAlbumStatus = 2;
    like_icon.value.style.background =
      "url('已收藏.png') no-repeat center/cover";
  } else {
    data.likeAlbumStatus = 1;
    like_icon.value.style.background = "url('收藏.png') no-repeat center/cover";
  }
});

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

const likeAlbum = async () => {
  let res = await store.dispatch("LikeAlbum", {
    albumid: Number(route.query.id),
    t: data.likeAlbumStatus,
  });
  if (res == 200) {
    if (data.likeAlbumStatus == 1) {
      data.likeAlbumStatus = 2;
      like_icon.value.style.background =
        "url('已收藏.png') no-repeat center/cover";
    } else {
      data.likeAlbumStatus = 1;
      like_icon.value.style.background =
        "url('收藏.png') no-repeat center/cover";
    }
  }
};

const addToPlaylist = (song: SongInfo) => {
  store.commit("ADDTOPLAYLIST", song);
};
const { albumInfo, trackInfos, isPackUp } = toRefs(data);
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
    width: 68%;
    height: 35rem;
    position: relative;
    margin: 0 auto;

    .playlist-img {
      width: 30%;
      height: 71.5%;
      float: left;
      margin-top: 50px;

      img {
        width: 65%;
        height: 100%;
        margin-left: 50px;
        border-radius: 10%;
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
    width: 68%;
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
            padding-left: 5rem;
          }

          .songlist__header_author {
            width: 30%;
            height: 100%;
            display: inline-block;
          }

          .songlist__header_time {
            width: 18%;
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

                .list_menu__item {
                  width: 4rem;
                  height: 4rem;
                  display: block;
                  position: relative;
                  margin-left: 5rem;
                  padding-top: 5px;
                  background-color: transparent;
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
              width: 30%;
              height: 100%;
              float: left;
              margin-left: -1px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .songlist__time {
              width: 1%;
              height: 100%;
              float: left;
              opacity: 0.7;
              margin-left: 0.5rem;
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
}
</style>
