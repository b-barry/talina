<template>
<div>
  <img :key="index" :class="thumbnail" @click="select" :src="image" width="75"></div>
</template>

<script>
export default {
  name: "thumbnail",
  props: {
    image: String,
    index: Number,
    currentImage: Number
  },
  data() {
    return {};
  },
  computed: {
    thumbnail: function() {
      return {
        "product-thumbnail": true,
        selected: this.index === this.currentImage
      };
    }
  },
  methods: {
    select() {
      this.$emit("select", this.index);
    }
  }
};
</script>

<style>
</style>
