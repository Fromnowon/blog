<template>
    <div class="topic_item">
        <el-card shadow="hover" v-for="(item,index) in list_arr" :key="index">
            <div slot="header" style="line-height: 24px">
                <span v-text="item.title" class="topic_item_title" @click="topic_detail(item.id)"></span>
                <el-tag style="float: right;margin-top: 10px" size="small" :type="colors[item.grouping]">{{ tags[item.grouping] }}
                </el-tag>
                <div style="clear: both"></div>
                <!--<el-button style="float: right; padding: 3px 0" type="text"  @click="topic_detail">围观</el-button>-->
            </div>
            <!--<div class="topic_preview" v-html="item.content"></div>-->
            <router-link :to="'view?id='+item.id" class="topic_preview" v-html="item.content_preview"></router-link>
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
                       style="text-align: center;position: relative;z-index: 10;margin-bottom: 20px"
                       background>
        </el-pagination>
    </div>
</template>

<script>
import Qs from 'qs';

const PAGE_NUM = 10;//每页显示条数

export default {
  name: "topic-item",
  data() {
    return {
      total_page_num: null,
      list_arr: [],
      tags: {0: '默认', 1: '开发', 2: '分享', 3: '随笔', 4: '其他'},
      colors: ['info', '', 'success', 'warning', 'danger'],
    }
  },
  methods: {
    topic_detail(id) {
      //跳转
      this.$router.push('/view?id=' + id);
    },
    change_page(num) {
      //切换页面
      let vm = this;
      vm.$store.commit('loadingControl', 1);
      this.$axios(this.API + '/backend.php?action=get_topics', {
        params: {'num': num, 'per': PAGE_NUM}
      })
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
  mounted() {
    //拉取第一页数据
    let vm = this;
    vm.$store.commit('loadingControl', 1);
    this.$axios(this.API + '/backend.php?action=get_topics', {
      params: {'num': 1, 'per': PAGE_NUM}
    })
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
  }
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
        color: #999;
        font-size: 14px;
        text-decoration: none;
    }

    .topic_item_title {
        cursor: pointer;
        font-weight: bold;
        font-size: 20px;
        float: left;
        margin: 10px 0;
    }

    .topic_item_title:hover {
        color: red;
    }

    .topic_item_extra {
        margin-top: 20px;
        text-align: right;
        font-size: 12px;
    }
</style>