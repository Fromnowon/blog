<template>
    <div class="main_content">
        <el-container>
            <el-aside
                    :style="{ marginLeft:isCollapse?'-300px':'0',transition:'margin 0.5s',textAlign:'unset',position:'fixed',zIndex:998,height:'100%'}">
                <i class="el-icon-close menuBtn" style="top: 10px;right: 14px;font-size: 22px"
                   @click="isCollapse=!isCollapse"></i>
                <NavBar @closeMenu="isCollapse=true"></NavBar>
            </el-aside>
            <div style="width: 100%" @click="closeMenuByClick">
                <el-header :style="{ top:headerShow?'0':'-70px',zIndex: 997 }">
                    <div style="max-width: 960px;margin: 0 auto;display: flex">
                        <el-button style="height: 32px;align-self: center" round type="primary" size="small" @click.stop="isCollapse=!isCollapse">
                            <i class="fa fa-navicon"></i>
                            &nbsp;菜单
                        </el-button>
                        <el-input size="small" suffix-icon="el-icon-search" placeholder="搜索"
                                  class="navSearch"
                                  @keydown.enter.native="onSearch"
                                  :disabled="true" style="max-width: 200px;margin-left: auto">
                        </el-input>
                    </div>
                </el-header>
                <el-main class="main_item">
                    <router-view style="min-height: 640px"></router-view>
                </el-main>
                <blog-footer></blog-footer>
            </div>
        </el-container>
    </div>
</template>

<script>
import aboutMe from './about-me'
import blogHeader from './header'
import blogFooter from './footer'
import NavBar from "./nav-bar";

export default {
  name: "main_body",
  data() {
    return {
      isCollapse: true,//侧栏状态
      controller: 1,
      topicIMG: [require('../../static/images/topic/1.jpg'), require('../../static/images/topic/2.jpg'), require('../../static/images/topic/3.jpg')],
      hottest: [],//点击最多
      newest: [],//最新评论
      commentPreviewLength: 30,//评论预览长度
      scrollValue: 0,//滚动距离
      headerShow: true,//顶部显隐
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
    }
  },
  mounted() {
    //点击最多
    this.$axios(this.API + '/backend.php?action=pullHottest')
      .then(data => {
        if (data.data.status !== -1) {
          this.hottest = data.data.msg;
        } else {
          console.log(data.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    //最新评论
    this.$axios(this.API + '/backend.php?action=pullNewsComments')
      .then(data => {
        if (data.data.status !== -1) {
          for (let i = 0, len = data.data.msg.length; i < len; i++) {
            data.data.msg[i].content = this.$util.HTMLEncode(data.data.msg[i].content);
            if (data.data.msg[i].content.length > this.commentPreviewLength) {
              data.data.msg[i].content = data.data.msg[i].content.substr(0, this.commentPreviewLength) + '...';
            }
          }
          this.newest = data.data.msg;
        } else {
          console.log(data.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    scroll() {
      //滚动监听
      //关闭侧栏
      if (!this.isCollapse) {
        this.isCollapse = true;
      }
      this.scrollValue = document.documentElement.scrollTop || document.body.scrollTop;
    },
    closeMenuByClick() {
      //点击关闭侧栏
      if (!this.isCollapse) {
        this.isCollapse = true;
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    onSearch() {

    },
  },
  components: {
    NavBar,
    aboutMe,
    blogHeader,
    blogFooter
  },
  activated() {
    //监听滚动
    window.addEventListener('scroll', this.scroll, false);
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.scroll);
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
        padding-top: 80px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
        position: fixed;
        width: 100%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.14);
        transition: top 0.5s;
    }

    .navSearch >>> input {
        border-radius: 20px;
    }

    .el-aside {
        border-right: 1px solid lightgrey;
        background: white;
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


</style>