<template>
    <div class="content">
        <el-table
                :data="tableData"
                style="width: 100%"
                @cell-click="checkDetail"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="topicID"
                    label="文章ID"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱"
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    label="发表时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="内容">
                <template slot-scope="scope">
                    <div v-html="scope.row.content"></div>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="pass" type="primary">通过已选</el-button>
            <el-button @click="reject" type="danger">拒绝已选</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: "comments-verify",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
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
    handleSelection() {
      //处理数据
      let id = [];
      for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
        id.push(this.multipleSelection[i].id);
      }
      return id;
    },
    pass() {

    },
    reject() {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {

      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;

    },
    checkDetail(row, column, cell, event) {
      console.log(cell)
    }
  }
}
</script>

<style scoped>
</style>