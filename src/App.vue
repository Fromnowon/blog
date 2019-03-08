<template>
    <div id="app">
        <keep-alive exclude="view-topic,edit-topic">
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
            let vm = this;
            //在页面加载时读取sessionStorage里的状态信息
            if (sessionStorage.getItem("store")) {
                vm.$store.replaceState(Object.assign({}, vm.$store.state, JSON.parse(sessionStorage.getItem("store"))))
            }

            //在页面刷新时将vuex里的信息保存到sessionStorage里
            window.addEventListener("beforeunload", () => {
                sessionStorage.setItem("store", JSON.stringify(vm.$store.state))
            });
            //实时存储窗口尺寸
            ['load', 'resize'].forEach(function (item, index) {
                window.addEventListener(item, vm.$util.debounce(() => {
                    vm.$store.commit('setSize', {height: window.innerHeight, width: window.innerWidth});
                }, 500));
            });

        },
    }
</script>

<style>

    #app {
        /*background: #f5f6f7;*/
    }

    .ql-editor {
        background: white;
    }

    #nprogress .bar {
        z-index: 9999;
    }

    .hidden {
        display: none;
    }

    .el-loading-mask {
        background-color: white !important;
    }

</style>
