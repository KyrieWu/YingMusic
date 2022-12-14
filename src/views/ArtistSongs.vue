<template>
  <div class="songs_container">
    <div class="layout_head">所有热门歌曲:</div>
    <div class="data_actions">
      <a class="mod_btn_blue" @click="playAllSong(hotSongDetail)">
        <i class="mod_btn_green__icon_play"></i>
        <span>播放全部歌曲</span>
      </a>
      <!-- <a href="" class="mod_btn">
        <i class="mod_btn__icon_like"></i>
        <span>收藏热门</span>
      </a> -->
      <!-- <a href="" class="mod_btn">
            <i class="mod_btn__icon_commend"></i>
            <span>评论</span>
          </a> -->
    </div>
    <div class="song_list" :style="{ height: hotSongDetail.length * 50 + 100 + 'px' }">
      <artist-song-item :hot-song-detail="hotSongDetail"></artist-song-item>
    </div>
    <!-- <div ref="show_more" v-show="hotSongDetail.length !== 0">
      <lazy-more></lazy-more>
    </div> -->
  </div>
</template>

<script lang="ts">
name: "ArtistSongs";
</script>
<script setup lang="ts">
import { getArtistHotSong } from "@/api/artist";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, onMounted, ref } from "vue";
import ArtistSongItem from "@/components/ArtistSongItem.vue";
import LazyMore from "@/components/LazyMore.vue";
import { useStore } from "vuex";
import { SongInfo } from "@/types/SongInfo";

interface HotSong {
  artist: object;
  code: number;
  hotSongs: SongInfo[];
  more: boolean;
}

const store = useStore();
const route = useRoute();

let hotSongDetail = ref<SongInfo[]>([]);
let offset = ref(0);
let show_more = ref();

const getArtAllSong = async () => {
  let res = (await getArtistHotSong(route.query.id)) as unknown as HotSong;
  hotSongDetail.value = res.hotSongs;
};

const playAllSong = (songs: any[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

onBeforeMount(() => {
  getArtAllSong();
});

// onMounted(() => {
//   let ob = new IntersectionObserver(async (changes) => {
//     let item = changes[0];
//     if (item.isIntersecting) {
//       offset.value += 1;
//       let res = await getArtistAllSongs(route.query.id, offset.value);
//       console.log(res);
//       res.songs.forEach((item) => {
//         hotSongDetail.value.push(item);
//       });
//     }
//   });
//   ob.observe(show_more.value);
// });
</script>

<style scoped lang="scss">
.songs_container {
  width: 100%;
  height: 100%;
  margin: 0 auto;

  .layout_head {
    font-size: 2.5rem;
    margin-left: 4rem;
    color: var(--color-text);
  }

  .data_actions {
    margin-top: 2rem;
    font-size: 14px;
    margin-left: 4rem;

    .mod_btn_blue {
      border-radius: 5px;
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
        transform: scale(1.05);
        transition: transform 0.3s ease-in-out;
        text-decoration: none;
      }

      &:active {
        transform: scale(0.95);
        transition: transform 0.3s ease-in-out;
        transform: scale(0.98);
      }
    }

    .mod_btn {
      border-radius: 5px;
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

  .song_list {
    width: 100%;
  }
}
</style>
