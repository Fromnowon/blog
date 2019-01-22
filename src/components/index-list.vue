<template>
    <div class="content" v-loading="loading">
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
    .content{

    }
</style>