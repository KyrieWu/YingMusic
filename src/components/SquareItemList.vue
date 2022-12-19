<template>
  <div class="content">
    <div class="item" v-for="item in squareItems" :key="item.id">

      <div class="play">
        <div class="playIcon">
          <img src="https://y.qq.com/ryqq/static/media/cover_play@2x.53a26efb.png?max_age=2592000" alt=""
            @click="playAllSong(item)" />
        </div>
        <div class="img">
          <router-link :to="{ path: item.routerPath, query: { id: item.id } }">
            <img v-lazy="item.picUrl" :alt="item.name" />
          </router-link>
        </div>
      </div>

      <div class="discription">
        <router-link class="des_title" :to="{ path: item.routerPath, query: { id: item.id } }" :title="item.name">{{
            item.name
        }}</router-link>
        <router-link v-if="item.artistName && item.artistId"
          :to="{ path: '/artistDetail', query: { id: item.artistId } }" style="font-size: 12px; opacity: 0.7">{{
              item.artistName
          }}</router-link>
        <div class="playcount" v-if="item.playCount">
          播放量:&nbsp;{{ (item.playCount / 10000).toFixed(1) }}万
        </div>
        <div class="publishTime" v-if="item.publishTime">
          {{ timestampToDate(item.publishTime) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "SquareItemList";
</script>
<script setup lang="ts">
import { timestampToDate } from "@/utils/utils";
import { getSongListInfo } from "@/api/PlayList";
import { useStore } from 'vuex'
import { ref } from 'vue'
import { getAltumDetail } from "@/api/altum";

interface AltumDetail {
  album: AlbumInfo,
  code: number
  resourceState: boolean
  songs: SongInfo[]
}

const store = useStore()

const { squareItems } = defineProps<{ squareItems: SquareItemProps[] }>();

let trackInfos = ref<SongInfo[]>([])

const playAllSong = async (item: SquareItemProps) => {
  if (item.routerPath == "/songlistDetail") {
    let playlistRes = await getSongListInfo(item.id) as unknown as Songlist;
    trackInfos.value = playlistRes.playlist.tracks.slice(0, 10);
  }

  if (item.routerPath == "/altumDetail") {
    let albumRes = await getAltumDetail(item.id) as unknown as AltumDetail;
    trackInfos.value = albumRes.songs;
  }

  store.commit("UPDATEPLAYLIST", trackInfos.value);
};
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .item {
    flex: unset;
  }
}

.content {
  width: 100%;
  height: 90%;
  margin: 0 auto;
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .item {
    width: 19%;
    height: 25.7rem;
    margin-left: 1rem;
    margin-bottom: 10rem;


    .play {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;

      .playIcon {
        width: 6rem;
        height: 6rem;
        position: absolute;
        z-index: 5;
        top: 10rem;
        opacity: 0;
        transform: scale(0.5);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          color: #fff;
          opacity: 0.8;

          &:hover {
            opacity: 1;
          }

          &:active {
            transform: scale(0.97);
          }
        }
      }

      .img {
        width: 95%;
        height: 100%;
        border-radius: 5%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &:hover {
        .playIcon {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }

        .img img {
          box-shadow: 0px 5px 8px 8px rgba(0, 0, 0, 0.1);
          transform: scale(1.03);
          transition: transform 0.5s ease-in-out;
        }
      }
    }

    .discription {
      margin-left: 1rem;
      width: 85%;
      color: var(--color-text);

      .des_title {
        height: 2rem;
        width: 100%;
        font-size: 16px;
        line-height: 2rem;
        font-weight: 600;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 1rem;

        &:hover {
          text-decoration: underline;
        }
      }

      .publishTime {
        font-size: 12px;
        color: var(--color-text);
        opacity: 0.7;
      }

      .playcount {
        font-size: 12px;
        color: var(--color-text);
        opacity: 0.7;
      }
    }
  }
}

.content::after {
  content: "";
  display: block;
  clear: both;
}
</style>
