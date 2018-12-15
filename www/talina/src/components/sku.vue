<template>
  <div :key="sku.id" :class="className" @click="selectSKU">{{sku.attributes.size}}</div>
</template>

<script>
export default {
  name: "sku",
  props: {
    sku: Object,
    currentSku: Object
  },
  computed: {
    className: function() {
      return {
        "col-xs-2 product-sku": true,
        selected: this.currentSku.id === this.sku.id
      };
    }
  },
  methods: {
    selectSKU() {
      this.$emit("select-sku", this.sku);
    }
  }
};
</script>

<style>
</style>
