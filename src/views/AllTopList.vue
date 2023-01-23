<template>
  <div class="topList_container">
    <div class="left">
      <div class="left_content">
        <h2>云音乐特色榜</h2>
        <ul class="left_ul">
          <li
            class="left_item"
            v-for="item in cateToplist.slice(0, 4)"
            :key="item.id"
            @click="toplistInfo = item"
            :class="{ active: toplistInfo == item }"
          >
            <div class="item_left">
              <img :src="getImageUrl(item)" :alt="item.name" loading="lazy" />
            </div>
            <div class="item_right">
              <p class="name">{{ item.name }}</p>
              <p class="update">{{ item.updateFrequency }}</p>
            </div>
          </li>
        </ul>
        <h2>全球媒体榜</h2>
        <ul class="left_ul">
          <li
            class="left_item"
            v-for="item in cateToplist.slice(4)"
            :key="item.id"
            @click="toplistInfo = item"
            :class="{ active: toplistInfo == item }"
          >
            <div class="item_left">
              <img :src="getImageUrl(item)" :alt="item.name" loading="lazy" />
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
      <div class="playlist_main">
        <div class="playlist_img">
          <img
            :src="toplistInfo && getBigImgUrl(toplistInfo)"
            :alt="toplistInfo?.name"
          />
        </div>
        <div class="playlist_detail">
          <div class="title">
            <h1>{{ toplistInfo?.name }}</h1>
          </div>
          <ul class="data_info">
            <li class="data_info_item">
              <div class="data_tag_box" style="color: var(--color-text)">
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
          </div>
        </div>
      </div>
      <div class="detail_layout">
        <div class="detail_layout__main">
          <div class="mod_songlist">
            <ul class="songlist__header">
              <li class="songlist__header_empty"></li>
              <li class="songlist__header_empty"></li>
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
                  <div class="songlist_play">
                    <a
                      class="list_menu__item styles.list_menu__play"
                      title="play"
                    >
                      <i class="list_menu__icon_play"></i>
                    </a>
                  </div>
                  <div class="songlist__songname">
                    <img
                      class="song_icon"
                      :src="getImageUrl(item.al)"
                      loading="lazy"
                    />
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
                  <div class="songlist__time">
                    {{ timestampToTime(item.dt) }}
                  </div>
                  <div class="songlist_add">
                    <a
                      class="list_menu__item list_menu__add"
                      title="add to playlist"
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
import lazy from "@/utils/lazy";

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
  trackInfos.value?.forEach((item) => {
    store.commit("ADDTOPLAYLIST", item);
  });
};

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
    50
  )) as unknown as SongData;
  trackInfos.value = trackLists.songs;
};

const getImageUrl = (item: any) => {
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace("http://", "https://")}?param=120y120`;
};
const getBigImgUrl = (item: any) => {
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace("http://", "https://")}?param=512y512`;
};

onBeforeMount(async () => {
  let topLists = (await getTopList()) as unknown as TopListData;
  cateToplist.value = topLists.list;
  toplistInfo.value = topLists.list[0];
});
</script>

