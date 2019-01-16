<template>
    <div class="content" @click="back"></div>
</template>

<script>
export default {
  name: "page404",
  mounted() {
    var canvas = document.createElement('canvas');
    var height = canvas.height = window.innerHeight;
    var width = canvas.width = window.innerWidth;
    var ctx = canvas.getContext('2d');
    document.querySelector('.content').appendChild(canvas);

    //document.body.appendChild(canvas);

    function random(min, max) {
      return Math.random() * (max - min + 1) + min;
    }

    function range_map(value, in_min, in_max, out_min, out_max) {
      return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    var word_arr = [];
    var txt_min_size = 5;
    var txt_max_size = 25;
    var keypress = false;
    var acclerate = 2;
    for (var i = 0; i < 8; i++) {
      word_arr.push({
        x: random(0, width),
        y: random(0, height),
        text: '404',
        size: random(txt_min_size, txt_max_size)
      });

      word_arr.push({
        x: random(0, width),
        y: random(0, height),
        text: 'page not found',
        size: random(txt_min_size, txt_max_size)
      });

      word_arr.push({
        x: random(0, width),
        y: random(0, height),
        text: '点击返回',
        size: random(txt_min_size, txt_max_size)
      });

      word_arr.push({
        x: random(0, width),
        y: random(0, height),
        text: '404',
        size: Math.floor(random(txt_min_size, txt_max_size))
      });
    }

    function render() {
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#fff";
      for (var i = 0; i < word_arr.length; i++) {
        ctx.font = word_arr[i].size + "px sans-serif";
        var w = ctx.measureText(word_arr[i].text);
        ctx.fillText(word_arr[i].text, word_arr[i].x, word_arr[i].y);

        if (keypress) {
          word_arr[i].x += range_map(word_arr[i].size, txt_min_size, txt_max_size, 2, 4) * acclerate;
        }
        else {
          word_arr[i].x += range_map(word_arr[i].size, txt_min_size, txt_max_size, 2, 3);
        }

        if (word_arr[i].x >= width) {
          word_arr[i].x = -w.width * 2;
          word_arr[i].y = random(0, height);
          word_arr[i].size = Math.floor(random(txt_min_size, txt_max_size));

        }
      }

      ctx.fill();

      requestAnimationFrame(render);
    }

    render();
  },
  methods: {
    back() {
      window.location.href='./';
    }
  },
  beforeRouteEnter(to, from, next) {
    document.body.style.overflow = 'hidden';
    next();
  },
  beforeRouteLeave(to, from, next) {
    document.body.style.overflow = 'auto';
    next();
  }
}
</script>

<style>
</style>