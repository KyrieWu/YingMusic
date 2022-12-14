<template>
  <div class="login-container">
    <div class="content">
      <div class="form-box" ref="formBox">
        <div class="login-box" ref="loginBox">
          <div class="login_icon">
            <img
              src="http://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg"
              alt=""
            />
          </div>
          <h2>登录网易云账号</h2>
          <div class="phoneNumber">
            <div class="img">
              <img src="@/assets/icons/mobile.svg" alt="" />
            </div>
            <input
              type="text"
              placeholder="手机号"
              v-model.trim="phone"
              @focus="showvaild(false)"
              @blur="checkPhone"
            />
            <div class="phone_vaild" v-show="showPhoneVaild">
              手机号码有误，请重填!
            </div>
          </div>
          <div class="password" v-if="logintype == 2">
            <div class="img"><img src="@/assets/icons/lock.svg" alt="" /></div>
            <input type="password" placeholder="密码" v-model="password" />
          </div>
          <div class="captcha" v-if="logintype == 1">
            <div class="img">
              <img src="@/assets/icons/验证码.png" alt="" />
            </div>
            <input type="text" placeholder="验证码" v-model="captcha" />
            <button
              type="button"
              :disabled="
                enable == false || phone.length == 0 || showPhoneVaild == true
              "
              class="timeout"
              @click="sendCode"
              :class="{
                disable:
                  enable == false ||
                  phone.length == 0 ||
                  showPhoneVaild == true,
              }"
            >
              {{ enable ? "发送验证码" : time }}
            </button>
            <div class="captcha_vaild" v-show="showCaptchaVaild">
              请输入手机号!
            </div>
          </div>
          <button @click="toLogin">登录</button>
        </div>
        <div class="logintype">
          <span @click="logintype = 2" v-show="logintype == 1">密码登录</span>
          <span @click="logintype = 1" v-show="logintype == 2">验证码登录</span>
        </div>
      </div>
    </div>
    <div class="notice">
      <p>
        YingMusic 承诺不会保存你的任何账号信息到云端。 你的密码会在本地进行 MD5
        加密后再传输到网易云 API。 YingMusic
        并非网易云官方网站，输入账号信息前请慎重考虑。
      </p>
    </div>
  </div>
</template>

<script lang="ts">
name: "LoginItem";
</script>
<script setup lang="ts">
import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Md5 } from "ts-md5";
import { getCaptcha } from "@/api/login";
import Message from "@/components/Message/index";

interface GETCaptcha {
  code: number;
  data: boolean;
}

const store = useStore();
const route = useRoute();
const router = useRouter();

const data = reactive({
  phone: "",
  password: "",
  captcha: "",
  logintype: 1,
  enable: true,
  time: "60s",
  showCaptchaVaild: false,
  showPhoneVaild: false,
});

const checkPhone = () => {
  if (data.phone.length > 0) {
    if (!/^1[3456789]\d{9}$/.test(data.phone)) {
      data.showPhoneVaild = true;
      return false;
    } else {
      data.showPhoneVaild = false;
      return true;
    }
  }
};

const showvaild = (isshow: boolean) => {
  data.showCaptchaVaild = isshow;
};

const toLogin = async () => {
  if (data.phone.length == 0) {
    Message({
      message: "请输入手机号!",
      type: "warn",
    });
    return;
  }

  let result = await store.dispatch("toLogin", {
    phone: data.phone,
    password: Md5.hashStr(data.password),
    captcha: data.captcha,
  });
  if (result) {
    store.dispatch("getLikeSongList");
    store.dispatch("getLikePlaylist");
    store.dispatch("getLikeAlbumlist");
    store.dispatch("getLikeMVlist");
    store.dispatch("getLikeArtlist");
    let from = route.query.from;
    if (from) {
      router.push(`${from}`);
      return;
    }
    router.push(`/`);
  }
};

const sendCode = async () => {
  try {
    // 检验手机号格式
    if (data.phone.length == 0) {
      showvaild(true);
      return;
    }
    // 发送验证码
    let res = (await getCaptcha(data.phone)) as unknown as GETCaptcha;
    if (res.code !== 200) {
      Message({
        message: "当前网络繁忙，请稍后再试哦~",
        type: "error",
      });
      return;
    }

    //开启倒计时
    data.enable = false;
    data.time = "60s";
    let n = 60;
    let timer = setInterval(() => {
      n--;
      if (n == 0) {
        clearInterval(timer);
        data.enable = true;
        return;
      }
      data.time = `${n}s`;
    }, 1000);
  } catch (err) {}
};

