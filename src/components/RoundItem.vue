<template>
  <div class="roundItem_content">
    <div class="item" v-for="item of artistsInfos" :key="item.id">
      <router-link :to="{ path: '/artistDetail', query: { id: item.id } }">
        <div class="play">
          <div class="img">
            <img :src="getImageUrl(item)" :alt="item.name" loading="lazy" />
          </div>
        </div>
      </router-link>
      <div class="discription">
        <router-link :to="{ path: '/artistDetail', query: { id: item.id } }">{{
          item.name
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "RoundItem";
</script>
<script setup lang="ts">
const { artistsInfos } = defineProps<{ artistsInfos: ArtistsInfo[] }>();

const getImageUrl = (item: any) => {
  if (item.img1v1Url) {
    let img1v1ID = item.img1v1Url.split("/");
    img1v1ID = img1v1ID[img1v1ID.length - 1];
    if (img1v1ID === "5639395138885805.jpg") {
      // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
      return "https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512";
    }
  }
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace("http://", "https://")}?param=512y512`;
};
</script>

<style scoped lang="scss">
.roundItem_content {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: calc(100% / 6);
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
      margin-bottom: 1rem;

      .img {
        overflow: hidden;
        border-radius: 50%;

        transition: box-shadow 0.5s ease-in-out;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        &:hover {
          background-color: transparent;
          box-shadow: 0px 5px 8px 8px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.5s ease-in-out;
        }
        &:active {
          transform: scale(0.98);
        }
      }
    }

    .discription {
      margin-left: 20px;
      width: 85%;
      font-size: 16px;
      line-height: 20px;
      font-weight: 600;
      display: block;
      text-align: center;
      color: var(--color-text);

      a:hover {
        text-decoration: underline;
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
