<template>
  <footer>
    <div class="left">
      <button class="prevSong" @click="prevSong">
        <i class="prev-icon">上一首</i>
      </button>
      <button class="playOrPause" @click="playOrPause">
        <i :class="[isPlay == false ? playIcon : pauseIcon]">播放/暂停</i>
      </button>
      <button class="nextSong" @click="nextSong">
        <i class="next-icon">下一首</i>
      </button>
    </div>
    <div class="middle">
      <div class="img">
        <img :src="`${store.state.playList[playindex]?.al.picUrl}`" alt="" />
      </div>
      <div class="middle_top">
        <div class="play_name">
          {{ store.state.playList[playindex]?.name }}-{{
              store.state.playList[playindex]?.ar[0].name
          }}
        </div>
        <div class="play_time">
          <span>
            {{ _currenttime }}&nbsp;/&nbsp;{{
                timestampToTime(store.state.playList[playindex]?.dt)
            }}
          </span>
        </div>
      </div>
      <div class="nprogress">
        <input type="range" class="range" min="0" :max="duration" v-model="currenttime" step="0.05" />
      </div>
    </div>
    <div class="right">
      <div class="like">
        <img src="@/assets/icons/收藏.png" alt="" />
      </div>
      <div class="playlist" :class="{ active: isShowPlaylist == true }">
        <img src="@/assets/icons/list.svg" alt="" @click="ShowPlaylist" />
      </div>
      <div class="volume">
        <img ref="volume_icon" class="volume_icon" src="@/assets/icons/volume.svg" @click="goMute" />
        <input type="range" class="volume_range" min="0" max="1" step="0.01" v-model="volumeRange" />
      </div>
    </div>
    <div class="updn">
      <!-- <div class="upOrDown">
        <img src="@/assets/icons/arrow-up.svg" alt="" />
      </div> -->
    </div>
    <div class="playList" v-show="isShowPlaylist">
      <div class="bg">
        <img :src="store.state.playList[playindex]?.al.picUrl" alt="" />
      </div>
      <div class="playList_top">
        <span class="top_play_list">播放列表({{ store.state.playList.length }})</span>
        <div class="deletelist" @click="deletePlaylist">
          <i class="delete_icon"></i>
          <span class="delete_title">清空列表</span>
        </div>
        <div class="top_play_songname">
          {{ store.state.playList[playindex]?.name }}
        </div>
        <span class="close" @click="isShowPlaylist = !isShowPlaylist">×</span>
      </div>
      <div class="playList_left">
        <div class="mod_songlist">
          <ul class="songlist__header">
            <li class="songlist__header_name">歌曲</li>
            <li class="songlist__header_album">歌手</li>
            <li class="songlist__header_time">时长</li>
          </ul>
          <ul class="songlist__list">
            <li v-for="(item, index) in store.state.playList" :key="item.id">
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
                    <a class="list_menu__item list_menu__delete" title="从歌单中删除" @click="deleteSong(item)"><i
                        class="list_menu__icon_delete"></i></a>
                  </div>
                </div>
                <div class="songlist__album">
                  <router-link :to="{
                    path: '/artistDetail',
                    query: { id: item.ar[0].id },
                  }">{{ item.ar[0].name }}</router-link>
                </div>
                <div class="songlist__time">{{ timestampToTime(item.dt) }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="playList_right">
        <div class="song_img">
          <img :src="`${store.state.playList[playindex]?.al.picUrl}`" alt="" />
        </div>
        <div class="lyric" ref="lyric_content">
          <p v-for="item in lyric" :key="item" :class="{
            lyricActive:
              (currenttime * 1000 >= item.time &&
                currenttime * 1000 < item.pre) ||
              (currenttime * 1000 >= item.time && item.pre == 0),
          }">
            {{ item.lrc }}
          </p>
        </div>
      </div>
    </div>
    <audio ref="player"
      :src="`https://music.163.com/song/media/outer/url?id=${store.getters.getCurrentSongId}.mp3`"></audio>
  </footer>
</template>

<script lang="ts">
name: "PlayBar"; //
</script>
<script setup lang="ts">
import { watch, ref, reactive, toRefs, onUnmounted, computed } from "vue";
import { useStore } from "vuex";
import { timestampToTime, uptateTime } from "@/utils/utils";
import { SongInfo } from "@/types/SongInfo";
import { useRouter } from "vue-router";
import { sortLyric } from "@/utils/sortLyric";