const {
  phone,
  password,
  captcha,
  logintype,
  enable,
  time,
  showCaptchaVaild,
  showPhoneVaild,
} = toRefs(data);
</script>

<style scoped lang="scss">
@media (max-width: 1500px) {
  .login-container {
    min-width: 1487px;
    display: block;
  }
}

.login-container {
  margin-top: 64px;
  padding-top: 8rem;
  width: 100vw;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .content {
    width: 100%;
    display: flex;
    justify-content: center;

    .form-box {
      background: transparent;
      width: 100%;
      border-radius: 10px;
      display: flex;
      //align-items: center;
      justify-content: center;
      flex-direction: column;
      transition: 0.5s ease-in-out;
      color: var(--color-text);

      .login-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        .login_icon {
          width: 8rem;
          height: 8rem;
          margin-bottom: 1rem;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        h2 {
          text-align: center;
          font-size: 2.4rem;
          margin-bottom: 4rem;
          letter-spacing: 5px;
        }

        .phoneNumber,
        .password {
          width: 25%;
        }

        .img {
          width: 4rem;
          height: 4.6rem;
          background: var(--color-secondary-bg-for-transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          float: left;
          margin: 8px 0;
          margin-left: 5rem;
          border-bottom-left-radius: 10px;
          border-top-left-radius: 10px;

          img {
            width: 2rem;
            height: 2rem;
            opacity: 0.6;
          }
        }

        input {
          background: var(--color-secondary-bg-for-transparent);
          width: 70%;
          border: none;
          padding: 1.16rem 0;
          margin: 8px 0;
          font-size: 18px;
          letter-spacing: 2px;
          color: var(--color-text);
          border-bottom-right-radius: 10px;
          border-top-right-radius: 10px;

          &:focus {
            outline: none;
            transition: 0.5s;
            color: var(--color-primary);
          }

          &:focus::placeholder {
            opacity: 0;
          }
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          appearance: none;
        }

        input[type="number"] {
          appearance: textfield;
        }

        button {
          width: 19.5%;
          margin-top: 35px;
          background-color: #f6f6f6;
          outline: none;
          border-radius: 8px;
          padding: 10px;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 2px;
          border: none;
          cursor: pointer;
          color: #fff;
          background-color: var(--color-primary);

          &:active {
            transform: scale(0.95);
          }

          &:hover {
            letter-spacing: 25px;
            text-indent: 25px;
          }
        }

        .phoneNumber {
          position: relative;
          margin-bottom: 1.5rem;

          .phone_vaild {
            position: absolute;
            bottom: -1.5rem;
            left: 5rem;
            font-size: 1.2rem;
            color: red;
          }
        }

        .captcha {
          display: flex;
          width: 25%;
          position: relative;

          input {
            width: 30%;
          }

          .timeout {
            position: absolute;
            top: 0;
            right: 5.4rem;
            width: 35%;
            height: 4.6rem;
            margin-top: 0.8rem;
            border-radius: 1rem;
            font-size: 1.8rem;
            text-align: center;
            color: #fff;

            &:hover {
              letter-spacing: 2px;
              text-indent: 0;
            }
          }

          .captcha_vaild {
            position: absolute;
            bottom: -1.5rem;
            left: 5rem;
            font-size: 1.2rem;
            color: red;
          }

          .disable {
            &:active {
              transform: scale(1);
            }
          }

          img {
            width: 2.5rem;
            height: 2.5rem;
            opacity: 0.6;
          }
        }
      }

      .logintype {
        margin-top: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--color-text);

        span {
          &:hover {
            color: var(--color-primary);
          }
        }
      }

      .hidden {
        display: none;
        transition: 0.5s;
      }
    }
  }

  .notice {
    width: 30rem;
    height: 10rem;
    border-top: 1px solid var(--color-secondary-bg-for-transparent);
    margin-top: 2rem;
    font-size: 1.2rem;
    opacity: 0.7;
  }
}
</style>
