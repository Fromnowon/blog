<template>
    <div class="content">
        <el-table
                :data="tableData"
                style="width: 100%"
                @cell-click="checkDetail"
        >
            <el-table-column
                    prop="topicID"
                    label="文章ID"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    label="发表时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  name: "comments-verify",
  data() {
    return {
      tableData: [],
    }
  },
  mounted() {
    //拉取数据
    this.$axios(this.API + '/backend.php?action=pullVerifyData')
      .then(data => {
        if (data.data.status === 1) {
          this.tableData = data.data.msg;
        } else {
          console.log(data);
        }
      })
      .catch(error => {
        console.log(error);
      })
  },
  methods: {
    checkDetail(row, column, cell, event) {
      console.log(cell)
    }
  }
}
</script>

<style scoped>
</style>