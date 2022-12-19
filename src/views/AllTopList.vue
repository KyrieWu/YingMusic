<template>
  <div class="topList-container">
    <div class="left">
      <div class="left_content">
        <h2>云音乐特色榜</h2>
        <ul class="left_ul">
          <li class="left_item" v-for="item in cateToplist.slice(0, 4)" :key="item.id" @click="toplistInfo = item"
            :class="{ active: toplistInfo == item }">
            <div class="item_left">
              <img :src="item.coverImgUrl" :alt="item.name" />
            </div>
            <div class="item_right">
              <p class="name">{{ item.name }}</p>
              <p class="update">{{ item.updateFrequency }}</p>
            </div>
          </li>
        </ul>
        <h2>全球媒体榜</h2>
        <ul class="left_ul">
          <li class="left_item" v-for="item in cateToplist.slice(4)" :key="item.id" @click="toplistInfo = item"
            :class="{ active: toplistInfo == item }">
            <div class="item_left">
              <img v-lazy="item.coverImgUrl" :alt="item.name" />
            </div>
            <div class="item_right">
              <p class="name">{{ item.name }}</p>
              <p class="update">{{ item.updateFrequency }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="playlist-main">
        <div class="playlist-img">
          <img :src="toplistInfo?.coverImgUrl" :alt="toplistInfo?.name" />
        </div>
        <div class="playlist-detail">
          <div class="title">
            <h1>{{ toplistInfo?.name }}</h1>
          </div>
          <ul class="data_info">
            <li class="data_info_item">
              <div class="data_tag_box">
                最近更新:&nbsp;
                {{ timestampToDate(toplistInfo?.updateTime) }}&nbsp;({{
                    toplistInfo?.updateFrequency
                }})
              </div>
            </li>
          </ul>
          <div class="data_actions">
            <a class="mod_btn_green" @click="playAllSong(trackInfos)">
              <i class="mod_btn_green__icon_play"></i>
              <span>播放全部</span>
            </a>
            <a class="mod_btn" @click="addToPlaylist">
              <i class="mod_btn__icon_like"></i>
              <span>添加到歌单</span>
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
                  <div class="songlist__number">
                    {{ index + 1 }}
                  </div>
                  <div class="songlist__songname">
                    <img class="song_icon" v-lazy="item.al.picUrl" />
                    <span class="songlist__songname_txt"><a :title="item.name" @click="toSongDetail(item)">{{
                        item.name
                    }}</a></span>

                    <div class="mod_list_menu">
                      <a class="list_menu__item list_menu__play" title="播放" @click="playSong(item)"><i
                          class="list_menu__icon_play"></i></a>
                      <a class="list_menu__item list_menu__add" title="添加到歌单"> <i class="list_menu__icon_add"></i></a>
                    </div>
                  </div>
                  <div class="songlist__artist">
                    <router-link :to="{
                      path: '/artistDetail',
                      query: { id: item.ar[0].id },
                    }" class="playlist__author" :title="item.ar[0].name">{{ item.ar[0].name }}</router-link>
                  </div>
                  <div class="songlist__time">
                    {{ timestampToTime(item.dt) }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "AllTopList";
</script>
<script setup lang="ts">
import { getTopList, getPlayListTrack } from "../api/home";
import { onBeforeMount, ref, watch } from "vue";
import { timestampToDate, timestampToTime } from "@/utils/utils";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
let cateToplist = ref<TopListInfo[]>([]);
let toplistInfo = ref<TopListInfo>();
let trackInfos = ref<SongInfo[]>([]);
let backColor = ref("rgba(0,0,0,.01)");

const playSong = (item: SongInfo): void => {
  store.commit("PLAYSONG", item);
};

const playAllSong = (songs: SongInfo[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

const addToPlaylist = () => {
  trackInfos.value?.forEach(item => {
    store.commit('ADDTOPLAYLIST', item)
  })
}

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

watch(
  () => toplistInfo.value,
  () => {
    getTracks();
  }
);

const getTracks = async () => {
  let trackLists = (await getPlayListTrack(
    Number(toplistInfo.value?.id),
    30
  )) as unknown as SongData;
  trackInfos.value = trackLists.songs;
};

onBeforeMount(async () => {
  let topLists = (await getTopList()) as unknown as TopListData;
  cateToplist.value = topLists.list;
  toplistInfo.value = topLists.list[0];
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .topList-container {
    min-width: 1487px;
  }
}

.topList-container {
  margin-top: 138px;

  padding: {
    right: 20vw;
    left: 20vw;
  }

  display: flex;

  .left {
    width: 21%;
    border: 1px solid var(--color-secondary-bg-for-transparent);
    position: static;

    .left_content {
      width: 100%;
      padding-top: 4rem;

      h2 {
        // display: inline-block;
        margin-left: 2rem;
        color: var(--color-text);
      }

      .left_ul {
        list-style: none;
        width: 100%;
        padding-left: 0;

        .left_item {
          width: 100%;
          height: 6rem;
          cursor: pointer;
          display: flex;

          .item_left {
            width: 5rem;
            height: 5rem;
            margin: 0.5rem 1rem 0 2rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 0.5rem;
              object-fit: cover;
            }
          }

          .item_right {
            width: calc(100% - 8rem);
            height: 100%;

            overflow: hidden;

            .name {
              width: 100%;
              font-size: 1.2rem;
              line-height: 1.2rem;
              font-weight: 600;
              overflow: hidden;
              display: block;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .update {
              font-size: 1.2rem;
              line-height: 1.2rem;
              opacity: 0.7;
            }
          }

          &:hover {
            background-color: var(--color-primary-bg);

            .name {
              color: var(--color-primary);
            }
          }
        }

        .active {
          background-color: var(--color-primary-bg);

          .name {
            color: var(--color-primary);
          }
        }
      }
    }
  }

  .right {
    width: 79%;

    .playlist-main {
      width: 100%;
      height: 25rem;
      position: relative;
      margin: 0 auto;

      .playlist-img {
        width: 30%;
        height: 70%;
        float: left;
        margin-top: 50px;

        img {
          width: 68%;
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
              background: url("@/assets/icons/添加.png") no-repeat center/cover;
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
      margin: 0 auto;
      width: 100%;

      li {
        list-style: none;
      }

      .detail_layout__main {
        float: left;
        width: 100%;
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
              height: 7rem;
              position: relative;
              display: block;
              color: var(--color-text);
              border-radius: 1rem;
              overflow: hidden;

              .songlist__number {
                opacity: 0.7;
                width: 34px;
                height: 100%;
                position: absolute;
                line-height: 7rem;
                margin-left: 1rem;
              }

              .songlist__songname {
                width: 45%;
                height: 100%;
                font-weight: 500;
                float: left;
                padding-left: 45px;
                position: relative;

                .song_icon {
                  width: 6rem;
                  height: 6rem;
                  float: left;
                  margin-right: 1.5rem;
                  border-radius: 5px;
                  object-fit: cover;
                  margin-top: 0.5rem;
                }

                .songlist__songname_txt {
                  max-width: 40%;
                  height: 100%;
                  box-sizing: border-box;
                  float: left;
                  overflow: hidden;
                  text-overflow: ellipsis;

                  margin-right: 8px;
                  white-space: nowrap;
                  font-size: 14px;
                  display: block;
                  line-height: 7rem;
                }

                .mod_list_menu {
                  width: 50%;
                  height: 100%;
                  margin-left: 200px;
                  opacity: 0;
                  position: absolute;
                  top: 1.3rem;
                  right: 0;
                  z-index: 10;

                  .list_menu__item {
                    width: 4rem;
                    height: 4rem;
                    background-color: transparent;
                    display: block;
                    position: relative;
                    margin-left: 10rem;
                    padding-top: 2.5px;
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
                line-height: 7rem;
              }

              .songlist__time {
                width: 1%;
                height: 100%;
                float: left;
                opacity: 0.7;
                margin-left: 0.5rem;
                line-height: 7rem;
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
}
</style>
