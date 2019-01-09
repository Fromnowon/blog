<!--聊天内容区-->
<template>
    <div class="mainChat">
        <div class="main_content">
            <el-scrollbar>
                <div class="ql-container ql-snow">
                    <div class="ql-editor">

                        <div class="content">
                            <!--这里是聊天内容-->
                            <msgList v-for="(msg,index) in msg_list" v-bind:data="msg" v-bind:key="index"
                                     v-on:loaded="scroll_to_bottom">
                            </msgList>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="edit">
            <div>
                <quill-editor
                        class="editor"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @change="onEditorChange($event)">
                </quill-editor>
            </div>
        </div>
        <div class="btn">
            <el-button v-on:click="chat_submit" icon="el-icon-edit-outline" type="success">提交</el-button>
        </div>
    </div>
</template>

<script>
import {quillEditor} from "vue-quill-editor"; //调用编辑器
import msgList from './msg-list'

export default {
  name: "main-chat",
  data() {
    return {
      flag: 1,//快捷键提示标记
      key: '',
      content: '',
      editorOption: {
        modules: {
          toolbar: [
            [{'size': ['small', false, 'large', 'huge']}],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{'color': []}, {'background': []}],
            [{'align': []}],
            ['code-block'],
          ]
        },
        placeholder: '',
      },
      msg_list: [],
    }
  },
  components: {
    quillEditor,
    msgList
  },
  methods: {
    scroll_to_bottom: function () {
      //收到新消息，滚到底部
      this.$util.getDomByClass('el-scrollbar__wrap')[0].scrollTop = this.$util.getDomByClass('ql-container')[0].scrollHeight;
    },
    chat_submit: function () {
      //提交内容到server
      if (this.content.length > 0) {
        if (this.flag) {
          this.flag = 0;
          this.$message(
            {
              message: '按下快捷键 Alt+S 提交',
              type: 'warning'
            }
          );
        }

        this.msg_list.push({
          'content': this.content,
          'date': this.$util.getFormatDate(new Date()),
          'avatar': 0,
          'type': 'send',
        });//驱动视图更新

        //提交关键词到服务器
        let param = {
          "reqType": 0,
          "perception": {
            "inputText": {
              "text": this.key
            },
          },
          "userInfo": {
            "apiKey": "cc3b5bd2342140bba36ecb5f6fb3db8b",
            "userId": "367832"
          }
        };

        //清空编辑器
        this.editor.setText('');
        this.editor.focus();

        this.$axios.post(this.CHAT + '/openapi/api/v2', param)
          .then(data => {
            this.msg_list.push({
              'content': data.data.results[0].values.text,
              'date': this.$util.getFormatDate(new Date()),
              'avatar': 1,
              'type': 'receive',
            });//驱动视图更新
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    onEditorChange({editor, html, text}) {
      //console.log('editor change!', editor, html, text)
      this.content = html;
      this.key = text;//纯文本
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted() {
    let height = document.documentElement.clientHeight;
    this.$util.getDomByClass('mainChat')[0].style.height = height + 'px';
    //固定编辑器高度
    this.$util.getDomByClass('editor')[0].style.height = (0.4 * height - 110) + 'px';
    //绑定组合键
    let vue_obj = this;
    document.onkeydown = function (e) {
      let keyCode = e.keyCode || e.which || e.charCode;
      let altKey = e.altKey;
      if (altKey && keyCode == 83) {
        //提交内容
        vue_obj.chat_submit();
      }
    };
    //挂载页面后自动提交一次
    this.$axios.post(this.CHAT + '/openapi/api/v2', {
      "reqType": 0,
      "perception": {
        "inputText": {
          "text": 'hi'
        },
      },
      "userInfo": {
        "apiKey": "cc3b5bd2342140bba36ecb5f6fb3db8b",
        "userId": "367832"
      }
    })
      .then(data => {
        this.msg_list.push({
          'content': data.data.results[0].values.text,
          'date': this.$util.getFormatDate(new Date()),
          'avatar': 1,
          'type': 'receive',
        });//驱动视图更新
      })
      .catch(error => {
        console.log(error);
      });
  },
}
</script>

<style scoped>
    .mainChat {
        padding: 10px;
    }

    .el-scrollbar {
        height: 100%;
    }

    .main_content .ql-snow {
        border: 0 !important;
    }

    .main_content {
        height: 60%;
        border: 1px solid lightgray;
        border-bottom: 0;
        background: white;
    }

    .edit {
        position: relative;
        min-height: 200px;
    }

    .btn {
        text-align: right;
        margin-top: 70px;

    }
</style>