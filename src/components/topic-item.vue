<template>
    <div class="topic_item">
        <transition-group name="list">
            <div v-for="(item,index) in list_arr" :key="index+'list'"
                 style="margin-bottom: 20px;border-bottom: 1px solid lightgrey">
                <div style="display: flex;justify-content: center">
                    <span v-text="item.title" class="topic_item_title" style="align-self: center"
                          @click="topic_detail(item.id)"></span>
                    <el-tag style="align-self: center;margin-left: 10px" v-if="item.sticky==='1'" size="small"
                            type="danger">置顶
                    </el-tag>
                </div>
                <div class="topic_item_extra">
                    <span><i class="fa fa-clock-o"></i>{{ item.view }}</span>
                    &nbsp;&nbsp;&nbsp;
                    <span><i class="fa fa-commenting-o"></i>{{ item.reply }}</span>
                    &nbsp;&nbsp;&nbsp;
                    <span><i class="fa fa-calendar-plus-o"></i>{{ item.create_date }}</span>
                </div>
                <div style="margin: 40px 0">
                    <router-link :to="'view?id='+item.id" class="topic_preview"
                                 v-text="item.content_preview"></router-link>
                </div>
            </div>
        </transition-group>
        <div>
            <el-pagination layout="prev, pager, next" :page-count="total_page_num" @current-change="change_page"
                           style="text-align: center;position: relative;z-index: 10;"
                           background>
            </el-pagination>
        </div>
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
                btn: false,
            }
        },
        methods: {
            viewTopic(url) {
                this.$router.push(url);
            },
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
                            item['content_preview'] = item['content'].replace(/<[^<>]+>/g, '').substring(0, 320);
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
            //vm.$store.commit('loadingControl', 1);
            this.$axios(this.API + '/backend.php?action=get_topics', {
                params: {'num': 1, 'per': PAGE_NUM}
            })
                .then(function (res) {
                    vm.total_page_num = Math.ceil(parseInt(res.data.total) / PAGE_NUM);
                    for (let item of res.data.arr) {
                        item['content_preview'] = item['content'].replace(/<[^<>]+>/g, '').substring(0, 320);
                        vm.list_arr.push(item);
                    }
                    //vm.$store.commit('loadingControl', 0);
                    vm.$emit('loaded');
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
    }
</script>

<style scoped>
    .topic_item {
        overflow: hidden;
        min-height: 300px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .topic_preview {
        color: #999;
        font-size: 14px;
        text-decoration: none;
        transition: color .5s;
    }

    .topic_preview:hover {
        color: black;
    }

    .topic_item_title {
        cursor: pointer;
        font-weight: bold;
        font-size: 20px;
        margin: 10px 0;
        color: #409EFF;
    }

    .topic_item_title:hover {
        color: red;
    }

    .topic_item_extra {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
    }

    .topic_item_extra i {
        font-size: 14px;
        margin-right: 5px;
    }

    /*动画*/
    .list-enter-active, .list-leave-active {
        transition: all 0.5s ease;
    }

    .list-enter, .list-leave-to
        /* .list-leave-active for below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }

    /*.view_detail_btn {*/
    /*border-radius: 0;*/
    /*!*border-left: 0;*!*/
    /*!*border-right: 0;*!*/
    /*!*border-top: 1px solid grey;*!*/
    /*!*border-bottom: 1px solid grey;*!*/
    /*border: 1px solid grey;*/
    /*background: white;*/
    /*padding: 5px 10px;*/
    /*color: grey;*/
    /*font-size: 12px;*/
    /*cursor: pointer;*/
    /*transition: all 0.5s;*/
    /*}*/

    /*.view_detail_btn:hover {*/
    /*!*border-top: 1px solid black;*!*/
    /*!*border-bottom: 1px solid black;*!*/
    /*border: 1px solid black;*/
    /*background: black;*/
    /*color: white;*/
    /*}*/

</style>
