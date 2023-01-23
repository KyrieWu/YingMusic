<template>
  <div class="allMV_container">
    <div class="head">
      <div class="panel">
        <div class="categorie_content">
          <div class="categories">地区</div>
          <div class="categories_list">
            <div class="item">
              <a
                class="item_name"
                :class="{ active: area === '' }"
                @click="area = ''"
                >热门</a
              >
            </div>
            <div class="item" v-for="(item, index) in mvArea" :key="index">
              <a
                class="item_name"
                :class="{ active: area === `${item}` }"
                @click="area = `${item}`"
                >{{ item }}</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="categorie_content">
          <div class="categories">分类</div>
          <div class="categories_list">
            <div class="item">
              <a
                class="item_name"
                :class="{ active: type === '' }"
                @click="type = ''"
                >热门</a
              >
            </div>
            <div class="item" v-for="(item, index) in mvType" :key="index">
              <a
                class="item_name"
                :class="{ active: type === `${item}` }"
                @click="type = `${item}`"
                >{{ item }}</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="order_panel">
        <div class="order" :class="{ active: order == '' }" @click="order = ''">
          上升最快
        </div>
        <div
          class="order"
          :class="{ active: order == item }"
          v-for="item in mvOrder"
          :key="item"
          @click="order = item"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title">全部MV:</div>
      <m-v-item :mv-list="mvList"></m-v-item>
    </div>
    <div ref="show_more" v-show="mvList.length !== 0">
      <lazy-more></lazy-more>
    </div>
  </div>
</template>

<script lang="ts">
name: "AllMVLList";
</script>
<script setup lang="ts">
import { getAllMV } from "@/api/mv";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { mvArea, mvType, mvOrder } from "@/utils/mv";
import MVItem, { MVProps } from "@/components/MVItem.vue";
import LazyMore from "@/components/LazyMore.vue";

interface ALLMvResult {
  code: number;
  count: number;
  data: MVInfo[];
  hasMore: boolean;
}

let area = ref("");
let type = ref("");
let order = ref("");
let artistmvs = ref<MVInfo[]>([]);
let mvList = ref<MVProps[]>([]);
let offset = ref(0);
let show_more = ref();

watch(
  () => area.value,
  () => {
    getMVS();
  }
);
watch(
  () => type.value,
  () => {
    getMVS();
  }
);
watch(
  () => order.value,
  () => {
    getMVS();
  }
);

const getMVS = async () => {
  offset.value = 0;
  let res = (await getAllMV(
    area.value,
    type.value,
    order.value,
    offset.value
  )) as unknown as ALLMvResult;
  artistmvs.value = res.data;
  mvList.value = [];
  addMVList();
};

const addMVList = () => {
  artistmvs.value.forEach((item) => {
    mvList.value.push(
      Object.freeze({
        id: item.id,
        name: item.name,
        picUrl: item.cover,
        artistId: item.artistId,
        artistName: item.artistName,
        playCount: item.playCount,
      })
    );
  });
};

onBeforeMount(() => {
  getMVS();
});

onMounted(() => {
  let ob = new IntersectionObserver(async (changes) => {
    let item = changes[0];
    if (item.isIntersecting) {
      offset.value += 1;
      let res = await getAllMV(
        area.value,
        type.value,
        order.value,
        offset.value
      );
      artistmvs.value = res.data;
      addMVList();
    }
  });
  ob.observe(show_more.value);
});
</script>

<style scoped lang="scss">
.allMV_container {
  margin-top: 138px;
  padding: {
    top: 1rem;
    left: 10vw;
    right: 10vw;
    bottom: 10rem;
  }
  .head {
    width: 100%;
    position: relative;

    .panel {
      width: 100%;
      padding: 1rem;

      //background-color: var(--color-secondary-bg);
      color: var(--color-text);

      .categorie_content {
        display: flex;

        .categories {
          font-size: 24px;
          font-weight: 700;
          opacity: 0.68;
          min-width: 24px;
          height: 26px;
        }

        .categories_list {
          margin-left: 3rem;
          display: flex;
          flex-wrap: wrap;

          .item {
            user-select: none;
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 16px;
            transition: 0.2s;
            min-width: 50px;
            margin-left: 3rem;

            .item_name {
              display: block;
              text-align: center;
              text-decoration: none;
              border-radius: 10px;
              padding: 5px;
              padding-right: 10px;
              padding-left: 10px;

              &:hover {
                background-color: var(--color-primary-bg);
                color: var(--color-primary);
              }

              &:active {
                transform: scale(0.98);
                transition: transform 0.2s;
              }
            }
          }

          .active {
            color: var(--color-primary);
            background-color: var(--color-primary-bg);
          }
        }
      }
    }

    .order_panel {
      position: absolute;
      display: flex;
      right: 0;
      top: 14rem;

      .order {
        width: 5rem;
        height: 3.5rem;
        border: 1px solid #c9c9c9;
        font-size: 1.4rem;
        text-align: center;
        line-height: 3.5rem;
        color: var(--color-text);
        cursor: pointer;

        &:first-child {
          width: 7rem;
          border-right: none;
        }

        &:nth-child(3) {
          border-left: none;
        }
      }

      .active {
        color: var(--color-primary);
        background-color: var(--color-primary-bg);
      }
    }
  }

  .content {
    .title {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--color-text);
      margin-left: 1rem;
      margin-top: 5rem;
      margin-bottom: 2rem;
    }
  }
}
@media (max-width: 1336px) {
  .allMV_container {
    padding: 0 5vw;
  }
}

@media (max-width: 1500px) {
  .allMV_container {
    min-width: 1492px;
  }
}
</style>
