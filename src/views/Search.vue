<template>
  <div class="search_container">
    <div class="search_top">
      <div class="search_top_bg"></div>
      <div class="input" :class="{ active: inputFocus }">
        <input class="search_input" type="text" v-model="keyword" @focus="inputFocus = true"
          @blur="inputFocus = false" />
      </div>
      <div class="icon" @click="toSearch">
        <i class="search_icon"></i>
      </div>
    </div>
    <div class="search_content">
      <div class="nav">
        <span class="nav_item" v-for="(item, index) in SearchNav" :key="index" @click="searchType = index"
          :class="{ active: searchType == index }">{{ item }}</span>
      </div>
      <div class="content">
        <div class="song" v-show="searchType == 1">
          <div class="title">
            共搜索到&nbsp;<span style="color: #c20c0c">{{
                songList?.length
            }}</span>&nbsp;首歌
          </div>
          <div class="mod_songlist">
            <ul class="songlist__header">
              <li class="songlist__header_name">歌曲</li>
              <li class="songlist__header_author">歌手</li>
              <li class="songlist__header_album">专辑</li>
              <li class="songlist__header_time">时长</li>
            </ul>
            <ul class="songlist__list">
              <li v-for="(item, index) in songList" :key="item.id">
                <div class="songlist__item songlist__item--even" :style="{
                  backgroundColor: index % 2 == 0 ? backColor : none,
                }">
                  <div class="songlist__number songlist__number--top">
                    {{ index + 1 }}
                  </div>
                  <div class="songlist__songname">
                    <span class="songlist__songname_txt"><a :title="item.name" @click="toSongDetail(item)">{{
                        item.name
                    }}</a></span>

                    <div class="mod_list_menu">
                      <a class="list_menu__item list_menu__play" title="播放" @click="playSong(item)"><i
                          class="list_menu__icon_play"></i></a><a class="list_menu__item list_menu__add"
                        title="添加到歌单"><i class="list_menu__icon_add"></i></a>
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
                  <div class="songlist__time">
                    {{ timestampToTime(item.dt) }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="album" v-show="searchType == 10">
          <div class="title">
            共搜索到&nbsp;<span style="color: #c20c0c">{{
                albumList?.length
            }}</span>&nbsp;张专辑
          </div>
          <square-item-list :square-items="albumList"></square-item-list>
        </div>
        <div class="artist" v-show="searchType == 100">
          <div class="title">
            共搜索到&nbsp;<span style="color: #c20c0c">{{
                aritstList?.length
            }}</span>&nbsp;位歌手
          </div>
          <aritst-item :artists-infos="aritstList"></aritst-item>
        </div>
        <div class="playlist" v-show="searchType == 1000">
          <div class="title">
            共搜索到&nbsp;<span style="color: #c20c0c">{{
                playlists?.length
            }}</span>&nbsp;个歌单
          </div>
          <square-item-list :square-items="playlists"></square-item-list>
        </div>
        <div class="mv" v-show="searchType == 1004">
          <div class="title">
            共搜索到&nbsp;<span style="color: #c20c0c">{{
                mvList?.length
            }}</span>&nbsp;部MV
          </div>
          <m-v-item :mv-list="mvList"></m-v-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "SearchItem";
</script>
<script setup lang="ts">
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { ref, onBeforeMount, computed, watch } from "vue";
import { useStore } from "vuex";
import { SearchNav } from "@/utils/searchNav";
import SquareItemList from "@/components/SquareItemList.vue";
import MVItem, { MVProps } from "@/components/MVItem.vue";
import AritstItem from "@/components/AritstItem.vue";
import { timestampToTime } from "@/utils/utils";

const route = useRoute();
const store = useStore();
const router = useRouter();
let keyword = ref("");
let inputFocus = ref(false);
let searchType = ref(1);
let backColor = ref("rgba(0,0,0,.01)");
let none = ref("none");

let songList = computed(() => {
  return store.state.searchSongsList;
});

let albumList = computed(() => {
  let arr: SquareItemProps[] = [];
  store.state.searchAlbumList.forEach((item: any) => {
    arr.push({
      id: item.id,
      picUrl: item.picUrl,
      name: item.name,
      artistId: item.artist.id,
      artistName: item.artist.name,
      routerPath: "/altumDetail",
      publishTime: item.publishTime,
    });
  });

  return arr;
});

let playlists = computed(() => {
  let arr: SquareItemProps[] = [];
  store.state.searchPlaylist.forEach((item: any) => {
    arr.push({
      id: item.id,
      name: item.name,
      picUrl: item.coverImgUrl,
      routerPath: "/songlistDetail",
    });
  });

  return arr;
});

let aritstList = computed(() => {
  return store.state.searchArtistList;
});

let mvList = computed(() => {
  let arr: MVProps[] = [];
  store.state.searchMVlist?.forEach((item: any) => {
    arr.push({
      id: item.id,
      name: item.name,
      picUrl: item.cover,
      artistId: item.artistId,
      artistName: item.artistName,
      playCount: item.playCount,
    });
  });
  return arr;
});

const playSong = (item: SongInfo): void => {
  store.commit("PLAYSONG", item);
};

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

watch(
  () => searchType.value,
  () => {
    store.dispatch("toSearch", {
      keyWord: keyword.value,
      type: searchType.value,
    });
  }
);

const toSearch = async () => {
  if (searchType.value == 1) {
    store.dispatch("toSearch", {
      keyWord: keyword.value,
      type: searchType.value,
    });
  } else {
    searchType.value = 1;
  }
};

onBeforeMount(() => {
  searchType.value = store.state.searchType;
  if (route.query.keyWord) {
    keyword.value = route.query.keyWord as string;
  }
});

onBeforeRouteUpdate((to, from) => {
  if (to.query.keyWord !== from.query.keyWord) {
    if (to.query.keyWord) {
      keyword.value = to.query.keyWord as string;
    }
  }
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .search_container {
    min-width: 1487px;
  }
}

.search_container {
  margin-top: 64px;
  width: 100vw;
  overflow: hidden;

  .search_top {
    width: 100%;
    height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .search_top_bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: var(--color-secondary-bg-for-transparent);
    }

    .input {
      height: 5rem;
      width: 30%;
      padding-right: 0.4rem;
      background: #fff;
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
      z-index: 10;

      .search_input {
        margin-right: 0.2rem;
        width: 100%;
        height: 96%;
        outline: none;
        border: none;
        background: transparent;
        color: var(--color-text);
        font-size: 1.6rem;
        text-align: start;
        text-indent: 1.5rem;
      }
    }

    .icon {
      width: 4rem;
      height: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: #fff;
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
      z-index: 10;

      .search_icon {
        background: url(@/assets/icons/search.svg) no-repeat center/cover;
        width: 2.5rem;
        height: 2.5rem;
        opacity: 0.5;
        display: block;

        &:active {
          transform: scale(0.97);
        }
      }

      &:hover {
        .search_icon {
          opacity: 1;
        }
      }
    }

    .active {
      .search_input {
        opacity: 1;
        color: var(--color-primary);
      }
    }
  }

  .search_content {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;

    .nav {
      width: 100%;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .nav_item {
        width: 10rem;
        height: 5rem;
        font-size: 1.6rem;
        line-height: 4.8rem;
        font-weight: 600;
        text-align: center;
        color: var(--color-text);
        cursor: pointer;
        user-select: none;

        &:hover {
          color: var(--color-primary);
          border-bottom: 1px solid var(--color-primary);
        }
      }

      .active {
        color: var(--color-primary);
        border-bottom: 1px solid var(--color-primary);
      }
    }

    .content {
      width: 100%;
      margin: 0 auto;

      .song {
        width: 80%;
        margin: 0 auto;

        .title {
          font-size: 1.4rem;
          color: var(--color-text);
          margin-left: 3rem;
          margin-top: 2rem;
        }

        .mod_songlist {
          width: 95%;
          height: 100%;

          li {
            list-style: none;
          }

          .songlist__header {
            font-size: 14px;
            position: relative;
            height: 5rem;
            width: 100%;
            display: block;
            line-height: 5rem;
            background: rgba(0, 0, 0, 0.01);

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
            height: 5rem;
            width: 100%;
            display: block;

            .songlist__item {
              width: 100%;
              height: 5rem;
              position: relative;
              display: block;
              line-height: 5rem;
              color: var(--color-text);

              .songlist__number {
                opacity: 0.7;
                width: 34px;
                height: 100%;
                position: absolute;
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
                    width: 40px;
                    height: 40px;
                    background-color: #fff;
                    display: block;
                    position: relative;
                    margin-left: 40px;
                    padding-top: 2.5px;
                    float: left;

                    .list_menu__icon_play {
                      background: url("@/assets/icons/播放\ \(1\).png") no-repeat center/cover;
                      width: 40px;
                      height: 40px;
                      display: inline-block;
                    }

                    .list_menu__icon_add {
                      background: url("@/assets/icons/添加.png") no-repeat center/cover;
                      width: 39px;
                      height: 39px;
                      display: inline-block;
                    }

                    &:active {
                      transform: scale(0.97);
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
                margin-left: 0.5rem;
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
                margin-left: 1.4rem;
              }

              a {
                color: var(--color-text);

                &:hover {
                  color: var(--color-primary);
                  text-decoration: none;
                }
              }

              &:hover {
                .mod_list_menu {
                  opacity: 1;
                }
              }
            }
          }
        }
      }

      .album {
        width: 80%;
        margin: 0 auto;

        .title {
          font-size: 1.4rem;
          color: var(--color-text);
          margin: 2rem 0 3rem 3rem;
        }
      }

      .artist {
        width: 80%;
        margin: 0 auto;

        .title {
          font-size: 1.4rem;
          color: var(--color-text);
          margin: 2rem 0 0 3rem;
        }
      }

      .playlist {
        width: 80%;
        margin: 0 auto;

        .title {
          font-size: 1.4rem;
          color: var(--color-text);
          margin: 2rem 0 3rem 3rem;
        }
      }

      .mv {
        width: 80%;
        margin: 0 auto;

        .title {
          font-size: 1.4rem;
          color: var(--color-text);
          margin: 2rem 0 3rem 3rem;
        }
      }
    }
  }
}
</style>
