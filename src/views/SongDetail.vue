<template>
  <div class="playlist-container">
    <div class="playlist-main">
      <div class="playlist-img">
        <img :src="songInfo?.al.picUrl" alt="" />
      </div>
      <div class="playlist-detail">
        <div class="title">
          <h1>{{ songInfo?.name }}</h1>
        </div>
        <ul class="data_info">
          <li class="data_info_item">
            <div class="data_tag_box">
              歌手:&nbsp;
              <span>
                <router-link :to="{
                  path: '/artistDetail',
                  query: { id: songInfo?.ar[0].id },
                }" class="data_info_tags" :title="songInfo?.ar[0].name">{{ songInfo?.ar[0].name }}</router-link>
              </span>
            </div>
          </li>
          <li class="data_info_item">
            <div class="data_tag_box">
              所属专辑:&nbsp;
              <span>
                <router-link :to="{ path: '/altumDetail', query: { id: songInfo?.al.id } }" href=""
                  class="data_info_tags" :title="songInfo?.al.name">{{ songInfo?.al.name }}</router-link>
              </span>
            </div>
          </li>
        </ul>
        <div class="data_actions">
          <a class="mod_btn_green" @click="playSong">
            <i class="mod_btn_green__icon_play"></i>
            <span>播放</span>
          </a>
          <a class="mod_btn" @click="likeSong">
            <i class="mod_btn__icon_like" ref="mod_btn__icon_like"></i>
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
      <div class="detail_layout_other">
        <div class="mod_about">
          <h4>歌词:</h4>
          <div class="about_cont" :class="{ about_cont_up: isPackUp }" ref="about_cont">
            <p v-for="item in lyricsArr" :key="item">{{ item.lrc }}</p>
          </div>
          <a class="about_more" v-if="isPackUp" @click="packDown">展开&#8595;</a>
          <a class="pack_up" v-if="!isPackUp" @click="packUp">收起&#8593;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "PlayList";
</script>
<script setup lang="ts">
import { getLyric } from "@/api/track";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, onMounted, ref } from "vue";
import { SongInfo } from "@/types/SongInfo";
import { sortLyric } from "@/utils/sortLyric";
import { useStore } from "vuex";
import { Lyric } from "@/types/Lyric";

const store = useStore();
const route = useRoute();
let songInfo = ref<SongInfo>();
let about_cont = ref();

let isPackUp = ref(true);

let mod_btn__icon_like = ref();
let likeSongStatus = ref(1);

let lyricsArr = ref<any[]>([]);

const packDown = () => {
  isPackUp.value = false;
  about_cont.value.style.overflow = "auto";
};

const packUp = () => {
  isPackUp.value = true;
  about_cont.value.style.overflow = "hidden";
};

const playSong = () => {
  store.commit("PLAYSONG", songInfo.value);
};

onBeforeMount(async () => {
  if (sessionStorage.getItem(`${route.query.id}`)) {
    let info = sessionStorage.getItem(`${route.query.id}`) as string;
    songInfo.value = JSON.parse(info);
  }

  let res = (await getLyric(route.query.id)) as unknown as Lyric;
  lyricsArr.value = sortLyric(res.lrc.lyric);

  let isLikeSong = store.state.likeSonglist?.filter(
    (item: any) => item.id == route.query.id
  );

  if (isLikeSong.length > 0) {
    likeSongStatus.value = 2;
    mod_btn__icon_like.value.style.background =
      "url('已收藏.png') no-repeat center/cover";
  } else {
    likeSongStatus.value = 1;
    mod_btn__icon_like.value.style.background =
      "url('收藏.png') no-repeat center/cover";
  }
});

const likeSong = async () => {
  console.log(likeSongStatus.value);
  let res = await store.dispatch("likeSong", Number(route.query.id));
  if (res == 200) {
    if (likeSongStatus.value == 1) {
      likeSongStatus.value = 2;
      mod_btn__icon_like.value.style.background =
        "url('已收藏.png') no-repeat center/cover";
    } else {
      likeSongStatus.value = 1;
      mod_btn__icon_like.value.style.background =
        "url('收藏.png') no-repeat center/cover";
    }
  }
};
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .playlist-container {
    min-width: 1430px;
  }

  .playlist-img,
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
        border-radius: 5%;
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
          width: 78px;
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
    margin: 0 auto;

    li {
      list-style: none;
    }

    .detail_layout_other {
      width: 50rem;
      margin-left: 55px;
      margin-top: -20px;

      h4 {
        font-size: 20px;
      }

      .about_cont {
        font-size: 14px;
        line-height: 26px;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        display: --webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        color: var(--color-text);
      }

      .about_cont_up {
        height: 300px;
      }

      .about_more {
        font-size: 16px;
        display: block;
        margin-top: 10px;
        opacity: 1;

        &:hover {
          color: var(--color-primary);
          text-decoration: none;
        }
      }

      .pack_up {
        font-size: 16px;
        display: block;
        margin-top: 10px;
        opacity: 1;

        &:hover {
          color: var(--color-primary);
          text-decoration: none;
        }
      }
    }
  }
}
</style>
