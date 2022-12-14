<template>
  <transition name="message-fade">
    <div class="message">
      <div class="content error" ref="content" v-if="type == 'error'">
        <img src="@/assets/icons/错误.png" alt="">
        {{ message }}
      </div>
      <div class="content warn" ref="content" v-if="type == 'warn'">
        <img src="@/assets/icons/警告.png" alt="">
        {{ message }}
      </div>
    </div>
  </transition>

</template>

<script lang="ts">
name: 'MessageItem'
</script>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: "Message",
  },
  type: {
    type: String,
    default: "type",
  }
})
let content = ref()

onMounted(() => {
  content.value.style.marginLeft = `-${(props.message.length / 2) * 14 + 30}` + 'px'
})
</script>

<style scoped lang="scss">
.message {
  position: fixed;
  width: 100%;
  top: 6.4rem;
  left: 0;
  z-index: 999;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 0.5rem;
    font-size: 1.4rem;
    padding: 1.5rem 3rem;
    display: flex;

    img {
      width: 1.8rem;
      height: 1.8rem;
      margin-right: 1rem;
    }
  }

  .error {
    background-color: rgba(245, 108, 108, 0.1);
    color: #f56c63;
  }

  .warn {
    color: #e6a23c;
    background-color: #fdf6ec;
  }
}

.message-fade-enter-from,
.message-fade-enter-to {
  opacity: 0;
}

.message-fade-enter-active {
  transition: opacity 0.2s ease-in;
}

.message-fade-leave-active {
  transition: opacity 0.2s ease-out;
}
</style>