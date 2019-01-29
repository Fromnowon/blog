<template>
    <div class="edit_div">
        <div class="info">
            <div>
                <div v-if="mode===1">
                    <el-alert
                            title="当前处于编辑文章模式"
                            type="warning">
                    </el-alert>
                    <el-button size="small" style="margin-top: 20px" @click="back"><i class="fa fa-chevron-left"></i> 返回
                    </el-button>
                </div>
                <el-alert
                        v-else
                        title="当前处于新建文章模式"
                        type="success">
                </el-alert>
                <p>标题：</p>
                <el-input style="width: 40%" size="medium" v-model="title"></el-input>
                <p>分组：</p>
                <el-dropdown trigger="click" @command="choose_group">
                    <el-button size="small">
                        <span v-text="group[group_choose]"></span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="0">默认</el-dropdown-item>
                        <el-dropdown-item command="1">开发</el-dropdown-item>
                        <el-dropdown-item command="2">随笔</el-dropdown-item>
                        <el-dropdown-item command="3">分享</el-dropdown-item>
                        <el-dropdown-item command="4">其他</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <p>标签：</p>
                <div class="tags">
                    <el-tag
                            :key="tag"
                            v-for="tag in dynamicTags"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" type="primary" plain size="small" @click="showInput"><i
                            class="fa fa-plus"></i>
                        添加
                    </el-button>
                </div>
            </div>
        </div>
        <div v-loading="quillUploadImg" class="editor">
            <div>
                <!-- 图片上传组件辅助-->
                <el-upload
                        class="image_uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp,image/jpg"
                        :action="serverUrl"
                        name="img"
                        :show-file-list="false"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :before-upload="beforeUpload">
                </el-upload>
            </div>
            <quill-editor
                    v-model="content"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
            </quill-editor>
        </div>
        <div class="settings">
            <h4>设置：</h4>
            <template>
                <!-- `checked` 为 true 或 false -->
                <el-checkbox v-model="public">公开</el-checkbox>
                <el-checkbox v-model="sticky">置顶</el-checkbox>
            </template>
        </div>
        <div class="submit_div">
            <el-button type="primary" @click="post_topic" style="width: 120px">{{ mode===0?'发布':'修改' }}</el-button>
        </div>
    </div>
</template>

<script>
import {quillEditor, Quill} from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import ImageResize from '../../../static/js/quill-image-resize-module'
import Qs from 'qs'

Quill.register('modules/imageResize', ImageResize);

export default {
  name: "new-topic",
  data() {
    return {
      serverUrl: this.API + '/backend.php?action=quillUploadImg',
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: {
            container: [
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'size': []},
                'bold', 'italic', 'underline', 'strike',
                {'background': []}, {'color': []}],
              ['blockquote', 'code-block',
                {'list': 'ordered'}, {'list': 'bullet'},
                {'align': []},
                'clean'], ['link', 'image', 'video']
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
      title: '',
      content: ``,//编辑器内容，html格式
      dynamicTags: [],//标签
      group: {0: '默认', 1: '开发', 2: '分享', 3: '随笔', 4: '其他'},
      group_choose: 0,
      public: true,
      sticky: false,
      inputVisible: false,
      inputValue: '',
      quillUploadImg: false,
      mode: 0,//默认新建模式,
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    post_topic() {
      let data = {
        author: this.$store.state.loginInfo,
        title: this.title,
        grouping: this.group_choose,
        tags: this.dynamicTags,
        content: this.content,
        public: this.public ? 1 : 0,
        sticky: this.sticky ? 1 : 0,
      };
      if (!data.title.length || !data.content.length) {
        this.$message.error('内容不完整，请检查');
        return;
      }
      let url = this.mode === 0 ? this.API + '/backend.php?action=new_topic' : this.API + '/backend.php?action=editTopic&&id=' + this.$route.query.topic.id;
      this.$axios.post(url, Qs.stringify(data))
        .then(res => {
          console.log(res);
          if (res.data.status === 1) {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success'
            });
          } else {
            this.$notify.error({
              title: '错误',
              message: '请查看log',
            });
          }
        })
        .catch(error => {
          this.$notify.error({
            title: '错误',
            message: '请查看log',
          });
          console.log(error);
        })
    },
    choose_group(command) {
      this.group_choose = command;
    },
    // 上传图片前
    beforeUpload(res) {
      const list = ['image/jpeg', 'image/gif', 'image/png', 'image/jpg', 'image/bmp'];
      const isIMAGE = list.indexOf(res.type) !== -1;
      const isLt1M = res.size / 1024 / 1024 < 3;

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 3MB!');
      }
      return isIMAGE && isLt1M;
      this.quillUploadImg = true;
    },
    // 上传图片成功
    uploadSuccess(rs, file) {
      console.log(rs);
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.editor;
      // 如果后端处理成功
      if (rs.flag === 'DONE') {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片
        console.log(rs.path);
        quill.insertEmbed(length, 'image', rs.path);
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUploadImg = false
    },
    // 上传图片失败
    uploadError(res, file) {
      console.log(rs);
      // loading动画消失
      this.quillUploadImg = false;
      this.$message.error('图片上传失败')
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
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    getData() {
      //取参数
      try {
        if (this.$route.query.mode === 'edit') {
          //验证数据
          if (this.$route.query.topic.id === undefined || this.$route.query.topic.grouping === undefined || this.$route.query.topic.content === undefined) {
            this.$message({
              message: '数据异常，将进入新建文章模式',
              type: 'error'
            });
            setTimeout(_ => {
              this.$router.push('/admin/edit');
            }, 1000)
          }
          //编辑模式
          this.mode = 1;
          //填充数据
          let data = this.$route.query.topic;
          this.title = data.title;
          this.group_choose = data.grouping;
          this.content = data.content;
          this.dynamicTags = JSON.parse(data.tags);
          this.public = data.public === '1';
          this.sticky = data.sticky === '1';
        } else {
          //新文章模式
          this.mode = 0;
          //初始化数据
          this.title = '';
          this.group_choose = 0;
          this.content = '';
          this.dynamicTags = [];
          this.public = true;
          this.sticky = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  watch: {
    '$route': function (to, from) {

      this.getData();
    }
  },
  mounted() {
    let vm = this;
    vm.editor.container.style.height = window.innerHeight * 0.8 + 'px';
    vm.editor.container.style.width = '100%';
    //调用
    this.getData();
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped>
    .edit_div {
        padding: 20px;
    }

    .group {
        cursor: pointer;
        color: #409eff;
    }

    .tags {
        margin-bottom: 20px;
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .settings {
        margin: 20px 0;
    }

    .submit_div {
        text-align: right;
        margin: 20px 0;
    }

    .image_uploader {
        display: none;
    }

    .editor >>> .ql-toolbar {
        background: whitesmoke;
    }
</style>
