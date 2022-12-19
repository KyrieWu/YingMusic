<template>
  <div class="library_container">
    <div class="library_top">
      <div class="bg">
        <img :src="store.state.user?.backgroundUrl" alt="" />
      </div>
      <div class="info">
        <div class="icon">
          <img :src="store.state.user?.avatarUrl" alt="" />
        </div>
        <div class="name">{{ store.state.user?.nickname }}</div>
      </div>
    </div>
    <div class="library_dommon">
      <div class="dommon_nav">
        <span class="nav_item" @click="navType = 1" :class="{ active: navType == 1 }">我收藏的</span>
        <span class="nav_item" @click="navType = 2" :class="{ active: navType == 2 }">我创建的歌单</span>
        <span class="nav_item" @click="navType = 3" :class="{ active: navType == 3 }">我关注的</span>
      </div>
      <div class="dommon_content">
        <div class="nav">
          <div class="like_nav" v-if="navType == 1">
            <span class="nav_item" @click="likeNavType = 1" :class="{ active: likeNavType == 1 }">歌曲({{ songList.length
            }})</span>
            <span class="nav_item" @click="likeNavType = 2" :class="{ active: likeNavType == 2 }">歌单({{ playlists.length
            }})</span>
            <span class="nav_item" @click="likeNavType = 3" :class="{ active: likeNavType == 3 }">专辑({{ albumList.length
            }})</span>
            <span class="nav_item" @click="likeNavType = 4" :class="{ active: likeNavType == 4 }">MV({{ mvList.length
            }})</span>
          </div>
          <div class="attention_nav" v-if="navType == 3">
            <span class="nav_item" @click="attentionNavType = 1" :class="{ active: attentionNavType == 1 }">歌手({{
                aritstList.length
            }})</span>
          </div>
        </div>
        <div class="content">
          <div class="song" v-show="likeNavType == 1 && navType == 1">
            <div class="mod_songlist" v-if="songList.length !== 0">
              <ul class="songlist__header">
                <li class="songlist__header_name">歌曲</li>
                <li class="songlist__header_author">歌手</li>
                <li class="songlist__header_album">专辑</li>
                <li class="songlist__header_time">时长</li>
              </ul>
              <ul class="songlist__list">
                <li v-for="(item, index) in songList" :key="item.id">
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
                      <router-link :to="{
                        path: '/altumDetail',
                        query: { id: item.al.id },
                      }" :title="item.al.name">{{ item.al.name }}</router-link>
                    </div>
                    <div class="songlist__time">
                      {{ timestampToTime(item.dt) }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <blankprompt v-else> </blankprompt>
          </div>
          <div class="playlist" v-show="likeNavType == 2 && navType == 1">
            <square-item-list :square-items="playlists" v-if="playlists.length !== 0"></square-item-list>
          </div>
          <div class="album" v-show="likeNavType == 3 && navType == 1">
            <square-item-list :square-items="albumList" v-if="albumList.length !== 0"></square-item-list>
            <blankprompt v-else> </blankprompt>
          </div>
          <div class="mv" v-show="likeNavType == 4 && navType == 1">
            <m-v-item :mv-list="mvList" v-if="mvList.length !== 0"></m-v-item>
            <blankprompt v-else> </blankprompt>
          </div>
          <div class="artist" v-show="attentionNavType == 1 && navType == 3">
            <aritst-item :artists-infos="aritstList" v-if="aritstList.length !== 0"></aritst-item>
            <blankprompt v-else>
              <p style="color: var(--color-text); font-size: 1.8rem">
                还没有关注的歌手!
              </p>
            </blankprompt>
          </div>
          <div class="playlist" v-show="navType == 2">
            <square-item-list :square-items="userplaylists" v-if="userplaylists.length !== 0"></square-item-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "LibraryItem";
</script>
<script setup lang="ts">
import { useStore } from "vuex";
import { onBeforeMount, watch, ref, computed, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import SquareItemList from "@/components/SquareItemList.vue";
import MVItem, { MVProps } from "@/components/MVItem.vue";
import AritstItem from "@/components/AritstItem.vue";
import { timestampToTime } from "@/utils/utils";
import Blankprompt from "@/components/Blankprompt.vue";

const store = useStore();
const router = useRouter();

const data = reactive({
  navType: 1,
  likeNavType: 1,
  attentionNavType: 1,
});

const songList = computed(() => {
  return store.state.likeSonglist;
});

const playlists = computed(() => {
  let arr: SquareItemProps[] = [];
  store.state.likePlaylist?.forEach((item: any) => {
    if (item.creator.userId !== store.state.user?.userId) {
      arr.push(
        Object.freeze({
          id: item.id,
          name: item.name,
          picUrl: item.coverImgUrl,
          routerPath: "/songlistDetail",
        })
      );
    }
  });

  return arr;
});

const userplaylists = computed(() => {
  let arr: SquareItemProps[] = [];
  store.state.likePlaylist?.forEach((item: any) => {
    if (item.creator.userId == store.state.user?.userId) {
      arr.push(
        Object.freeze({
          id: item.id,
          name: item.name,
          picUrl: item.coverImgUrl,
          routerPath: "/songlistDetail",
        })
      );
    }
  });

  return arr;
});

let albumList = computed(() => {
  let arr: SquareItemProps[] = [];
  store.state.likeAlbumlist?.forEach((item: any) => {
    arr.push({
      id: item.id,
      picUrl: item.picUrl,
      name: item.name,
      artistId: item.artists[0].id,
      artistName: item.artists[0].name,
      routerPath: "/altumDetail",
    });
  });

  return arr;
});

let aritstList = computed(() => {
  return store.state.likeArtistlist;
});

let mvList = computed(() => {
  let arr: MVProps[] = [];
  store.state.likeMVlist?.forEach((item: any) => {
    arr.push({
      id: item.vid,
      name: item.title,
      picUrl: item.coverUrl,
      artistId: item.creator[0].userId,
      artistName: item.creator[0].userName,
    });
  });
  return arr;
});

onBeforeMount(() => {
  store.dispatch("getLikeSongList");
  store.dispatch("getLikePlaylist");
  store.dispatch("getLikeAlbumlist");
  store.dispatch("getLikeMVlist");
  store.dispatch("getLikeArtlist");
});

watch(
  () => store.state.isLogin,
  () => {
    if (!store.state.isLogin) {
      router.push("/");
    }
  }
);

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

const { navType, likeNavType, attentionNavType } = toRefs(data);
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .library_container {
    min-width: 1487px;
  }
}

.library_container {
  width: 100vw;
  margin-top: 64px;
  overflow: hidden;

  .library_top {
    width: 100%;
    height: 35rem;
    //background: #ccc;
    position: relative;

    .bg {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .icon {
        width: 10%;
        height: 50%;

        img {
          width: 90%;
          height: 92%;
          object-fit: cover;
          border-radius: 50%;
        }
      }

      .name {
        font-size: 1.8rem;
        color: #fff;
      }
    }
  }

  .library_dommon {
    width: 80%;
    margin: 0 auto;

    .dommon_nav {
      width: 100%;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;

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
        margin-right: 5rem;

        &:hover {
          color: var(--color-primary);
        }
      }

      .active {
        color: var(--color-primary);
      }
    }

    .dommon_content {
      width: 100%;

      .nav {
        width: 100%;
        height: 6rem;
        font-weight: 500;
        margin-bottom: 3rem;

        .like_nav {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .attention_nav {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .nav_item {
          width: 10rem;
          height: 5rem;
          font-size: 1.6rem;
          line-height: 4.8rem;

          text-align: center;
          color: var(--color-text);
          cursor: pointer;
          user-select: none;

          &:hover {
            color: var(--color-primary);
          }
        }

        .active {
          color: var(--color-primary);
        }
      }

      .content {
        width: 100%;
        margin: 0 auto;

        .song {
          width: 100%;
          margin: 0 auto;

          .title {
            font-size: 1.4rem;
            color: var(--color-text);
            margin-left: 3rem;
            margin-top: 2rem;
          }

          .mod_songlist {
            width: 95%;
            //height: 100%;

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
              width: 100%;
              display: block;

              .songlist__item {
                width: 100%;
                height: 5rem;
                position: relative;
                display: block;
                line-height: 5rem;
                color: var(--color-text);
                overflow: hidden;
                border-radius: 1rem;

                .songlist__number {
                  opacity: 0.7;
                  width: 34px;
                  height: 100%;
                  //float: left;
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
                      width: 40px;
                      height: 40px;
                      background-color: transparent;
                      display: block;
                      position: relative;
                      margin-left: 25rem;
                      padding-top: 5px;
                      float: left;

                      .list_menu__icon_play {
                        background: url("@/assets/icons/播放-blue.png") no-repeat center/cover;
                        width: 40px;
                        height: 40px;
                        display: inline-block;

                        &:active {
                          transform: scale(0.95);
                        }
                      }

                      .list_menu__icon_add {
                        background: url("@/assets/icons/添加-blue.png") no-repeat center/cover;
                        width: 39px;
                        height: 39px;
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
                  background-color: var(--color-secondary-bg-for-transparent);

                  .mod_list_menu {
                    opacity: 1;
                  }
                }
              }
            }
          }
        }

        .album {
          width: 100%;
          margin: 0 auto;
        }

        .artist {
          width: 100%;
          margin: 0 auto;
        }

        .playlist {
          width: 100%;
          margin: 0 auto;
        }

        .mv {
          width: 100%;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
