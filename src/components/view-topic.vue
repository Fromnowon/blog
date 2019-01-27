<template>
    <div class="topic_content" style="background: white">
        <div :class="['header',isTitleVisible?'header-visible':'header-invisible',scrollValue===0?'header-top':'']">
            <div class="inner_item" style="display: flex;">
                <div style="font-size: 24px;font-weight: bold;margin-right: 20px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                     :style="{ opacity:isTitleVisible?0:1 }">
                    {{ topic.title }}
                </div>
                <div style="margin-left: auto;display: flex">
                    <el-button round size="small" style="height: 32px;align-self: center" icon="el-icon-edit"
                               type="success" @click="postComment">评论
                    </el-button>
                    <el-button style="color: red;height: 32px;align-self: center;" round @click="go_back" size="small"
                               icon="el-icon-arrow-left">返回
                    </el-button>
                </div>
            </div>
        </div>
        <div class="inner_content">
            <div v-loading="loadingTopic" class="inner_item"
                 style="margin-top: 80px;margin-bottom: 60px">
                <div>
                    <div class="title" style="font-size: 24px;font-weight: bold;margin-bottom: 20px;">
                        {{ topic.title}}
                    </div>
                    <div class="group_tag">
                        <i class="fa fa-folder"></i>
                        <span style="margin: 0 20px 0 5px">{{ group[topic.grouping] }}</span>
                        <i class="fa fa-tags"></i>
                        <span v-for="(tag,index) in topic.tags" :type="tag_style_arr[index]"
                              style="margin-left: 5px"
                              :key="index">{{ tag }}
                        </span>
                    </div>
                    <div class="info">
                        <span style="margin-right: 20px">作者：{{ topic.author }}</span>
                        <span>阅读量： {{ topic.view }}</span>
                    </div>
                </div>
                <div style="margin: 30px 0 0">
                    <div class="ql-container ql-snow" style="border: 0">
                        <div class="ql-editor content" v-html="topic.content">
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px;text-align: center">
                    <el-tooltip class="item" effect="dark" :content="lauded?'已点赞':'赞一下'" placement="top">
                        <el-button :type="lauded?'primary':''" circle @click="laud" style="width: 40px;height: 40px"><i
                                class="fa fa-thumbs-o-up"></i>
                        </el-button>
                    </el-tooltip>
                    <span style="font-size: 14px">+{{ topic.laud }}</span>
                </div>
            </div>
            <divider></divider>
            <div style="position: relative;padding: 40px 10px">
                <div class="inner_item">
                    <div class="comment-title">
                        <span style="font-size: 18px">评论：</span>
                    </div>

                    <div class="reply" v-loading="loadingComment">
                        <span v-if="comments.length===0">暂无</span>
                        <div v-else>
                            <div v-for="(item,index) in commentsToShow"
                                 style="font-size: 14px;margin-bottom: 30px;border-bottom: 1px solid whitesmoke">
                                <div>
                                    <span style="margin-right: 20px;font-weight: bold"><i class="fa fa-user-circle"
                                                                                          style="margin-right: 10px"></i>{{ item.name }}</span>
                                    <span style="color: darkgray">{{ commentsTotal-index-(commentsPageNUM-1)*perNUM }}楼</span>
                                    <div style="float: right;font-size: 12px;color: darkgray">
                                        发表于：{{ item.createDate}}
                                    </div>
                                </div>
                                <div class="ql-container ql-snow" style="border: 0;padding: 10px 0 20px">
                                    <div class="ql-editor" style="font-size: 14px;" v-html="item.content">
                                    </div>
                                </div>
                            </div>
                            <div style="text-align: center;margin-top: 20px">
                                <el-pagination
                                        @current-change="paginationHandler"
                                        layout="prev, pager, next"
                                        :page-size="perNUM"
                                        :total="commentsTotal"
                                        background>
                                </el-pagination>
                            </div>
                        </div>
                    </div>

                    <div class="postComment" style="margin-top: 20px">
                        <div class="userinfo">
                            <el-form label-position="top" ref="form" :rules="rules" :model="form" label-width="80px">
                                <el-form-item style="padding-bottom: 10px" label="名字：" prop="name">
                                    <el-input size="small" v-model="form.name" style="max-width: 170px"></el-input>
                                </el-form-item>
                                <el-form-item style="padding-bottom: 10px" label="邮箱：" prop="email">
                                    <el-input size="small" v-model="form.email" style="max-width: 170px"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <br>
                        <div class="quill-editor">
                            <quill-editor
                                    :style="{ boxShadow:isFull?'0 0 5px #FF9900':'0 0 0 0' }"
                                    v-model="content"
                                    ref="myQuillEditor"
                                    :options="editorOption"
                                    @change="onEditorChange($event)">
                            </quill-editor>
                        </div>
                        <div style="padding: 30px 0">
                            <div id="__nc" style="width: 240px;margin-left: -14px;">
                                <div id="nc"></div>
                            </div>
                            <div>
                                <el-button type="primary" style="min-width: 210px;margin-top: 30px"
                                           @click="post('form')"
                                           :disabled="!validateStatus"
                                           :loading="postLoading">发表评论
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToTop></ToTop>
    </div>