const router = useRouter();
const store = useStore();
const player = ref();
let playindex = ref(0);
let isPlay = ref(false);
let _currenttime = ref("00:00");
let volumeRange = ref(0.5);
let volumeRecord = ref(0);
let volume_icon = ref();
let isShowPlaylist = ref(false);
let lyric_content = ref();

volumeRecord.value = volumeRange.value;

const data = reactive({
  playIcon: "play-icon",
  pauseIcon: "pause-icon",
});

let currenttime = computed(() => {
  return store.state.currentTime;
});
let duration = computed(() => {
  return store.state.duration;
});
let lyric = computed(() => {
  let arr: any[];
  arr = sortLyric(store.state.lyriclist?.lyric);
  return arr;
});

watch(
  () => store.state.playIndex,
  async () => {
    playindex.value = store.state.playIndex;
    let canPlay = await store.dispatch(
      "checkMusic",
      store.state.playList[playindex.value]?.id
    );
    if (canPlay) {
      lyric_content.value.scrollTop = 0;
      player.value.volume = volumeRange.value;
      store.commit("UPDATEDURATION", player.value.duration);
      updataCurrenttime();
      player.value.autoplay = canPlay;
      isPlay.value = canPlay;
      store.dispatch("getLyric", store.state.playList[playindex.value]?.id);
    }
  }
);

watch(
  () => store.state.playList,
  async () => {
    lyric_content.value.scrollTop = 0;
    store.commit("UPDATEDURATION", player.value.duration);
    store.dispatch("getLyric", store.state.playList[playindex.value].id);
    updataCurrenttime();
    player.value.autoplay = true;
    isPlay.value = true;

    if (store.state.playList.length == 0) {
      isShowPlaylist.value = false;
    }
  }
);

watch(
  () => volumeRange.value,
  () => {
    updateVolume();
  }
);

watch(
  () => currenttime.value,
  () => {
    if (currenttime.value == duration.value) {
      nextSong();
    } else {
      let pactive = document.querySelector("p.lyricActive") as HTMLElement;
      if (pactive?.offsetTop > 500) {
        lyric_content.value.scrollTop = pactive.offsetTop - 500;
      }
    }
  }
);

const updateVolume = () => {
  player.value.volume = volumeRange.value;

  if (player.value.volume == 0) {
    volume_icon.value.src = "volume-mute.svg";
    player.value.muted = true;
  } else {
    volume_icon.value.src = "volume.svg";
    player.value.muted = false;
    volumeRecord.value = volumeRange.value;
  }
};

let interval: any;
const updataCurrenttime = () => {
  interval = setInterval(() => {
    store.commit("UPDATECURRENTTINE", player.value?.currentTime);
    _currenttime.value = uptateTime(
      player.value.duration * 1000,
      player.value.currentTime * 1000
    );
  }, 1000);
};
const clearnterval = () => {
  if (interval != null) {
    clearInterval(interval);
  }
};

const playOrPause = () => {
  if (store.state.playList.length != 0) {
    if (isPlay.value) {
      player.value.pause();
      clearnterval();
    } else {
      store.commit("UPDATEDURATION", player.value.duration);
      player.value.play();
      updataCurrenttime();
    }
    isPlay.value = !isPlay.value;
  }
};

const prevSong = () => {
  if (store.state.playList.length != 0) {
    playindex.value -= 1;

    if (playindex.value < 0) {
      playindex.value = store.state.playList.length - 1;
    }
    lyric_content.value.scrollTop = 0;
    store.commit("UPDTAEPLAYINDEX", playindex.value);
    store.dispatch("getLyric", store.state.playList[playindex.value].id);
  }
};

const nextSong = () => {
  if (store.state.playList.length != 0) {
    playindex.value += 1;

    if (playindex.value >= store.state.playList.length) {
      playindex.value = 0;
    }
    lyric_content.value.scrollTop = 0;
    store.commit("UPDTAEPLAYINDEX", playindex.value);
    store.dispatch("getLyric", store.state.playList[playindex.value].id);
  }
};

const playSong = (item: any): void => {
  lyric_content.value.scrollTop = 0;
  store.commit("PLAYSONG", item);
  store.dispatch("getLyric", store.state.playList[playindex.value].id);
};
const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

const goMute = () => {
  if (player.value.muted) {
    volume_icon.value.src = "volume.svg";
    player.value.muted = false;
    volumeRange.value = volumeRecord.value;
  } else {
    volume_icon.value.src = "volume-mute.svg";
    player.value.muted = true;
    volumeRange.value = 0;
  }
};

