<template>
  <!-- 排行榜 -->
  <div class="toplist-container">
    <div class="head">
      <h2>{{ $t("home.charts") }}</h2>
      <div class="showAll">
        <router-link to="/allTopList" style="letter-spacing: normal">{{
          $t("home.seeMore")
        }}</router-link>
      </div>
    </div>
    <div class="content">
      <div
        class="item"
        v-for="(head, index) in topMusicList.keys()"
        :key="index"
      >
        <div class="bg" :style="backColorList[index]"></div>
        <div class="play">
          <div class="playIcon" @click="playAllSong(topMusicList.get(head))">
            <img
              src="https://y.qq.com/ryqq/static/media/cover_play@2x.53a26efb.png?max_age=2592000"
              alt=""
            />
          </div>
        </div>
        <i class="line"></i>
        <div class="head">
          <a>{{ head }}</a>
        </div>
        <div class="discription">
          <ol class="songlist">
            <li
              v-for="item in topMusicList.get(head).slice(0, 5)"
              :key="item.id"
            >
              <a @click="toSongDetail(item)" class="songname">{{ item.name }}</a
              ><br />
              <router-link
                :to="{
                  path: '/artistDetail',
                  query: { id: item.ar[0].id },
                }"
                class="artistname"
              >
                {{ item.ar[0].name }}</router-link
              >
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "TopLIST";
</script>
<script setup lang="ts">
import { getTopList, getPlayListTrack } from "@/api/home";
import { onBeforeMount, ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

let topListInfo = ref<TopListInfo[]>([]);
let topMusicList = ref(new Map());

const data = reactive({
  backColorList: [
    "background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
    "background-image: linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);",
    "background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);",
    "background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);",
    "background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);",
  ],
});

const playAllSong = (songs: SongInfo[]): void => {
  store.commit("UPDATEPLAYLIST", songs);
};

const toSongDetail = (item: SongInfo) => {
  router.push({
    path: "/songDetail",
    query: { id: item.id },
  });
  sessionStorage.setItem(`${item.id}`, JSON.stringify(item));
};

onBeforeMount(async () => {
  let res = await getTopList();
  topListInfo.value = res.list.slice(0, 5);
  for (let i = 0; i < topListInfo.value.length; i++) {
    let result = await getPlayListTrack(topListInfo.value[i].id, 20);
    topMusicList.value.set(topListInfo.value[i].name, result.songs);
  }
});

const { backColorList } = toRefs(data);
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .toplist-container {
    min-width: 1487px;
  }

  .item {
    float: none;
  }
}

.toplist-container {
  width: 100vw;
  height: 70rem;
  // background: url(https://y.qq.com/ryqq/static/media/bg_detail.bb32b2d1.jpg?max_age=2592000) 50% 0 repeat-x;

  .head {
    width: 100%;
    height: 16%;
    text-align: center;
    position: relative;

    h2 {
      line-height: 100px;
      font-size: 30px;
    }

    .showAll {
      position: absolute;
      top: 50px;
      right: 270px;
      font-size: 16px;
      color: var(--color-text);

      a {
        text-decoration: none;

        &:hover {
          color: var(--color-primary);
        }
      }
    }
  }

  .content {
    width: 90%;
    height: 84%;
    margin: 0 auto;
    display: flex;
    margin-left: 17rem;

    .item {
      display: block;
      width: 16.5%;
      height: 100%;
      //float: left;
      margin-left: 2rem;
      border: 0.1px solid transparent;
      position: relative;
      z-index: 0;

      .bg {
        height: 90%;
        width: 100%;
        position: absolute;
        z-index: -1;
        border-radius: 1rem;
      }

      .playIcon {
        width: 60px;
        height: 60px;
        position: absolute;
        z-index: 3;
        top: 110px;
        left: 40%;
        opacity: 0;
        transform: scale(0.5);

        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
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

      &:hover {
        .playIcon {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
      }

      .line {
        position: absolute;
        left: 40%;
        top: 130px;
        width: 50px;
        height: 2px;
        background-color: #000;
      }

      .head {
        position: absolute;
        top: 50px;

        a {
          letter-spacing: 5px;
          font-size: 28px;
          font-weight: 600;
          text-decoration: none;
          color: var(--color-text);
        }
      }

      .discription {
        position: absolute;
        margin-left: 10px;
        font-size: 15px;
        line-height: 20px;
        font-weight: 500;
        display: block;
        z-index: 5;
        color: var(--color-text);
        top: 160px;

        li {
          margin-top: 15px;

          a {
            text-decoration: none;
          }
        }
      }
    }

    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }
}
</style>