</template>

<script>
import {quillEditor, Quill} from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import ImageResize from '../../static/js/quill-image-resize-module'
import Qs from 'qs'
import divider from './other/divider'
import ToTop from "./other/toTop";

Quill.register('modules/imageResize', ImageResize);
export default {
  name: "view-topic",
  data() {
    return {
      postLoading: false,//按钮提交加载状态
      comments: [],//评论
      commentsToShow: [],//分页内容
      perNUM: 10,//分页条数
      commentsTotal: 0,//评论数
      commentsPageNUM: 1,//默认第一页
      uuid: '',//唯一标识符
      validateStatus: false,//验证状态
      loadingComment: true,//加载中
      loadingTopic: true,
      isTitleVisible: true,//标题是否可见
      scrollValue: 0,//滚动距离
      maxLength: 800,//评论最大长度
      isFull: false,//编辑器长度状态
      lauded: false,//是否赞过
      group: {0: '默认', 1: '开发', 2: '分享', 3: '随笔', 4: '其他'},
      form: {
        name: '',
        email: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],

      },
      tag_style_arr: ['', 'success', 'info', 'warning', 'danger'],
      topic: '',
      content: ``,//编辑器内容，html格式
      content_text: ``,//编辑器内容，html格式
      editorOption: {
        placeholder: '发言请遵守相关法律法规',
        modules: {
          toolbar: {
            container: [
              'bold', 'strike',
              {'background': []}, {'color': []},
              'blockquote', 'code-block',
              'clean', 'link'
            ],
            handlers: {
              'image': (value) => {
                if (value) {
                  document.querySelector('.image_uploader input').click()
                } else {
                  console.log('error');
                }
              }
            },
          },
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
        }
      },
    }
  },
  methods: {
    laud() {
      //赞
      if (this.lauded) {
        return;
      }
      this.lauded = true;
      this.$set(this.topic, 'laud', parseInt(this.topic.laud) + 1);
      this.$axios(this.API + '/backend.php?action=laudHandler&id=' + this.$route.query.id);
    },
    postComment() {
      animateScroll(this.$util.getDomByClass('postComment')[0], 128, -60);//上抬60像素
    },
    scrollTopic() {
      //滚动监听
      let title = this.$util.getDomByClass('title')[0];
      this.scrollValue = document.documentElement.scrollTop || document.body.scrollTop;
      this.isTitleVisible = !(title.offsetTop + title.offsetHeight - this.scrollValue - 60 < 0);
    },
    validate() {
      let nc_token = ["CF_APP_1", (new Date()).getTime(), Math.random()].join(':');
      let nc = NoCaptcha.init({
        renderTo: '#nc',
        appkey: 'CF_APP_1',
        scene: 'register',
        token: nc_token,
        trans: {"key1": "code0"},
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "cn",
        timeout: 10000,
        retryTimes: 5,
        errorTimes: 5,
        inline: false,
        apimap: {
          // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
          // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
        },
        bannerHidden: false,
        initHidden: false,
        callback: function (data) {
          // window.console && console.log(nc_token)
          // window.console && console.log(data.csessionid)
          // window.console && console.log(data.sig)
        },
        error: function (s) {
        }
      });
      NoCaptcha.setEnabled(true);
      nc.reset();//请务必确保这里调用一次reset()方法
      NoCaptcha.upLang('cn', {
        'LOADING': "加载中...",//加载
        'SLIDER_LABEL': "向右滑动验证",//等待滑动
        'CHECK_Y': "验证通过",//通过
        'ERROR_TITLE': "非常抱歉，这出错了...",//拦截
        'CHECK_N': "验证未通过", //准备唤醒二次验证
        'OVERLAY_INFORM': "经检测你当前操作环境存在风险，请输入验证码",//二次验证
        'TIPS_TITLE': "验证码错误，请重新输入"//验证码输错时的提示
      });
      NoCaptcha.on('success', () => {
        this.validateStatus = true;
        //console.log('验证通过')
      })
    },
    paginationHandler(pageNUM) {
      //console.log(pageNUM);
      this.commentsPageNUM = pageNUM;
      this.commentsToShow = [];
      //注意可能越界
      for (let i = (pageNUM - 1) * this.perNUM; i < this.perNUM * pageNUM && i < this.commentsTotal; i++) {
        this.commentsToShow.push(this.comments[i]);
      }
    },
    post(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          //校验时间戳
          if (this.$store.state.userInfo !== null) {
            //此用户存存在发言记录
            let time = new Date().getTime() / 1000 - this.$store.state.userInfo.time / 1000;
            console.log('间隔秒数：' + time);
            if (time < 1) {
              this.$message.error('距离上次发言不足3分钟，请等待');
              return;
            }
          }

          if (!this.content_text.match(/^\s*$/)) {
            if (!this.content_text.length > this.maxLength) {
              this.$message.error('内容过长，请删减');
            }
            //改变按钮样式
            this.postLoading = true;
            //提交
            let param = {
              topicID: this.$route.query.id,
              name: this.form.name,
              email: this.form.email,
              content: this.content,
              captcha: this.captchaInput,
            };
            this.$axios(this.API + '/backend.php?action=postComment', {
              params: param
            })
              .then(data => {
                this.postLoading = false;
                switch (data.data.status) {
                  case 0: {
                    //触发审核
                    this.$alert('该评论经审核后显示', '提示', {
                      confirmButtonText: '知道了',
                      type: 'warning',
                      center: true
                    });
                    break;
                  }
                  case 1: {
                    this.$notify.success({
                      title: '成功',
                      message: '你发表了评论'
                    });
                    //拉取评论
                    this.pullComments();
                    setTimeout(() => {
                      //定位到评论
                      animateScroll(this.$util.getDomByClass('comment-title')[0], 64, -60);
                    }, 1000);
                    break;
                  }
                  default: {
                    //其他错误
                    console.log(data);
                  }
                }
                //初始化编辑内容，并记录用户相关信息
                this.$refs[form].clearValidate();
                this.content = '';
                NoCaptcha.reset();
                this.validateStatus = false;
                this.$store.commit('setUserInfo', {
                  name: param.name,
                  email: param.email,
                  time: new Date().getTime()
                });
              })
              .catch(error => {
                this.postLoading = false;
                console.log(error);
              })
          } else {
            this.$notify.error({
              title: '错误',
              message: '评论内容不能为空'
            });
          }

        } else {
          return false;
        }
      });
    },
    go_back() {
      this.$router.go(-1);
    },
    onEditorChange({quill, html, text}) {
      this.content_text = text;
      //丢弃溢出字符串，并增加提示
      this.isFull = text.length >= this.maxLength;
      quill.deleteText(this.maxLength, 1, html);
    }, // 内容改变事件
    pullComments() {
      this.comments = this.commentsToShow = [];
      this.$axios(this.API + '/backend.php?action=pullComments', {
        params: {
          id: this.$route.query.id
        }
      })
        .then(data => {
          if (data.data.status !== -1) {
            this.commentsTotal = data.data.msg.length;
            this.comments = data.data.msg;
            for (let i = 0; i < this.perNUM && i < this.commentsTotal; i++) {
              this.commentsToShow.push(this.comments[i]);
            }
            this.$nextTick(function () {
              /*DOM更新了*/
              this.loadingComment = false;
            })
          } else {
            this.loadingComment = false;
            //console.log(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    //生成随机串
    // this.uuid = randomWord(false, 16);
    //若使用mounted，控制台会报错，因为data已经被使用，但值为null


    //拉取文章数据
    this.$axios(this.API + '/backend.php?action=get_topic_detail', {
      params: {
        id: this.$route.query.id
      }
    })
      .then(data => {
        data.data.msg.tags = JSON.parse(data.data.msg.tags);
        if (data.data.status !== -1) {
          this.topic = data.data.msg;
        } else {
          console.log(data);
        }
        this.$nextTick(function () {
          /*DOM更新了*/
          this.loadingTopic = false;
        })
      })
      .catch(error => {
        console.log(error);
      });
    //拉取评论
    this.pullComments();
  },
  mounted() {
    if (this.$store.state.userInfo !== null) {
      //读取用户信息
      this.$set(this.form, 'name', this.$store.state.userInfo.name);
      this.$set(this.form, 'email', this.$store.state.userInfo.email);
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
      });
    }
    let vm = this;
    vm.editor.container.style.height = '200px';
    //启用验证
    this.validate();
    setTimeout(() => {
      //监听滚动，修正路由调整滚动条不触发滚动监听的bug
      window.addEventListener('scroll', this.scrollTopic, false);
    }, 0)
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.scrollTopic);
    next();
  },
  components: {
    quillEditor,
    divider,
    ToTop
  }
}

