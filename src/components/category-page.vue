<template>
    <div class="content">
        <div>
            当前分类：
            <el-tag :type="tag[type]" size="small">{{ group[type] }}</el-tag>
        </div>
        <br>
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
import Item from './topic-item'

export default {
  name: "category-page",
  data() {
    return {
      loading: true,
      type: '',
      group: ['默认', '开发', '分享', '随笔', '其他'],
      tag: ['', 'success', 'info', 'warning', 'danger'],
      list_arr: [],
    }
  },
  methods: {
    topic_detail(id) {
      //跳转
      this.$router.push('/view?id=' + id);
    },
    getData() {
      this.loading = true;
      this.type = this.$route.query.type;
      this.$axios(this.API + '/backend.php?action=categoryHandle', {
        params: {
          type: this.type
        }
      })
        .then(data => {
          if (data.data.status === 1) {
            this.list_arr = data.data.msg;
            this.$nextTick(() => {
              this.loading = false;
            })
          } else {
            //未取到数据
            this.list_arr = [];
            this.$nextTick(() => {
              this.loading = false;
            })
            console.log(data);
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    '$route': function (to, from) {
      this.getData();
    }
  },
  components: {
    Item,
  }
}
</script>

<style scoped>

</style>
