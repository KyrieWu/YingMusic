<template>
  <div class="content">
    <div class="item" v-for="item of artistsInfos" :key="item.id">
      <router-link :to="{ path: '/artistDetail', query: { id: item.id } }">
        <div class="play">
          <div class="img">
            <img v-lazy="item.picUrl" :alt="item.name" />
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
name: "ArtistItem";
</script>
<script setup lang="ts">
const { artistsInfos } = defineProps<{ artistsInfos: ArtistsInfo[] }>();
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
  //padding-top: 5rem;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 15%;
    height: 26rem;
    //float: left;
    margin-left: 2rem;
    margin-bottom: 3rem;
    border: 0.1px solid transparent;

    .play {
      width: 100%;
      height: 90%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;
      margin-bottom: 1rem;

      .img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:active {
          transform: scale(0.98);
        }
      }

      &:hover {
        .img img {
          transform: scale(1.03);
          transition: transform 0.5s ease-in-out;
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
</style>
