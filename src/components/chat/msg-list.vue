<template>
    <div v-if="data.type=='receive'" class="msg_div left">
        <img v-bind:src="avatar_src" alt="">
        <div>
            <span class="date">{{ data.date }}</span>
            <p v-html="data.content"></p>
        </div>
    </div>
    <div v-else class="msg_div right">
        <div>
            <span class="date">{{ data.date }}</span>
            <p v-html="data.content"></p>
        </div>
        <img v-bind:src="avatar_src" alt="">
    </div>
</template>

<script>
export default {
  name: "msg-list",
  props: [
    'data',
  ],
  data() {
    return {
      avatar_src: require("../../../static/images/icon.png"),
    }
  },
  mounted() {
    //读取头像
    if (!this.data.avatar) {
      //user
      this.avatar_src = require("../../../static/images/icon.png");
    } else {
      this.avatar_src = require("../../../static/images/icon.png");
    }
    //通知父组件
    this.$emit('loaded');
  }
}
</script>

<style scoped>
    .msg_div {
        display: flex;
    }

    .msg_div img {
        height: 64px;
        width: 64px;
    }

    .left > div {
        margin-left: 20px;
    }

    .right > div {
        margin-right: 20px;
    }

    .right {
        justify-content: flex-end;
        text-align: right;
    }
</style>