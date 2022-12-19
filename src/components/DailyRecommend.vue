<template>
  <div class="recomend_container">
    <div class="head">
      <h2>为你推荐</h2>
    </div>
    <div class="content">
      <div class="com_sons">
        <div class="com_bg" @click="godailysongDetail">
          <img :src="dailysongs[0]?.al.picUrl" alt="">
          <div class="com_text">每日推荐</div>
        </div>
        <div class="play_icon" @click="playAllSong">
          <img src="https://y.qq.com/ryqq/static/media/cover_play@2x.53a26efb.png?max_age=2592000" alt="">
        </div>
      </div>
      <div class="block"></div>
      <div class="person_FM">
        <div class="bg">
          <img :src="fmList[fmindex]?.album.picUrl" alt="">
        </div>
        <div class="left">
          <img :src="fmList[fmindex]?.album.picUrl" alt="">
        </div>
        <div class="middle">
          <span class="songname">{{ fmList[fmindex]?.name }}</span>
          <router-link :to="{ path: '/artistDetail', query: { id: fmList[fmindex]?.artists[0]?.id } }" class="artname">
            {{ fmList[fmindex]?.artists[0]?.name }}
          </router-link>
          <div class="playsong">
            <div class="playicon">
              <img src="@/assets/icons/播放 (2).png" alt="">
            </div>
            <div class="nextsong" @click="nextSong">
              <img src="@/assets/icons/下一曲.png" alt="">
            </div>
          </div>
        </div>
        <div class="right">
          <span>私人FM</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: 'DailyRecommend'
</script>
<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { getPersonalFm } from '@/api/home'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

interface PersonFM {
  code: number
  data: PerosnFMInfo[]
  popAdjust: boolean
}

const store = useStore()
const router = useRouter()

let fmList = ref<PerosnFMInfo[]>([])
let fmindex = ref(0)

const playAllSong = () => {
  store.commit("UPDATEPLAYLIST", dailysongs.value);
}

const godailysongDetail = () => {
  router.push('/dailysongsDetail')
}

const dailysongs = computed(() => {
  return store.state.dailyRecommendSongs
})

const playSong = (item: SongInfo): void => {
  store.commit("PLAYSONG", item);
};

const nextSong = async () => {
  if (fmindex.value >= fmList.value.length - 1) {
    let fmresult = await getPersonalFm() as unknown as PersonFM
    fmresult.data.forEach(item => {
      fmList.value.push(item)
    })
    //fmindex.value = 0
  } else {
    fmindex.value++
  }
}


onBeforeMount(async () => {
  store.dispatch('getDailyRecommendSongs')

  let fmresult = await getPersonalFm() as unknown as PersonFM
  fmresult.data.forEach(item => {
    fmList.value.push(item)
  })
})

</script>

<style scoped lang="scss">
@media (max-width:1500px) {
  .recomend_container {
    min-width: 1487px;
  }
}

.recomend_container {
  width: 100vw;
  height: 40rem;
  // background: url(https://y.qq.com/ryqq/static/media/bg_detail.bb32b2d1.jpg?max_age=2592000) 50% 0 repeat-x;

  .head {
    width: 100%;
    height: 16%;
    text-align: center;
    letter-spacing: 10px;

    h2 {
      line-height: 100px;
      font-size: 30px;
      color: var(--color-text);
    }
  }

  .content {
    width: 90%;
    height: 84%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;

    .com_sons {
      width: 42.5%;
      height: 70%;
      //margin-left: 18rem;
      position: relative;
      //overflow: hidden;
      //border-radius: 10px;
      cursor: pointer;
      border-radius: 1.5rem;
      overflow: hidden;

      .com_bg {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;


        img {
          width: 100%;
          //display: block;
          position: absolute;
          top: -10rem;
          left: 0;
          animation: move-y 38s infinite;
          animation-direction: alternate;
          z-index: -1;
        }

        .com_text {
          position: absolute;
          width: 14rem;
          font-size: 6rem;
          font-weight: 1000;
          color: #fff;
          bottom: 4rem;
          left: 2rem;
        }
      }

      .play_icon {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        z-index: 1;
        width: 5.8rem;
        height: 5.8rem;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: 100%;
          opacity: 0.6;
        }

        &:hover {
          img {
            opacity: 0.9;
          }
        }

        &:active {
          img {
            transform: scale(0.97);
          }
        }
      }
    }

    .block {
      width: 2%;
    }

    .person_FM {
      width: 42.5%;
      height: 70%;
      position: relative;
      border-radius: 1.5rem;
      overflow: hidden;

      .bg {
        width: 100%;
        height: 100%;
        z-index: -1;
        position: absolute;
        overflow: hidden;

        img {
          width: 200%;
          height: 500%;
          object-fit: cover;
          filter: blur(200px);
        }

      }

      .left {
        width: 18rem;
        height: 18rem;
        float: left;
        margin-top: 2.5rem;
        margin-left: 2rem;
        margin-right: 3rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5%;
        }
      }

      .middle {
        width: 42rem;
        height: 100%;
        float: left;
        display: flex;
        flex-direction: column;
        position: relative;

        .songname {
          font-size: 2.4rem;
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .artname {
          font-size: 1.4rem;
          color: #fff;
        }

        .playsong {
          width: 100%;
          height: 5rem;
          display: flex;
          position: absolute;
          bottom: 2.5rem;
          left: 0;
          //flex-direction: row;

          .playicon {
            height: 100%;
            width: 5rem;
            cursor: pointer;
            border-radius: 1rem;

            img {
              width: 100%;
              height: 100%;
            }

            &:hover {
              background-color: var(--color-secondary-bg-for-transparent);
            }

            &:active {
              transform: scale(0.97);
            }
          }

          .nextsong {
            height: 100%;
            width: 5rem;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 1rem;

            img {
              width: 90%;
              height: 90%;
            }

            &:hover {
              background-color: var(--color-secondary-bg-for-transparent);
            }

            &:active {
              transform: scale(0.97);
            }
          }
        }

      }

      .right {
        width: 8rem;
        height: 100%;
        float: right;
        position: relative;

        span {
          position: absolute;
          right: 2rem;
          bottom: 2.5rem;
          font-size: 1.6rem;
          font-weight: 600;
          color: #fff;
          //text-align: center;
          opacity: 0.5;
        }
      }
    }
  }

}

@keyframes move-y {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}
</style>