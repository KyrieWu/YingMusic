<template>
  <div class="content">
    <div class="item" v-for="item in mvList" :key="item.id">
      <router-link :to="{ path: '/mvDetail', query: { id: item.id } }">
        <div class="play">
          <div class="playIcon">
            <img
              src="https://y.qq.com/ryqq/static/media/cover_play@2x.53a26efb.png?max_age=2592000"
              alt=""
            />
          </div>
          <div class="img">
            <img :src="getImageUrl(item)" :alt="item.name" loading="lazy" />
          </div>
        </div>
      </router-link>

      <div class="discription">
        <router-link
          class="des_title"
          :to="{ path: '/mvDetail', query: { id: item.id } }"
          :title="item.name"
          >{{ item.name }}</router-link
        >
        <router-link
          v-if="item.artistName"
          :to="{ path: '/artistDetail', query: { id: item.artistId } }"
          style="font-size: 12px; opacity: 0.7"
          >{{ item.artistName }}</router-link
        >
        <div class="playCount" v-if="item.playCount">
          <span>播放量:&nbsp;{{ (item.playCount / 10000).toFixed(1) }}万</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "MVItem";
</script>
<script setup lang="ts">
export interface MVProps {
  id: number;
  name: string;
  picUrl: string;
  artistId: number;
  artistName?: string;
  playCount?: number;
}

const { mvList } = defineProps<{ mvList: MVProps[] }>();

const getImageUrl = (mv: any) => {
  let url = mv.imgurl16v9 ?? mv.cover ?? mv.coverUrl ?? mv.picUrl;
  return url?.replace("http://", "https://") + "?param=464y260";
};
</script>

<style scoped lang="scss">
.content {
  //height: 100%;
  display: flex;
  flex-wrap: wrap;
  //justify-content: center;

  .item {
    width: calc(100% / 5);
    //height: 25rem;
    margin-bottom: 5rem;

    .play {
      width: 100%;
      height: 80%;
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
          transform: scale(1);

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
        height: 95%;
        border-radius: 1rem;
        overflow: hidden;

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

        .img img {
          transform: scale(1.03);
          transition: transform 0.5s ease-in-out;
        }
      }
    }

    .discription {
      margin-top: 0.5rem;
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
        margin-bottom: 0.5rem;

        &:hover {
          text-decoration: underline;
        }
      }

      .playCount {
        margin-top: 0.5rem;
        font-size: 1.2rem;
        color: var(--color-text);
        opacity: 0.7;
      }
    }
  }

  &::after {
    content: "";
    display: block;
    clear: both;
  }
}

@media (max-width: 1500px) {
  .item {
    flex: unset;
  }
}
</style>