const deletePlaylist = () => {
  store.commit("DELETEALLPLAYLIST");
};

const ShowPlaylist = () => {
  isShowPlaylist.value = !isShowPlaylist.value;
};

const deleteSong = (song: SongInfo) => {
  store.commit("DELETESONGFROMPLAYLIST", song);
};

const { playIcon, pauseIcon } = toRefs(data);

onUnmounted(() => {
  clearnterval();
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  footer {
    min-width: 1487px;
  }
}

@media (max-width: 1336px) {
  footer {
    padding: 0 5vw;
  }
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  width: 85vw;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: {
    right: 12vw;
    left: 12vw;
  }

  .left {
    flex: 0.4;
    display: flex;
    align-items: center;

    button {
      border: none;
      user-select: none;
      cursor: pointer;
      margin: 0 8px;

      &:hover {
        background: var(--color-secondary-bg-for-transparent);
      }
    }

    .prevSong {
      width: 2.5rem;
      height: 2.5rem;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      border-radius: 25%;
      transition: 0.2s;

      .prev-icon {
        background: url("@/assets/icons/previous.svg") no-repeat center/cover;
        width: 2rem;
        height: 2rem;
        display: inline-block;
        text-indent: -9999px;

        &:active {
          transform: scale(0.98);
        }
      }
    }

    .playOrPause {
      width: 5rem;
      height: 5rem;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      border-radius: 25%;
      transition: 0.2s;

      .play-icon {
        background: url("@/assets/icons/play.svg") no-repeat center/cover;
        width: 2.5rem;
        height: 3rem;
        display: inline-block;
        text-indent: -9999px;

        &:active {
          transform: scale(0.97);
        }
      }

      .pause-icon {
        background: url("@/assets/icons/pause.svg") no-repeat center/cover;
        width: 2.5rem;
        height: 3rem;
        display: inline-block;
        text-indent: -9999px;

        &:active {
          transform: scale(0.97);
        }
      }
    }

    .nextSong {
      width: 2.5rem;
      height: 2.5rem;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      border-radius: 25%;
      transition: 0.2s;

      .next-icon {
        background: url("@/assets/icons/next.svg") no-repeat center/cover;
        width: 2rem;
        height: 2rem;
        display: inline-block;
        text-indent: -9999px;

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  .middle {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding: {
      left: 10px;
      right: 10px;
    }

    color: var(--color-text);
    position: relative;

    .img {
      position: absolute;
      width: 5rem;
      height: 5rem;
      top: -1rem;
      left: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.5rem;
      }
    }

    .middle_top {
      font-size: 14px;
      width: 95%;
      display: flex;
      margin-left: 5rem;

      .play_name {
        flex: 1;
        padding-left: 4px;
      }

      .play_time {
        flex: 1;

        span {
          float: right;
        }
      }
    }

    .nprogress {
      width: 95%;
      margin-left: 5rem;

      .range {
        width: 100%;
      }

      input[type="range"] {
        appearance: auto;
        cursor: pointer;
        color: var(--color-primary);
        padding: initial;
        border: initial;
        margin: 2px;
        height: 3px;
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        /*清除系统默认样式*/
        height: 8px;
        /*拖动块高度*/
        width: 8px;
        /*拖动块宽度*/
        background: #f8f9fa;
        /*拖动块背景*/
        border-radius: 50%;
        /*外观设置为圆形*/
        border: solid 1px #ddd;
        /*设置边框*/
      }
    }
  }

  .right {
    flex: 1;
    display: flex;
    margin-left: 2rem;

    .like {
      width: 3rem;
      margin-right: 1.5rem;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 90%;
        height: 90%;
      }

      &:hover {
        background: var(--color-secondary-bg-for-transparent);
      }

      &:active {
        transform: scale(0.97);
      }
    }

    .playlist {
      width: 3.5rem;
      margin-right: 2rem;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 75%;
        height: 75%;
        cursor: pointer;
      }

      &:hover {
        background: var(--color-secondary-bg-for-transparent);
      }

      &:active {
        transform: scale(0.97);
        transition: transform 0.2s;
      }
    }

    .active {
      background: var(--color-primary-bg);
    }

    .volume {
      width: 18rem;
      position: relative;
      width: 3.5rem;
      margin-right: 2rem;

      .volume_icon {
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 0.5rem;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background: var(--color-secondary-bg-for-transparent);
        }
      }

      .volume_range {
        position: absolute;
        top: 1rem;
      }

      input[type="range"] {
        appearance: auto;
        cursor: pointer;
        color: var(--color-primary);
        padding: initial;
        border: initial;
        margin: 2px;
        height: 3px;
        width: 10rem;
      }
    }
  }

  .playList {
    width: 67.5%;
    height: 70rem;
    position: absolute;
    z-index: 200;
    top: -70rem;
    left: 22rem;
    border-radius: 1rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #fff;
    overflow: hidden;

    .bg {
      width: 100%;
      height: 100%;
      z-index: -1;
      position: absolute;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(200px);
      }
    }

    .playList_top {
      width: 100%;
      height: 5%;
      position: relative;

      .top_play_list {
        font-size: 1.8rem;
        line-height: 6rem;
        margin-left: 2rem;
        font-weight: 600;
        color: var(--color-text);
      }

      .close {
        height: 80%;
        font-size: 4rem;
        line-height: 2.2rem;
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        cursor: pointer;
        color: var(--color-text);
        border-radius: 50%;

        &:hover {
          color: var(--color-primary);
          background-color: var(--color-primary-bg);
        }

        &:active {
          transform: scale(0.92);
          transition: transform 0.2s;
        }
      }

      .deletelist {
        position: absolute;
        top: 1.4rem;
        left: 50%;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 0.5rem;

        .delete_icon {
          background: url("@/assets/icons/删除.png") no-repeat center/cover;
          width: 2.6rem;
          height: 2.6rem;
          float: left;
        }

        .delete_title {
          font-size: 1.8rem;
          font-weight: 600;
          line-height: 2.5rem;
          color: var(--color-text);
        }

        &:hover {
          background-color: var(--color-primary-bg);

          .delete_title {
            color: var(--color-primary);
          }
        }

        &:active {
          transform: scale(0.97);
          transition: transform 0.2s;
        }
      }

      .top_play_songname {
        width: 40rem;
        height: 6rem;
        position: absolute;
        font-size: 1.8rem;
        line-height: 6rem;
        font-weight: 600;
        text-align: center;
        color: var(--color-text);
        right: 8.4rem;
        top: 0.2rem;
      }
    }

    .playList_left {
      width: 59%;
      height: 91%;
      float: left;
      margin-left: 1rem;
      margin-top: 2rem;
      overflow: auto;

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

            color: var(--color-text);
          }

          .songlist__header_name {
            width: 50%;
            height: 100%;
            display: inline-block;
            padding-left: 4rem;
          }

          .songlist__header_album {
            width: 25%;
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
              width: 49%;
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
                width: 60%;
                height: 100%;
                opacity: 0;
                position: absolute;
                z-index: 100;
                right: 0;
                top: 0.25rem;

                .list_menu__item {
                  width: 40px;
                  height: 40px;
                  background-color: #fff;
                  display: block;
                  position: relative;
                  margin-left: 7rem;
                  padding-top: 2.5px;
                  float: left;
                  background: transparent;

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

                  .list_menu__icon_delete {
                    background: url("@/assets/icons/删除-blue.png") no-repeat center/cover;
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

                .list_menu__delete {
                  margin-left: 6px;
                }
              }
            }

            .songlist__album {
              width: 25%;
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
              margin-left: 0.3rem;
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

    .playList_right {
      width: 38%;
      height: 91%;
      float: right;
      margin-right: 1rem;
      margin-top: 2rem;

      .song_img {
        width: 100%;
        height: 34%;

        img {
          width: 40.5%;
          height: 100%;
          object-fit: cover;
          border-radius: 10%;
          display: block;
          margin-top: 2rem;
          margin-left: 16rem;
        }
      }

      .lyric {
        width: 100%;
        height: 59%;
        margin-top: 2rem;
        text-align: center;
        overflow: hidden;
        cursor: pointer;
        overflow: auto;
        color: var(--color-text);

        p {
          font-size: 1.4rem;
          line-height: 2.5rem;
          user-select: none;
        }

        .lyricActive {
          font-size: 1.8rem;
          color: var(--color-primary);
          transition: 0.4s;
        }

        &::-webkit-scrollbar {
          width: 0px;
        }
      }
    }
  }

  // .updn {
  //   width: 4rem;
  //   height: 150%;
  //   position: absolute;
  //   bottom: 0;
  //   right: 10vw;

  //   .upOrDown {
  //     position: absolute;
  //     width: 100%;
  //     height: 150%;
  //     background-color: #f8f9fa;
  //   }

  //   img {
  //   }
  // }
}
</style>
