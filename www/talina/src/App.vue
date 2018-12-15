<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

button {
  height: 45px;
  line-height: 18px;
  font-size: 16px;
}

@media (max-width: 991px) {
  .container {
    margin-left: auto;
    margin-right: auto;
    padding-right: 15px;
    padding-left: 15px;
    width: 100%;
    max-width: inherit;
  }
}
</style>
