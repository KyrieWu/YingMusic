<template>
  <header>
    <router-link to="/" style="text-decoration: none">
      <div class="navigation-logo">
        <img src="/music.png" alt="" />
        <p>YingMusic</p>
      </div>
    </router-link>

    <div class="naviagtion-links">
      <router-link to="/" :class="{ active: $route.name === 'home' }">{{ $t('header.home') }}</router-link>
      <router-link to="/allPlayList" :class="{ active: $route.meta.musicHall }">{{ $t('header.discover')
      }}</router-link>
      <router-link to="/library" :class="{ active: $route.name === 'library' }">{{ $t('header.profile') }}</router-link>
    </div>
    <div class="right-part">
      <div class="search-box">
        <div class="container" :class="{ active: inputFocus }">
          <div class="input">
            <input v-model="keyWord" type="search" :placeholder="inputFocus ? '' : '搜索'" @focus="inputFocus = true"
              @blur="inputFocus = false" @keydown="toSearch" />
          </div>
          <img src="../assets/icons/search.svg" />
        </div>
      </div>
      <img class="avator" :src="isLogin == true ? store.state.user?.avatarUrl : 'login.png'" alt="" loading="lazy"
        @click="showUserProfileMenu" />
    </div>
  </header>
  <context-menu ref="userProfileMenu">
    <div class="item">
      <img src="../assets/icons/settings.svg" alt="" />
      {{ $t('profile.userProfileMenu.settings') }}
    </div>

    <div v-if="!isLogin" class="item" @click="toLogin">
      <img src="../assets/icons/login.svg" alt="" />
      {{ $t('login.login') }}
    </div>

    <div v-if="isLogin" class="item" @click="toLogout">
      <img src="../assets/icons/logout.svg" alt="" />
      {{ $t('profile.userProfileMenu.logout') }}
    </div>
  </context-menu>
</template>

<script lang="ts">
name: "HeaderItem";
</script>
<script setup lang="ts">
import { reactive, toRefs, ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import ContextMenu from "./ContextMenu.vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const data = reactive({
  inputFocus: false,
  keyWord: "",
});

let isLogin = computed(() => {
  return store.state.isLogin
})

const toLogout = () => {
  store.dispatch('toLogout')
}

const userProfileMenu = ref();

const showUserProfileMenu = (e: MouseEvent) => {
  nextTick(() => {
    userProfileMenu.value.openMenu(e);
  });
};

const toSearch = async (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    store.dispatch("toSearch", { keyWord: keyWord.value, type: 1 });
    router.push({
      path: "/search",
      query: { keyWord: keyWord.value },
    });
  }
};

const toLogin = () => {
  router.push({
    path: "/login",
  });
}

const { inputFocus, keyWord } = toRefs(data);
</script>

<style scoped lang="scss">
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;

  padding: {
    right: 10vw;
    left: 10vw;
  }

  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  -webkit-app-region: drag;
}

@media (max-width: 1336px) {
  header {
    padding: 0 5vw;
  }
}

@supports (-moz-appearance: none) {
  header {
    background-color: var(--color-body-bg);
  }
}

.navigation-logo {
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    height: 50px;
    width: 50px;
    display: inline-block;
  }

  p {
    font-size: 18px;
    text-indent: 10px;
    user-select: none;
    font-weight: 700;
    display: inline-block;
  }
}

@media (max-width: 970px) {
  .navigation-logo {
    flex: unset;
  }
}

.naviagtion-links {
  flex: 2;
  display: flex;
  justify-content: center;
  user-select: none;
  padding-left: 21.5rem;

  a {
    -webkit-app-region: no-drag;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--color-text);
    transition: 0.2s;
    -webkit-user-drag: none;

    margin: {
      left: 12px;
      right: 12px;
    }

    &:hover {
      background: var(--color-secondary-bg-for-transparent);
    }

    &:active {
      transform: scale(0.92);
      transition: 0.2s;
    }
  }

  a.active {
    background: var(--color-primary-bg);
    color: var(--color-primary);
  }
}

.search-box {
  display: flex;
  justify-content: flex-end;

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
    width: 200px;

    img {
      height: 15px;
      width: 15px;
      color: var(--color-text);
      opacity: 0.28;

      margin: {
        left: 8px;
        right: 4px;
      }
    }

    input {
      font-size: 16px;
      border: none;
      background: transparent;
      width: 96%;
      font-weight: 600px;
      margin-left: 5px;
      margin-top: -1px;
      color: var(--color-text);
    }
  }

  .active {
    background: var(--color-secondary-bg-for-transparent);

    input,
    img {
      opacity: 1;
      color: var(--color-primary);
    }
  }
}

.right-part {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .avator {
    user-select: none;
    height: 30px;
    margin-left: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
