<template>
    <div class="main_content">
        <el-container>
            <el-aside
                    :style="{ marginLeft:isCollapse?'-320px':'0',transition:'margin 0.5s',textAlign:'unset',position:'fixed',zIndex:9999,height:'100%'}">
                <i class="el-icon-close menuBtn" style="top: 10px;right: 14px;font-size: 22px;color: white"
                   @click="isCollapse=!isCollapse"></i>
                <NavBar @closeMenu="isCollapse=true"></NavBar>
            </el-aside>
            <div style="width: 100%" @click="closeMenuByClick">
                <el-header :style="{ top:headerShow?'0':'-70px',zIndex: 9998 }"
                           :class="[ scrollValue===0?'header-top':'' ] ">
                    <div style="max-width: 960px;margin: 0 auto;display: flex">
                        <el-button style="height: 32px;align-self: center" size="small"
                                   @click.stop="isCollapse=!isCollapse"
                                   round class="navBtn">
                            <i class="fa fa-navicon"></i>
                            &nbsp;菜单
                        </el-button>
                        <el-input size="small" suffix-icon="el-icon-search" placeholder="搜索"
                                  v-model="searchKey"
                                  :maxlength="16"
                                  class="navSearch"
                                  @keydown.enter.native="onSearch"
                                  style="max-width: 200px;margin-left: auto">
                        </el-input>
                    </div>
                </el-header>
                <el-main class="main_item">
                    <router-view style="min-height: 640px"></router-view>
                </el-main>
                <blog-footer></blog-footer>
            </div>
        </el-container>
        <ToTop></ToTop>
    </div>
</template>

<script>
import aboutMe from './about-me'
import blogHeader from './login'
import blogFooter from './footer'
import NavBar from "./nav-bar";
import ToTop from "./other/toTop";
import Category from "./category-page";

export default {
  name: "main_body",
  data() {
    return {
      isCollapse: true,//侧栏状态
      commentPreviewLength: 30,//评论预览长度
      scrollValue: 0,//滚动距离
      headerShow: true,//顶部显隐
      topBtn: false,//回到顶部按钮
      searchKey: '',//搜索关键词
    }
  },
  watch: {
    $route(to, from) {
      if (from.path === '/admin') {
        this.$forceUpdate();
      }
    },
    scrollValue(newValue, oldValue) {
      if (oldValue > newValue) {
        //上滚
        this.headerShow = true;
      } else {
        //下滚
        if (newValue > 70) {
          this.headerShow = false;
        }
      }
    },
  },
  mounted() {
    //ie警告
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      this.$alert('您正在使用IE浏览器，可能会遇到兼容性问题', '注意', {
        confirmButtonText: '好的',
        type: 'error',
        center: true
      });
    }
  },
  methods: {
    scroll() {
      //滚动监听
      //关闭侧栏
      if (!this.isCollapse) {
        this.isCollapse = true;
        this.$util.getDomByClass('navBtn')[0].blur();
      }
      this.scrollValue = document.documentElement.scrollTop || document.body.scrollTop;
      this.topBtn = !(this.scrollValue < 100);
    },
    closeMenuByClick() {
      //点击关闭侧栏
      if (!this.isCollapse) {
        this.isCollapse = true;
      }
    },
    onSearch() {
      this.$router.push({path: '/search', query: {keyWord: this.searchKey}});
    },
  },
  components: {
    NavBar,
    aboutMe,
    blogHeader,
    blogFooter,
    ToTop,
    Category
  },
  activated() {
    //监听滚动
    window.addEventListener('scroll', this.scroll, false);
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.scroll);
    this.searchKey = '';
    next();
  }
}
</script>

<style scoped>
    /*//////////////////////////////////////*/
    .menuBtn {
        position: absolute;
        top: 20px;
        z-index: 999;
        cursor: pointer;
    }

    .main_item {
        padding-top: 120px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .el-header {
        background: white;
        line-height: 60px;
        position: fixed;
        width: 100%;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.14);
        transition: top 0.5s;
    }

    .header-top {
        box-shadow: 0 0 0 0 !important;
    }

    .navSearch >>> input {
        border-radius: 20px;
    }

    .el-aside {
        box-shadow: 0 1px 3px grey;
        background: #545c64;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .aside-menu {
        border: 0;
        margin-top: 40px;
    }

    .el-main {

    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

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
        z-index: 5
    }

    .up i {
        color: #409eff;
        display: block;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
    }


</style>
