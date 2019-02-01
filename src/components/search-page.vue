<template>
    <div class="content">
        <el-button type="text" @click="go_back" size="small"
                   icon="el-icon-arrow-left">返回首页
        </el-button>
        <div style="text-align: center;padding: 20px">
            <el-input suffix-icon="el-icon-search" placeholder="搜索"
                      v-model="keyWord"
                      :maxlength="16"
                      @keydown.enter.native="onSearch"
                      style="max-width: 300px;">
            </el-input>
        </div>
        <el-table
                v-loading="loading"
                :data="list_arr"
                style="width: 100%">
            <el-table-column
                    prop="title"
                    label="标题"
                    min-width="240">
            </el-table-column>
            <el-table-column
                    prop="create_date"
                    label="发表时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    label="操作"
                    fixed="right"
                    width="60">
                <template slot-scope="scope">
                    <el-button @click="topic_detail(scope.row.id)" type="text" size="small">浏览
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  name: "search-page",
  data() {
    return {
      loading: true,
      notGet: true,//防止多次取数据
      keyWord: '',
      list_arr: [],
    }
  },
  methods: {
    topic_detail(id) {
      //跳转
      this.$router.push('/view?id=' + id);
    },
    go_back() {
      this.$router.push('/index');
    },
    onSearch() {
      this.$router.push({path: '/search', query: {keyWord: this.keyWord}});
      this.getData();
    },
    getData() {
      if (this.notGet) {
        this.notGet = true;
      } else {
        return;
      }
      this.keyWord = this.$route.query.keyWord;
      this.$axios(this.API + '/backend.php?action=searchHandle', {
        params: {
          keyWord: this.keyWord
        }
      })
        .then(data => {
          if (data.data.status === 1) {
            this.loading = false;
            this.list_arr = data.data.msg;
          } else {
            this.loading = false;
            this.list_arr = [];
          }
        })
        .catch(error => {
          this.loading = false;
        })
    },
  },
  mounted() {

  },
  activated() {
    this.getData();
  },
}
</script>

<style scoped>
    .content {
        padding: 20px;
    }
</style>
