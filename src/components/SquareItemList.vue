<template>
  <div class="content">
    <div class="item" v-for="item in squareItems" :key="item.id">
      <div class="play">
        <div class="playIcon">
          <img
            src="https://y.qq.com/ryqq/static/media/cover_play@2x.53a26efb.png?max_age=2592000"
            alt=""
            @click="playAllSong(item)"
          />
        </div>
        <div class="img">
          <router-link
            v-if="item.routerPath"
            :to="{ path: item.routerPath, query: { id: item.id } }"
          >
            <img :src="getImageUrl(item)" :alt="item.name" loading="lazy" />
          </router-link>
          <a v-else>
            <img :src="getImageUrl(item)" :alt="item.name" loading="lazy" />
          </a>
        </div>
      </div>

      <div class="discription">
        <router-link
          v-if="item.routerPath"
          class="des_title"
          :to="{ path: item.routerPath, query: { id: item.id } }"
          :title="item.name"
          >{{ item.name }}</router-link
        >
        <a v-else class="des_title" :title="item.name">
          {{ item.name }}
        </a>
        <router-link
          v-if="item.artistName && item.artistId"
          :to="{ path: '/artistDetail', query: { id: item.artistId } }"
          style="font-size: 12px; opacity: 0.7"
          >{{ item.artistName }}</router-link
        >
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
import { useStore } from "vuex";
import { ref } from "vue";
import { getAltumDetail } from "@/api/altum";

interface AltumDetail {
  album: AlbumInfo;
  code: number;
  resourceState: boolean;
  songs: SongInfo[];
}

const store = useStore();

const { squareItems } = defineProps<{ squareItems: SquareItemProps[] }>();

let trackInfos = ref<SongInfo[]>([]);

const playAllSong = async (item: SquareItemProps) => {
  if (item.routerPath == "/songlistDetail") {
    let playlistRes = (await getSongListInfo(item.id)) as unknown as Songlist;
    trackInfos.value = playlistRes.playlist.tracks.slice(0, 10);
  }

  if (item.routerPath == "/altumDetail") {
    let albumRes = (await getAltumDetail(item.id)) as unknown as AltumDetail;
    trackInfos.value = albumRes.songs;
  }

  store.commit("UPDATEPLAYLIST", trackInfos.value);
};

const getImageUrl = (item: any) => {
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace("http://", "https://")}?param=512y512`;
};
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: calc(100% / 5);
    margin-bottom: 5rem;

    .play {
      width: 100%;
      height: 90%;
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
        top: 50%;
        left: 50%;
        margin-top: -3rem;
        margin-left: -3rem;
        opacity: 0;
        transform: scale(0.5);

        img {
          width: 100%;
          height: 100%;
          overflow-clip-margin: content-box;
          overflow: clip;
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
        transition: box-shadow 0.5s ease-in-out;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1);
          transition: transform 0.5s ease-in-out;
        }
      }

      &:hover {
        .playIcon {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }

        .img {
          box-shadow: 0px 5px 8px 8px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.5s ease-in-out;
          img {
            transform: scale(1.03);
            transition: transform 0.5s ease-in-out;
          }
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
        margin-bottom: 0.5rem;

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

@media (max-width: 1500px) {
  .item {
    flex: unset;
  }
}
</style>
