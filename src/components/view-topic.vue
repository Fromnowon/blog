<template>
    <div class="topic_content">
        <div class="inner_content">
            <el-card class="box-card" style="position: relative;margin-bottom: 20px;padding: 0 10px">
                <div slot="header" class="clearfix">
                    <el-button icon="el-icon-back" size="small" style="float: right" @click="go_back">返回</el-button>
                    <div style="font-size: 24px;font-weight: bold;margin-bottom: 20px">{{ topic.title }}</div>
                    <div class="tags">
                        <el-tag v-for="(tag,index) in topic.tags" :type="tag_style_arr[index]"
                                style="margin-right: 10px"
                                size="small" :key="index">{{ tag }}
                        </el-tag>
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
                    <span style="font-size: 16px;font-weight: bold">回复</span>
                </div>

                <div class="reply">
                    暂无回复
                </div>

                <div class="text item" style="margin-top: 20px">
                    <div class="userinfo">
                        <el-form ref="form" :rules="rules" :model="form" label-width="80px" label-position="top">
                            <el-form-item label="名字：" prop="name">
                                <el-input v-model="form.name" style="max-width: 200px"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱：" prop="email">
                                <el-input v-model="form.email" style="max-width: 200px"></el-input>
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
                    <div style="text-align: right;padding: 20px 0">
                        <el-button type="primary" style="min-width: 120px" @click="post('form')">提交</el-button>
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
      topic: null,
      content: ``,//编辑器内容，html格式
      editorOption: {
        placeholder: '',
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
    post(form) {
      // this.$notify.error({
      //   title: '错误',
      //   message: '暂时无法使用'
      // });
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$notify.error({
            title: '抱歉',
            message: '功能未完成'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    go_back() {
      this.$router.go(-1);
    },
    onEditorReady(editor) { // 准备编辑器

    },
    onEditorBlur() {
    }, // 失去焦点事件
    onEditorFocus() {
    }, // 获得焦点事件
    onEditorChange() {

      //console.log(this.content);
    }, // 内容改变事件
  },
  created() {
    //若使用mounted，控制台会报错，因为data已经被使用，但值为null
    //读取数据
    this.topic = this.$store.state.topic;
    try {
      this.topic.tags = JSON.parse(this.topic.tags);
    } catch (e) {
      //从本地存储读出来的已经是json格式;
    }
  },
  mounted() {
    let vm = this;
    vm.editor.container.style.height = '200px';
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
</script>

<style scoped>
    .topic_content {
        background: #f5f6f7;
    }

    .inner_content {
        padding: 20px 0;
        max-width: 1000px;
        margin: 0 auto;
    }

    .back_to_index {
        padding-top: 10px;
    }

    .info {
        font-size: 14px;
        color: #b1b4bb;
        margin-bottom: 20px;
    }

    .tags {
        margin-bottom: 20px;
    }

    .content {
        background: transparent !important;
        padding: 0 !important;
    }

    .content >>> img {
        max-width: 100%;
    }

    .ql-container {
        padding: 30px 0;
    }

    .reply {
        padding: 10px 0 30px 0;
        border-bottom: 1px solid #ebeef5;
    }

</style>