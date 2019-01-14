<template>
    <div class="main_content">
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
                                              @keydown.enter.native="onSearch"
                                              :disabled="true"></el-input>
                                </div>
                                <div class="myTopic">
                                    <el-carousel height="160px" :interval="5000">
                                        <el-carousel-item v-for="(item,index) in topicIMG" :key="index">
                                            <div style="position: absolute;line-height: 12px;background: rgba(255,255,255,0.51);width: 100%;padding: 10px">
                                                <span style="font-size: 12px;font-weight: bold">这是第{{ index+1 }}张图</span>
                                            </div>
                                            <img style="width: 100%" :src="item" alt="pic">
                                        </el-carousel-item>
                                    </el-carousel>
                                </div>
                                <div class="hottest">
                                    <p style="font-weight: bold">最受欢迎文章：</p>
                                    <router-link :key="index" style="margin-top: 10px" :to="'/view?id='+item.id"
                                                 v-for="(item,index) in hottest">{{item.title }}
                                    </router-link>
                                </div>
                                <div class="newest">
                                    <p style="font-weight: bold">最新评论：</p>
                                    <div v-for="(item,index) in newest" :key="index">
                                        <p style="font-size: 14px">{{ item.content }}</p>

                                        <div style="font-size: 12px;color: grey;text-align: right">
                                            <span>{{ item.name }}</span>
                                            发表于
                                            <router-link :to="'/view?id='+item.topicID">《{{ item.title }}》</router-link>
                                        </div>
                                    </div>
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
      topicIMG: ['./static/images/topic/1.jpg', './static/images/topic/2.jpg', './static/images/topic/3.jpg'],
      hottest: [],//点击最多
      newest: [],//最新评论
      commentPreviewLength: 30,//评论预览长度
    }
  },
  watch: {
    $route(to, from) {
      if (from.path === '/admin') {
        this.$forceUpdate();
      }
    },
  },
  mounted() {
    //点击最多
    this.$axios.post(this.API + '/backend.php?action=pullHottest')
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
    this.$axios.post(this.API + '/backend.php?action=pullNewsComments')
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
      })
  },
  methods: {
    onSearch() {
      this.$notify.error({
        title: '错误',
        message: '此功能施工中'
      });
    },
  },
  components: {
    aboutMe,
    blogHeader,
    blogFooter
  },
  beforeDestroy() {
    //跳转前销毁监听
  }
}
</script>

<style scoped>
    .right_card a {
        text-decoration: none;
        color: #3a9bf5;
    }

    .right_card a:hover {
        color: red;
    }

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
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }

    .body_content {
        padding: 20px;
        min-height: 600px;
        border-left: 1px solid lightgrey;
        border-right: 1px solid lightgrey;
    }

    .right_card {
        min-height: 200px;
    }

    .myTopic {
        margin: 30px 0;
    }

    .hottest {
        margin: 40px 0;
    }

    .newest {
        margin: 40px 0;
    }

    .hottest a {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all; /* 追加这一行代码 */
    }


</style>