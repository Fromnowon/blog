<template>
    <div class="topic_item">
        <el-card shadow="hover" v-for="(item,index) in list_arr" :key="index">
            <div slot="header">
                <span v-text="item.title" @click="topic_detail(index)" class="topic_item_title"></span>
                <!--<el-button style="float: right; padding: 3px 0" type="text"  @click="topic_detail">围观</el-button>-->
            </div>
            <!--<div class="topic_preview" v-html="item.content"></div>-->
            <div class="topic_preview" v-html="item.content_preview"></div>
            <br>
            <div class="topic_item_extra">
                <span>浏览：{{ item.view }}</span>
                &nbsp;&nbsp;&nbsp;
                <span>评论：{{ item.reply }}</span>
                &nbsp;&nbsp;&nbsp;
                <span>发表于：</span>
                <span v-text="item.create_date"></span>
            </div>
        </el-card>
        <!--分页-->
        <el-pagination layout="prev, pager, next" :page-count="total_page_num" @current-change="change_page"
                       v-show="total_page_num"
                       style="text-align: center;position: relative;z-index: 10;background: whitesmoke;margin-bottom: 20px"
                       background>
        </el-pagination>
    </div>
</template>

<script>
import Qs from 'qs';

export default {
  name: "topic-item",
  data() {
    return {
      total_page_num: null,
      list_arr: [],
    }
  },
  methods: {
    topic_detail(index) {
      //添加数据
      this.$store.commit('addTopic', this.list_arr[index]);
      //跳转
      this.$router.push('/view');
      //点击数+1
      this.$axios.post(this.API + '/backend.php?action=views_count_add', Qs.stringify({'id': this.list_arr[index].id}))
        .then(data => {
          if (data.data.length > 0) {
            //后台处理出错
            console.log(data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    change_page(num) {
      //切换页面
      let vm = this;
      vm.$store.commit('loadingControl', 1);
      this.$axios.post(this.API + '/backend.php?action=get_topics', Qs.stringify({'num': num}))
        .then(function (res) {
          vm.list_arr = [];
          for (let item of res.data.arr) {
            item['content_preview'] = vm.$util.HTMLEncode(item.content);
            vm.list_arr.push(item);
          }
          vm.$store.commit('loadingControl', 0);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  },
  created() {
    //拉取第一页数据
    let vm = this;
    vm.$store.commit('loadingControl', 1);
    const PAGE_NUM = 5;//每页显示条数
    this.$axios.post(this.API + '/backend.php?action=get_topics', Qs.stringify({'num': 1}))
      .then(function (res) {
        vm.total_page_num = Math.ceil(parseInt(res.data.total) / PAGE_NUM);
        for (let item of res.data.arr) {
          item['content_preview'] = vm.$util.HTMLEncode(item.content);
          vm.list_arr.push(item);
        }
        vm.$store.commit('loadingControl', 0);
        vm.$emit('loaded');
      })
      .catch(function (error) {
        console.log(error);
      })
  },
}
</script>

<style scoped>
    .el-card {
        margin-bottom: 20px;
    }

    .topic_item {
        min-height: 300px;
    }

    .topic_preview {
        font-size: 14px;
    }

    .topic_item_title {
        cursor: pointer;
        font-weight: bold;
    }

    .topic_item_title:hover {
        color: dodgerblue;
    }

    .topic_item_extra {
        text-align: right;
        color: #b5b5b5;
        font-size: 14px;
    }
</style>