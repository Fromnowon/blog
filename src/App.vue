<template>
    <div id="app">
        <keep-alive exclude="view-topic,edit-topic,Admin">
            <router-view class="router"/>
        </keep-alive>
    </div>
</template>

<script>

import '../static/css/index.css'

export default {
  name: 'App',
  data() {
    return {}
  },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    });
    //实时存储窗口尺寸
    window.addEventListener('resize', () => {
      this.$store.commit('setSize', {height: window.innerHeight, width: window.innerWidth});
    });
  },
  watch: {
    '$route'(to, from) {
      //console.log('现在路由:', to.path, '来自路由:', from.path);
    }
  },
  components: {},
}
</script>

<style>

    .el-dialog {
        min-width: 300px;
    }

    .ql-toolbar {
        background: white;
    }

    .ql-editor {
        background: white;
    }

    #nprogress .bar {
        z-index: 999;
    }

    /*::-webkit-scrollbar {*/
        /*width: 6px;*/
        /*height: 6px;*/
    /*}*/

    /*::-webkit-scrollbar-track {*/
        /*background: #f6f6f6;*/
        /*border-radius: 3px;*/
    /*}*/

    /*::-webkit-scrollbar-thumb {*/
        /*background: #aaa;*/
        /*border-radius: 3px;*/
    /*}*/

    /*::-webkit-scrollbar-thumb:hover {*/
        /*background: #747474;*/
    /*}*/

    /*::-webkit-scrollbar-corner {*/
        /*background: #f6f6f6;*/
    /*}*/

</style>
