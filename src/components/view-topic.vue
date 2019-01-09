<template>
    <div class="topic_content">
        <div style="padding: 0 30px;position: relative;z-index: 10;background: whitesmoke;">
            <div class="back_to_index">
                <el-button icon="el-icon-back" size="medium" circle @click="go_back"></el-button>
            </div>
            <div class="title">
                <h2>{{ topic.title }}</h2>
            </div>
            <div class="tags">
                <el-tag v-for="(tag,index) in topic.tags" :type="tag_style_arr[index]" style="margin-right: 10px"
                        size="small" :key="index">{{ tag }}
                </el-tag>
            </div>
            <br>
            <div class="info">
                <span>作者：</span><span>{{ topic.author }}</span>
            </div>
            <br>
            <div class="ql-container ql-snow" style="border: 0">
                <div class="ql-editor content" v-html="topic.content">
                </div>
            </div>
            <hr>
            <h3>
                回复：
            </h3>
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
                <el-button @click="post">提交</el-button>
            </div>
        </div>
        <canvas v-show="lessThan1000" id="Mycanvas"></canvas>
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
      lessThan1000: false,//是否渲染背景
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
    init_bg() {
      //定义画布宽高和生成点的个数
      var WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 25;

      var canvas = document.getElementById('Mycanvas');
      canvas.width = WIDTH,
        canvas.height = HEIGHT;
      var context = canvas.getContext('2d');
      context.strokeStyle = 'rgba(0,0,0,0.02)',
        context.strokeWidth = 1,
        context.fillStyle = 'rgba(0,0,0,0.05)';
      var circleArr = [];

      //线条：开始xy坐标，结束xy坐标，线条透明度
      function Line(x, y, _x, _y, o) {
        this.beginX = x,
          this.beginY = y,
          this.closeX = _x,
          this.closeY = _y,
          this.o = o;
      }

      //点：圆心xy坐标，半径，每帧移动xy的距离
      function Circle(x, y, r, moveX, moveY) {
        this.x = x,
          this.y = y,
          this.r = r,
          this.moveX = moveX,
          this.moveY = moveY;
      }

      //生成max和min之间的随机数
      function num(max, _min) {
        var min = arguments[1] || 0;
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      // 绘制原点
      function drawCricle(cxt, x, y, r, moveX, moveY) {
        var circle = new Circle(x, y, r, moveX, moveY)
        cxt.beginPath()
        cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
        cxt.closePath()
        cxt.fill();
        return circle;
      }

      //绘制线条
      function drawLine(cxt, x, y, _x, _y, o) {
        var line = new Line(x, y, _x, _y, o)
        cxt.beginPath()
        cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
        cxt.moveTo(line.beginX, line.beginY)
        cxt.lineTo(line.closeX, line.closeY)
        cxt.closePath()
        cxt.stroke();

      }

      //初始化生成原点
      function init() {
        circleArr = [];
        for (var i = 0; i < POINT; i++) {
          circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40));
        }
        draw();
      }

      //每帧绘制
      function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < POINT; i++) {
          drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
        }
        for (var i = 0; i < POINT; i++) {
          for (var j = 0; j < POINT; j++) {
            if (i + j < POINT) {
              var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
                B = Math.abs(circleArr[i + j].y - circleArr[i].y);
              var lineLength = Math.sqrt(A * A + B * B);
              var C = 1 / lineLength * 7 - 0.009;
              var lineOpacity = C > 0.03 ? 0.03 : C;
              if (lineOpacity > 0) {
                drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y, lineOpacity);
              }
            }
          }
        }
      }

      //调用执行
      init();
      setInterval(function () {
        for (var i = 0; i < POINT; i++) {
          var cir = circleArr[i];
          cir.x += cir.moveX;
          cir.y += cir.moveY;
          if (cir.x > WIDTH) cir.x = 0;
          else if (cir.x < 0) cir.x = WIDTH;
          if (cir.y > HEIGHT) cir.y = 0;
          else if (cir.y < 0) cir.y = HEIGHT;

        }
        draw();
      }, 16);
    },
    post() {
      this.$notify.error({
        title: '错误',
        message: '暂时无法使用'
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
    if (vm.lessThan1000 = window.innerWidth >= 1000) {
      vm.init_bg();
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped>
    .topic_content {
        max-width: 1000px;
        margin: 0 auto;
    }

    .back_to_index {
        padding-top: 10px;
    }

    .info {
        font-size: 15px;
        color: #909399;
    }

    .content {
        background: transparent !important;
    }

    .content >>> img {
        max-width: 100%;
    }

    #Mycanvas {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 1;
    }
</style>