//生成随机uuid
function randomWord(randomFlag, min, max) {
  let str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

function animateScroll(element, speed, patch) {
  let rect = element.getBoundingClientRect();
  //获取元素相对窗口的top值，此处应加上窗口本身的偏移
  let top = window.pageYOffset + rect.top + patch;
  let currentTop = 0;
  let requestId;

  //采用requestAnimationFrame，平滑动画
  function step(timestamp) {
    currentTop += speed;
    if (currentTop <= top) {
      window.scrollTo(0, currentTop);
      requestId = window.requestAnimationFrame(step);
    } else {
      window.cancelAnimationFrame(requestId);
    }
  }

  window.requestAnimationFrame(step);
}

</script>

<style scoped>
    .header {
        height: 60px;
        line-height: 60px;;
        position: fixed;
        width: 100%;
        z-index: 9999;
        background: white;
    }

    .header-visible {
        border-bottom: 0;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    }

    .header-invisible {
        background: white;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    }

    .header-top {
        box-shadow: 0 0 0 0 !important;
    }

    .inner_content {
        padding: 20px 0;
    }

    .inner_item {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .info {
        color: #818181;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .group_tag {
        color: #818181;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .content {
        background: transparent !important;
        padding: 0 !important;
    }

    .content >>> img {
        max-width: 100%;
    }

    .ql-container {
        padding: 10px 0;
    }

    .el-form-item {
        margin-bottom: 0 !important;
    }

    .userinfo >>> .el-form-item__label {
        padding: 0 !important;
    }

    .reply {
        padding: 10px 0 20px 0;
        min-height: 100px;
    }

    /* 滑动条高度、边框、背景色等 */
    #__nc >>> ._nc .stage1 .slider {
        height: 42px;
        border-radius: 26px;
        box-shadow: 0 0 3px #999;
        background-color: #ddd;
    }

    #__nc >>> ._nc .stage1 {
        height: 42px;
    }

    /* 滑动条 */
    #__nc >>> ._nc .stage1 .track div {
        border-radius: 26px;
        color: #fff;
        height: 42px;
        line-height: 42px;
    }

    #__nc >>> ._nc .stage1 .label {
        line-height: 42px;

    }

    #__nc >>> ._nc .icon-slide-arrow {
        font-size: 28px;
    }

    /*滑块*/
    #__nc >>> ._nc .stage1 .slider .button {
        border-radius: 26px;
        width: 42px;
        height: 42px;
    }

    #__nc >>> ._nc .stage1 .icon {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }

    /* 滑动条背景色-正常 */
    #__nc >>> ._nc .stage1 .bg-green {
        background-color: #78c430;
        height: 42px;

    }

    /* 滑动条背景色-失败 */
    #__nc >>> ._nc .stage1 .bg-red {
        background-color: #ff5500;
        height: 42px;

    }

</style>