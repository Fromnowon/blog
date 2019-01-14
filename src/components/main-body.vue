<template>
    <div class="main_content">
        <div v-if="main_content_width>=1000" class="bg">
            <img v-for="src in bgImageUrl" ondragstart="return false" :src="src" alt="">
        </div>
        <div class="bg_content">
            <blogHeader></blogHeader>
            <div class="body_content">
                <el-row :gutter="20">
                    <el-col :md="16" style="position: relative">
                        <router-view></router-view>
                    </el-col>
                    <el-col :md="8" class="right">
                        <!--预留评论等其他内容-->
                        <el-card shadow="hover" class="right_card">
                            <div>
                                <div class="nav_search">
                                    <el-input suffix-icon="el-icon-search" placeholder="搜索"
                                              @keydown.enter.native="onSearch"></el-input>
                                </div>
                                <div>
                                    <p style="color: lightgrey">这里放点啥呢</p>
                                </div>
                            </div>
                        </el-card>
                        <p></p>
                    </el-col>
                </el-row>
            </div>

            <blogFooter></blogFooter>
        </div>
    </div>
</template>

<script>
import aboutMe from './about-me'
import blogHeader from './header'
import blogFooter from './footer'

export default {
  name: "main_body",
  data() {
    return {
      test: [1, 2, 3, 4, 5],
      controller: 1,
      bgImageUrl: ['./static/images/bg/bg-1.jpg', './static/images/bg/bg-2.jpg', './static/images/bg/bg-3.jpg'],
    }
  },
  watch: {
    $route(to, from) {
      if (from.path === '/admin') {
        this.$forceUpdate();
      }
    },
  },
  computed: {
    main_content_width() {
      //获取body宽度，以决定是否显示壁纸
      try {
        return this.$store.state.win_size.width;
      } catch (e) {
        return window.innerWidth;
      }
    }
  },
  mounted() {
    let vm = this;
    //监听滚动事件
    document.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    onSearch() {
      this.$notify.error({
        title: '错误',
        message: '此功能施工中'
      });
    },
    handleScroll() {
      //由于事件绑定在文档之上，所以需要判断当前路由
      let vm = this;
      if (vm.$route.matched[0].path !== '/index' || this.main_content_width < 1000) {
        //若不在index路由下直接返回
        return;
      }
      if (vm.controller) {
        vm.controller = 0;
        setTimeout(function () {
          try {
            if (vm.$util.isScrollOver('header')) {
              vm.$util.getDomByClass('bg')[0].style.top = '-' + vm.$util.getDomByClass('bg')[0].children[1].height + 'px';
              if (vm.$util.isVisible('footer')) {
                //看见footer了
                vm.$util.getDomByClass('bg')[0].style.top = '-' + vm.$util.getDomByClass('bg')[0].children[2].offsetTop + 'px';
              } else {
                vm.$util.getDomByClass('bg')[0].style.top = '-' + vm.$util.getDomByClass('bg')[0].children[1].height + 'px';
              }
            }
            else {
              vm.$util.getDomByClass('bg')[0].style.top = 0;
            }
          }
          catch (e) {
            console.log(e);
          }
          vm.controller = 1;
        }, 300);
      }
    }
  },
  components: {
    aboutMe,
    blogHeader,
    blogFooter
  },
  beforeDestroy() {
    //跳转前销毁监听
    document.removeEventListener('scroll', this.handleScroll, false);
  }
}
</script>

<style scoped>
    .bg {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: top 1s;
    }

    .bg > img {
        margin: -10px;
        height: 110%;
        width: 110%;
        /*filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=3, MakeShadow=false);*/
        /*-webkit-filter: blur(3px);*/
        /*-moz-filter: blur(3px);*/
        /*-ms-filter: blur(3px);*/
        /*filter: blur(3px);*/
    }

    .bg_content {
        position: relative;
        z-index: 10;
        background: white;
    }

    .main_content {
        max-width: 1000px;
        margin: 0 auto;
    }

    .body_content {
        padding: 20px;
        background: whitesmoke;
        min-height: 600px;
    }

    .right_card {
        min-height: 200px;
    }


</style>