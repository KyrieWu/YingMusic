<template>
  <div class="mod_songlist">
    <ul class="songlist__header">
      <li class="songlist__header_name">歌曲</li>
      <li class="songlist__header_album">专辑</li>
      <li class="songlist__header_time">时长</li>
    </ul>
    <ul class="songlist__list">
      <li v-for="(item, index) in hotSongDetail" :key="item.id">
        <div class="songlist__item songlist__item--even">
          <div class="songlist__number songlist__number--top">
            {{ index + 1 }}
          </div>
          <div class="songlist__songname">
            <span class="songlist__songname_txt"
              ><a :title="item.name" @click="toSongDetail(item)">{{
                item.name
              }}</a></span
            >

            <div class="mod_list_menu">
              <a
                class="list_menu__item list_menu__play"
                :title="$t('songItem.play')"
                @click="playSong(item)"
                ><i class="list_menu__icon_play"></i></a
              ><a
                class="list_menu__item list_menu__add"
                :title="$t('songItem.add')"
                ><i class="list_menu__icon_add"></i
              ></a>
            </div>
          </div>
          <div class="songlist__album">
            <router-link
              :to="{ path: '/altumDetail', query: { id: item.al.id } }"
              href=""
              >{{ item.al.name }}
            </router-link>
          </div>
          <div class="songlist__time">{{ timestampToTime(item.dt) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: "ArtistSongItem",
};
</script>
<script setup lang="ts">
import { timestampToTime } from "@/utils/utils";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const { hotSongDetail } = defineProps<{ hotSongDetail: SongInfo[] }>();

const playSong = (item: any): void => {
  store.commit("PLAYSONG", item);
};

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};
</script>

<style scoped lang="scss">
.mod_songlist {
  width: 95%;
  height: 82%;

  ul {
    list-style: none;
    display: block;
  }

  .songlist__header {
    font-size: 14px;
    position: relative;
    height: 5rem;
    width: 100%;
    display: block;
    line-height: 5rem;

    li {
      display: block;
      float: left;
      opacity: 0.7;
      color: var(--color-text);
    }

    .songlist__header_name {
      width: 45%;
      height: 100%;
      display: inline-block;
      padding-left: 4rem;
    }

    .songlist__header_album {
      width: 35%;
      height: 100%;
      display: inline-block;
    }

    .songlist__header_time {
      width: 15%;
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
        width: 44.5%;
        height: 100%;
        font-weight: 500;
        float: left;
        padding-left: 40px;
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
          opacity: 0;
          position: absolute;
          z-index: 100;
          right: 0;

          .list_menu__item {
            width: 4rem;
            height: 4rem;
            background-color: transparent;
            display: block;
            position: relative;
            margin-left: 15rem;
            padding-top: 5px;
            float: left;

            .list_menu__icon_play {
              background: url("@/assets/icons/播放-blue.png") no-repeat
                center/cover;
              width: 4rem;
              height: 4rem;
              display: inline-block;

              &:active {
                transform: scale(0.95);
              }
            }

            .list_menu__icon_add {
              background: url("@/assets/icons/添加-blue.png") no-repeat
                center/cover;
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

      .songlist__album {
        width: 35%;
        height: 100%;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 0.5rem;
      }

      .songlist__time {
        width: 11%;
        height: 100%;
        float: left;
        opacity: 0.7;
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
</style>
