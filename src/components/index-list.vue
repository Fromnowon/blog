<template>
    <div class="content">
        <div class="loading" v-show="loading">
            <i class="el-icon-loading"></i>
        </div>
        <topicItem @loaded="loaded"></topicItem>
    </div>
</template>

<script>
import topicItem from './topic-item'

export default {
  name: "index-list",
  data() {
    return {
      loading: true,
    }
  },
  methods: {
    loaded() {
      this.loading = false;
    }
  },
  components: {
    topicItem
  }
}
</script>

<style scoped>
    .loading {
        font-size: 30px;
        padding-top: 100px;
        text-align: center;
        height: 0;
        width: 100%;
    }
</style>