<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'DayDayNotes',
    created () {
      this.$store.dispatch('addWinId', null)
    },
    methods: {
    }
  }
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: system, -apple-system, '.SFNSText-Regular', 'SF UI Text', 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, sans-serif;
  overflow: hidden;
  background-color: transparent
}
ul, li{list-style: none;}
#app .ivu-btn-primary{background-color: rgba(67, 77, 136, .9);border-color:rgba(67, 77, 136, .9);}
#app a{color:rgba(67, 77, 136, .9);}
#app .ivu-cell-selected, #app .ivu-cell-selected:hover{color:#999}
</style>
