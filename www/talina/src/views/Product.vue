<template>
  <div>
    <navbar/>
    <div class="container">
      <div class="products">
        <div class="product row" v-if="product !== null">
          <div class="product-images col-xs-12 col-sm-6 col-lg-6">
            <div class="product-image-wrapper row">
              <div class="col-xs-12 col-lg-2 d-none d-lg-block d-xl-block">
                <div class="product-thumbnails">
                  <thumbnail
                    v-for="(image, index) in product.images"
                    :key="index"
                    :image="image"
                    :index="index"
                    :current-image="currentImage"
                    @select="select"
                  />
                </div>
              </div>
              <div class="col-xs-12 col-lg-10">
                <img class="product-image img-fluid" :src="product.images[currentImage]" height="50%">
              </div>
            </div>
          </div>
          <div class="product-details col-xs-12 col-sm-6 col-lg-6">
            <h2 class="product-name">{{product.name}}</h2>
            <h1 class="product-caption">{{product.caption}}</h1>
            <div class="product-price">
              <div>{{euros}}.{{cents}} {{currentSku.currency.toUpperCase()}}</div>
            </div>
            <p class="product-description">{{product.description}}</p>
            <hr>
            <div class="product-sizes-list row">
              <sku
                v-for="(sku, index) in product.skus"
                :key="index"
                :sku="sku"
                :current-sku="currentSku"
                @select-sku="selectSKU"
              />
            </div>
            <hr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Thumbnail from "@/components/image";
import Sku from "@/components/sku";
import Navbar from "@/components/nav";

export default {
  name: "product",
  components: {
    Thumbnail,
    Sku,
    Navbar
  },
  data() {
    return {
      product: null,
      currentImage: 0,
      currentSku: null
    };
  },
  methods: {
    select(e) {
      this.currentImage = e;
    },
    selectSKU(e) {
      this.currentSku = e;
    }
  },
  async created() {
    const res = await fetch("https://getproduct-8tfxc0mgi.now.sh/", {
      method: "GET"
    });
    const response = await res.json();
    const products = response.data;
    this.product = products[0];
    this.currentSku = this.product.skus[0];
  },
  computed: {
    price: function() {
      return this.currentSku !== null ? this.currentSku.price + "" : "";
    },
    euros: function() {
      return this.price.substring(0, this.price.length - 2);
    },
    cents: function() {
      return this.price.slice(-2);
    }
  }
};
</script>

<style>
.product-thumbnails {
  margin-top: 20px;
  margin-bottom: 20px;
}

.product-thumbnail {
  margin-bottom: 20px;
  cursor: pointer;
}

.product-thumbnail.selected {
  border-bottom: 2px solid black;
  padding-bottom: 5px;
}

.product-image-wrapper {
}

.product-image {
  padding: 30px;
  height: 60%;
}

.product-taxes {
  color: #999;
  font-size: 14px;
  font-weight: normal;
  line-height: 18px;
}

.product-name {
  font-size: 15px;
  text-transform: uppercase;
  font-weight: bold;
  text-align: left;
}

.product-caption {
  text-align: left;
  font-size: 24px;
  line-height: 28px;
}

.product-description {
  text-align: left;
}

.product-sku {
  cursor: pointer;
  font-size: 24px;
  margin-right: 25px;
  font-weight: bold;
}

.product-sku.selected {
  text-decoration: underline;
}

.product-price {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  line-height: 28px;
}

.product-selected-size {
  margin-bottom: 15px;
  clear: both;
  margin-top: 15px;
}

.product-sizes-list {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 0;
  margin-left: 0;
}

.product-details {
  padding-top: 0;
}

@media (max-width: 767px) {
  .product-selected-size {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    margin: 0;
    height: 55px;
    line-height: 55px;
  }
}

@media (max-width: 767px) {
  #products {
    padding-bottom: 120px;
  }
}
</style>
