<template>
    <div class="up" @click="goTop" v-show="show">
        <i class="el-icon-caret-top"></i>
    </div>
</template>

<script>
export default {
  name: "toTop",
  data() {
    return {
      show: false,
      scrollValue: 0,//滚动距离
    }
  },
  methods: {
    goTop() {
      window.scrollTo(0, 0);
    },
    toTopScroll() {
      this.show = !((document.documentElement.scrollTop || document.body.scrollTop) < 100);
    },
  },
  mounted() {
    //监听滚动
    window.addEventListener('scroll', this.toTopScroll, false);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.toTopScroll);
  }
}
</script>

<style scoped>
    .up {
        background-color: #fff;
        position: fixed;
        right: 5%;
        bottom: 10%;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
        transition: .3s;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
        z-index: 999
    }

    .up i {
        color: #409eff;
        display: block;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
    }
</style>
