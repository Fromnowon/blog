<template>
    <div class="topic_content">
        <div class="inner_content">
            <el-card v-loading="loadingTopic" class="box-card" style="margin-bottom: 20px;padding: 20px 10px">
                <div slot="header" class="clearfix">
                    <el-button icon="el-icon-arrow-left" size="small"
                               style="float: right;margin-top: 5px;color: red"
                               @click="go_back">返回
                    </el-button>
                    <div style="font-size: 24px;font-weight: bold;margin-bottom: 20px">{{ topic.title }}</div>
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
                <div class="text item">
                    <div class="ql-container ql-snow" style="border: 0">
                        <div class="ql-editor content" v-html="topic.content">
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="box-card" style="position: relative;padding: 0 10px">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px;">评论</span>
                </div>

                <div class="reply" v-loading="loadingComment">
                    <span v-if="comments.length===0">暂无</span>
                    <div v-else>
                        <div v-for="(item,index) in commentsToShow" style="font-size: 14px;margin-bottom: 20px;">
                            <div>
                                <span style="margin-right: 20px;font-weight: bold">{{ item.name }}</span>
                                <span style="color: darkgray">{{ commentsTotal-index-(commentsPageNUM-1)*perNUM }}楼</span>
                            </div>
                            <div v-html="item.content"></div>
                            <div style="text-align: right;font-size: 12px;color: darkgray">发表于：{{ item.createDate }}
                            </div>
                        </div>
                        <div style="text-align: center;margin-top: 20px">
                            <el-pagination
                                    @current-change="paginationHandler"
                                    layout="prev, pager, next"
                                    :page-size="perNUM"
                                    :total="commentsTotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>

                <div class="text item" style="margin-top: 20px">
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
                                v-model="content"
                                ref="myQuillEditor"
                                :options="editorOption"
                                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                @change="onEditorChange($event)">
                        </quill-editor>
                    </div>
                    <div style="padding: 30px 0">
                        <div id="__nc" style="width: 240px;margin-left: -14px;">
                            <div id="nc"></div>
                        </div>
                        <div>
                            <el-button type="primary" style="min-width: 210px;margin-top: 30px" @click="post('form')"
                                       :disabled="!validateStatus"
                                       :loading="postLoading">提交
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import {quillEditor, Quill} from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import ImageResize from '../../static/js/quill-image-resize-module'
import Qs from 'qs'

Quill.register('modules/imageResize', ImageResize);
export default {
  name: "view-topic",
  data() {
    return {
      postLoading: false,//按钮提交加载状态
      comments: '',//评论
      commentsToShow: [],//分页内容
      perNUM: 5,//分页条数
      commentsTotal: 0,//评论数
      commentsPageNUM: 1,//默认第一页
      uuid: '',//唯一标识符
      validateStatus: false,//验证状态
      loadingComment: true,//加载中
      loadingTopic: true,
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
              {'size': []},
              'bold', 'strike',
              {'background': []}, {'color': []},
              'blockquote', 'code-block',
              {'align': []},
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
        console.log('验证通过')
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
          if (!this.content_text.match(/^\s*$/)) {
            //改变按钮样式
            this.postLoading = true;
            //提交
            let param = {
              topicID: this.$store.state.topic.id,
              name: this.form.name,
              email: this.form.email,
              content: this.content,
              captcha: this.captchaInput,
              uuid: this.uuid
            };
            this.$axios.post(this.API + '/backend.php?action=postComment', Qs.stringify(param))
              .then(data => {
                this.postLoading = false;
                if (data.data.status === 1) {
                  this.$notify.success({
                    title: '成功',
                    message: '即将刷新页面'
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 1000)
                } else {
                  //验证码错误
                  this.captchaError = true;
                  console.log(data);
                }
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
    }, // 内容改变事件
  },
  created() {
    //生成随机串
    // this.uuid = randomWord(false, 16);
    //若使用mounted，控制台会报错，因为data已经被使用，但值为null
    //读取数据
    let id = this.$route.query.id;
    //拉取文章数据
    this.$axios.post(this.API + '/backend.php?action=get_topic_detail', Qs.stringify({id: id}))
      .then(data => {
        data.data.msg.tags = JSON.parse(data.data.msg.tags);
        if (data.data.status !== -1) {
          this.topic = data.data.msg;
        } else {
          console.log(data.data.msg);
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
    this.$axios.post(this.API + '/backend.php?action=pullComments', Qs.stringify({id: id}))
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
          console.log(data.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  mounted() {
    let vm = this;
    vm.editor.container.style.height = '200px';
    //启用验证
    this.validate();
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  components: {
    quillEditor
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

</script>

<style scoped>

    .inner_content {
        padding: 20px 0;
        max-width: 1000px;
        margin: 0 auto;
    }

    .box-card {
        position: relative;
        padding: 0 10px;
        min-height: 200px
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
        border-bottom: 1px solid #ebeef5;
        min-height: 200px;
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