<style scoped lang="scss">
.topList_container {
  margin-top: 138px;
  padding: {
    top: 1rem;
    left: 10vw;
    right: 10vw;
    bottom: 10rem;
  }

  display: flex;

  .left {
    width: 21%;
    border: 1px solid var(--color-secondary-bg-for-transparent);
    position: static;

    .left_content {
      width: 100%;
      padding-top: 2rem;
      color: var(--color-text);

      .left_title {
        // display: inline-block;
        margin-left: 2rem;
        font-size: 1.6rem;
        line-height: 1.6rem;
        //color: var(--color-text);
        margin: {
          top: 5px;
          bottom: 5px;
        }
      }

      .left_ul {
        list-style: none;
        width: 100%;
        padding-left: 0;

        .left_item {
          width: 100%;
          height: 7rem;
          cursor: pointer;
          display: flex;

          .item_left {
            width: 6rem;
            height: 6rem;
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
            //padding-top: 1.5rem;

            .name {
              width: 100%;
              font-size: 1.4rem;
              line-height: 1.4rem;
              font-weight: 600;
              overflow: hidden;
              display: block;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 2px;
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
    margin-bottom: 5rem;

    .playlist_main {
      width: 100%;
      display: flex;
      flex-direction: row;
      padding: {
        left: 5rem;
        right: 5rem;
      }

      .playlist_img {
        margin-top: 30px;

        img {
          width: 25rem;
          height: 25rem;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 16px -8px;
          border-radius: 5%;
          object-fit: cover;
        }
      }

      .playlist_detail {
        margin-top: 30px;
        margin-left: 3rem;

        .title {
          font-size: 3rem;
          color: var(--color-text);
          line-height: 3rem;
          font-weight: 600;
        }

        .data_info {
          list-style: none;
          padding: 0;
          font-size: 14px;
          display: block;

          .data_info_item {
            margin-bottom: 1rem;
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
          font-size: 14px;
          margin-top: 9rem;
          display: flex;
          flex-direction: row;

          .mod_btn_green {
            border-radius: 0.8rem;
            font-size: 14px;
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
      margin-top: 3rem;

      li {
        list-style: none;
      }

      .detail_layout__main {
        float: left;
        width: 100%;
        height: 100%;
        margin-left: 10px;

        .mod_songlist {
          width: 100%;
          height: 100%;

          .songlist__header {
            font-size: 14px;
            height: 5rem;
            width: 100%;
            display: flex;
            line-height: 50px;
            opacity: 0.7;
            color: var(--color-text);

            .songlist__header_empty {
              width: 2.5%;
              height: 100%;
              margin-left: 1rem;
            }

            .songlist__header_name {
              width: 51%;
              height: 100%;
              text-indent: 1.5rem;
            }

            .songlist__header_author {
              width: 20%;
              height: 100%;
            }

            .songlist__header_time {
              width: 15%;
              height: 100%;
              text-align: center;
            }
          }

          .songlist__list {
            font-size: 14px;
            width: 100%;
            display: flex;
            flex-direction: column;
            color: var(--color-text);

            .songlist__item {
              width: 100%;
              height: 7rem;
              position: relative;
              display: flex;
              color: var(--color-text);
              border-radius: 1rem;
              overflow: hidden;

              .songlist__number {
                opacity: 0.7;
                width: 1%;
                height: 100%;
                line-height: 7rem;
                margin-left: 1rem;
              }

              .songlist_play {
                width: 5%;
                height: 100%;
                line-height: 5rem;
                opacity: 0;

                .list_menu__item {
                  background-color: transparent;
                  display: block;
                  position: relative;

                  .list_menu__icon_play {
                    background: url("@/assets/icons/播放-blue.png") no-repeat
                      center/cover;
                    width: 4rem;
                    height: 4rem;
                    display: inline-block;
                    margin-left: 0.5rem;
                    margin-top: 1.5rem;

                    &:active {
                      transform: scale(0.95);
                    }
                  }
                  &:hover {
                    transform: scale(1.03);
                  }
                }
              }

              .songlist__songname {
                width: 51%;
                height: 100%;
                display: flex;
                font-size: 1.6rem;
                font-weight: 600;
                user-select: none;

                .song_icon {
                  width: 6rem;
                  height: 6rem;
                  margin-right: 1.5rem;
                  border-radius: 5px;
                  object-fit: cover;
                  margin-top: 0.5rem;
                }

                .songlist__songname_txt {
                  height: 100%;
                  box-sizing: border-box;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin-right: 8px;
                  white-space: nowrap;
                  display: block;
                  line-height: 7rem;
                }
              }

              .songlist__artist {
                width: 20%;
                height: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 7rem;
              }

              .songlist__time {
                width: 15%;
                height: 100%;
                text-align: center;
                line-height: 7rem;
              }
              .songlist_add {
                width: 5%;
                height: 100%;
                line-height: 7rem;
                opacity: 0;
                .list_menu__item {
                  background-color: transparent;
                  display: block;
                  .list_menu__icon_add {
                    background: url("@/assets/icons/添加-blue.png") no-repeat
                      center/cover;
                    width: 4rem;
                    height: 4rem;
                    display: inline-block;
                    margin-top: 1.5rem;

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

                .songlist_add,
                .songlist_play {
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

@media (max-width: 1336px) {
  .topList_container {
    padding: 0 5vw;
  }
}

@media (max-width: 1500px) {
  .topList_container {
    min-width: 1492px;
  }
}
</style>
