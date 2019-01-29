<template>
    <div class="content">
        <el-table
                :data="topicData"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="创建时间：">
                            <span style="color: blue">{{ props.row.create_date }}</span>
                        </el-form-item>
                        <el-form-item label="修改时间：">
                            <span style="color: blue">{{ props.row.edit_date }}</span>
                        </el-form-item>
                        <el-form-item label="浏览量：">
                            <span style="color: blue">{{ props.row.view }}</span>
                        </el-form-item>
                        <el-form-item label="评论数：">
                            <span style="color: blue">{{ props.row.reply }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="ID"
                    width="60">
            </el-table-column>
            <el-table-column
                    label="标题"
                    min-width="240px"
            >
                <template slot-scope="props">
                    <span style="white-space:nowrap;">{{ props.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="140">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleClickCheck(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="handleClickEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleClickDel(scope.row)" style="color: red">
                        隐藏
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                :title="dialogData.title"
                :visible.sync="dialogVisible"
                width="90%">
            <div>
                <div>{{ dialogData.tags }}</div>
                <div class="ql-container ql-snow" style="border: 0;padding: 10px 0 20px">
                    <div class="ql-editor" style="font-size: 14px;" v-html="dialogData.content">
                    </div>
                </div>
                <div>
                    <!--评论列表-->
                    <div v-for="(item,index) in dialogComments" :key="index" v-html="item.content"></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关  闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import 'quill/dist/quill.snow.css';

export default {
  name: "topics-manage",
  data() {
    return {
      topicData: [],
      dialogVisible: false,//预览对话框
      dialogData: [],
      dialogComments: [],
    }
  },
  methods: {
    handleClickCheck(item) {
      this.dialogVisible = true;
      this.dialogData = item;
      //拉取评论
      this.$axios(this.API + '/backend.php', {
        params: {
          action: 'pullAllComments',
          id: item.id
        }
      })
        .then(data => {
          if (data.data.status === 1) {
            this.dialogComments = data.data.msg;
          } else {
            console.log(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClickEdit(item) {
      this.$router.push({
        path: '/admin/edit', query: {
          mode: 'edit',
          topic: item
        }
      });
    },
    handleClickDel(item) {

    }
  },
  mounted() {
    this.$axios(this.API + '/backend.php?action=getAllTopic')
      .then(data => {
        if (data.data.status === 1) {
          this.topicData = data.data.msg;
        } else {
          console.log(data);
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
}
</script>

<style scoped>

</style>
