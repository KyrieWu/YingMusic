<template>
  <div class="categorie-container">
    <div class="head" :class="{ active: store.state.cat === '全部' }" @click="updateCat('全部')">
      全部
    </div>
    <div class="open-btn" @click="isOpen = !isOpen" :class="{ active: isOpen === true }">
      ...
    </div>
    <div class="panel" v-if="isOpen">
      <div class="categorie-content" v-for="(item, index) in categories" :key="index">
        <div class="categories">{{ item }}</div>
        <div class="categories-list">
          <div class="item" v-for="(item, index2) in findItem(index)" :key="index2">
            <a class="item_name" :class="{ active: store.state.cat === `${item.name}` }"
              @click="updateCat(`${item.name}`)">{{ item.name }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
name: "PlayListCategories";
</script>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { getPlayListCategory } from "@/api/PlayList";
import { Categories, CategorieInfo } from "@/types/categories";
import { useStore } from "vuex";

interface Categorie {
  all: object
  categories: Categories
  code: number
  sub: CategorieInfo[]
}

interface Categories {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
}

const store = useStore();

let isOpen = ref(false);
let categories = ref<Categories>();
let categorieItems = ref<CategorieInfo[]>([]);

const findItem = (index: any): CategorieInfo[] => {
  index = Number(index);
  let items: CategorieInfo[] = categorieItems.value.filter(
    (item: CategorieInfo) => item.category == index
  );
  return items;
};

const getCategories = async () => {
  let res = await getPlayListCategory() as unknown as Categorie;
  categories.value = res.categories;
  categorieItems.value = res.sub;
};

const updateCat = (cat: string) => {
  store.commit("UPDATECAT", cat);
};

onBeforeMount(async () => {
  getCategories();
  updateCat("全部");
});
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .categorie-container {
    min-width: 1487px;
  }
}

.categorie-container {
  //height: 600px;
  width: 77.5%;
  // padding: {
  //   right: 15vw;
  //   left: 13vw;
  // }
  padding-top: 40px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 30px;

  .head {
    width: 7rem;
    height: 5rem;
    background-color: var(--color-secondary-bg);
    border-radius: 10%;
    font-size: 1.8rem;
    line-height: 5rem;
    text-align: center;
    font-weight: 600;
    user-select: none;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-primary-bg);
    }

    &:active {
      transform: scale(0.98);
      transition: transform 0.2s;
    }
  }

  .open-btn {
    width: 7rem;
    height: 5rem;
    background-color: var(--color-secondary-bg);
    border-radius: 10%;
    font-size: 3rem;
    text-align: center;
    font-weight: 600;
    user-select: none;
    cursor: pointer;
    position: absolute;
    left: 90px;
    top: 40px;
    letter-spacing: 3px;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-primary-bg);
    }

    &:active {
      transform: scale(0.98);
      transition: transform 0.2s;
    }
  }

  .active {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }

  .panel {
    margin-top: 10px;
    border-radius: 10px;
    padding: 20px;
    background-color: var(--color-secondary-bg);
    color: var(--color-text);

    .categorie-content {
      display: flex;
      margin-bottom: 32px;

      .categories {
        font-size: 24px;
        font-weight: 700;
        opacity: 0.68;
        margin-left: 24px;
        min-width: 54px;
        height: 26px;
      }

      .categories-list {
        margin-left: 24px;
        display: flex;
        flex-wrap: wrap;

        .item {
          user-select: none;

          display: flex;
          align-items: center;
          font-weight: 500;
          font-size: 16px;
          transition: 0.2s;
          min-width: 98px;

          .item_name {
            display: block;
            text-align: center;
            text-decoration: none;
            border-radius: 10px;
            padding: 5px;

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
        }
      }
    }
  }
}
</style>
