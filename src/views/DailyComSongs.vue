<template>
  <div class="playlist-container">
    <div class="playlist-main">
      <div class="playlist-date">
        <div class="date_content">
          <div class="week">星期{{ getWeek() }}</div>
          <div class="day">{{ getDay() }}</div>
        </div>

      </div>
      <div class="playlist-detail">
        <div class="title">
          <h1>每日歌曲推荐</h1>
        </div>
        <div class="descript">
          <h3>根据你的音乐口味生成,每天6:00更新</h3>
        </div>

        <!-- <ul class="data_info">
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
        </ul> -->
        <div class="data_actions">
          <a class="mod_btn_green" @click="playAllSong(trackInfos)">
            <i class="mod_btn_green__icon_play"></i>
            <span>播放全部</span>
          </a>
          <!-- <a class="mod_btn">
            <i class="mod_btn__icon_like" ref="mod_btn__icon_like"></i>
            <span>收藏</span>
          </a> -->
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
    </div>
  </div>
</template>

<script lang="ts">
name: "PlayListDetail";
</script>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, onMounted, ref, watch, onUpdated, computed } from "vue";
import { SongInfo } from "@/types/SongInfo";
import { timestampToTime } from "@/utils/utils";
import { useStore } from "vuex";

const store = useStore();

const route = useRoute();
const router = useRouter();
const weekArr: string[] = ['日', '一', '二', '三', '四', '五', '六']

let backColor = ref("rgba(0,0,0,.01)");
let none = ref("none");

const playSong = (item: SongInfo): void => {
  store.commit("PLAYSONG", item);
};

const playAllSong = (songs: SongInfo[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

const trackInfos = computed(() => {
  return store.state.dailyRecommendSongs
})

onBeforeMount(() => {
  if (store.state.dailyRecommendSongs.length < 1) {
    store.dispatch('getDailyRecommendSongs')
  }
})

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

const getDay = (): number => {
  let date = new Date()
  return date.getDate()
}

const getWeek = (): string => {
  let date = new Date()
  return weekArr[date.getDay()]
}


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

    .playlist-date {
      width: 30%;
      height: 78%;
      float: left;
      margin-top: 50px;
      display: flex;
      justify-content: center;
      align-items: center;


      .date_content {
        width: 60%;
        height: 80%;
        border: 1px solid var(--color-secondary-bg-for-transparent);
        border-radius: 1rem;
        overflow: hidden;

        .week {
          width: 100%;
          height: 30%;
          background-color: var(--color-primary);
          font-size: 4rem;
          text-align: center;
          letter-spacing: 3px;
          line-height: 6.5rem;
          color: #fff;
        }

        .day {
          width: 100%;
          height: 70%;
          font-size: 15rem;
          text-align: center;
          line-height: 15rem;
          color: var(--color-text);
        }
      }



    }

    .playlist-detail {
      width: 60%;
      height: 71.5%;
      padding-top: 7rem;
      float: left;

      .title {
        font-size: 1.5rem;
        color: var(--color-text);

        h1 {
          font-weight: 500;
        }
      }

      .descript {
        font-size: 1.5rem;
        color: var(--color-text);

        h3 {
          font-weight: 500;
        }
      }

      .data_actions {
        margin-top: 7rem;
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
          border-radius: 2px;
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
    width: 80%;
    height: 70rem;
    margin: 0 auto;

    li {
      list-style: none;
    }

    .detail_layout__main {
      float: left;
      width: 100%;
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
                  margin-left: 20rem;
                  padding-top: 5px;
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
  }
}
</style>
