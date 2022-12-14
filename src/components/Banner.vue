<template>
  <!-- 轮播图主体 -->
  <div class="swipe" ref="swipe">
    <!-- 模糊背景 -->
    <div class="bg" ref="swipe_bg"></div>
    <section>
      <div class="img-box" ref="swipe_img_box">
        <a class="link" ref="swipe_link">
          <img src="" alt="" class="image" ref="swipe_img" />
        </a>
      </div>
      <div class="select" ref="swipe_select"></div>
      <div class="btn left" ref="swipe_btn_left">
        <i class="fa fa-angle-left" aria-hidden="true"></i>
      </div>
      <div class="btn right" ref="swipe_btn_right">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
name: "Banner";
</script>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { Banners } from "../types/banners";
import { Swiper } from "../utils/swiper";
import { getBanner } from "../api/other";

const swipe = ref();
const swipe_bg = ref();
const swipe_img_box = ref();
const swipe_link = ref();
const swipe_img = ref();
const swipe_select = ref();
const swipe_btn_left = ref();
const swipe_btn_right = ref();

const swiper = new Swiper({
  swipe,
  swipe_bg,
  swipe_img_box,
  swipe_link,
  swipe_img,
  swipe_select,
  swipe_btn_left,
  swipe_btn_right,
});

onBeforeMount(async () => {
  let bannerData = (await getBanner()) as unknown as Banners;
  swiper.initData(bannerData.banners);
  console.log(bannerData);
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .swipe {
    min-width: 1430px;
  }
}
.swipe {
  width: 100vw;
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #fff;

  .bg {
    position: absolute;
    width: 500%;
    height: 100%;
    z-index: 1;
    background-size: 6000px;
    background-position: center center;
    filter: blur(70px);
  }

  section {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1500px;
    height: 100%;
    margin: 0 auto;
  }

  .img-box {
    width: 1080px;
    height: 400px;
    margin: 0 auto;

    img {
      width: 100%;
      height: 100%;

      object-fit: cover;
    }
  }

  .select {
    position: absolute;
    width: 100%;
    height: 30px;
    line-height: 30px;
    bottom: 10px;
    text-align: center;

    .checked {
      background-color: #ff4400;
    }
  }

  .btn {
    width: 60px;
    height: 100px;
    color: #fff;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 50px;
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  .btn.left {
    left: -10px;
  }
  .btn.right {
    right: -10px;
  }
}

@media screen and (max-width: 1500px) {
  .swipe .btn.left {
    left: 20px;
  }
  .swipe .btn.right {
    right: 20px;
  }
}
</style>
