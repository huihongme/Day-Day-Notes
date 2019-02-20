<template>
  <section class="layout-main">
    <nav>
      <slot name="nav"></slot>
    </nav>
    <section>
      <slot name="section"></slot>
      <Spin v-if="loading" fix>
          <Icon type="ios-loading" size='18' class="spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
    </section>
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'LayoutMain',
    computed: mapState({
      loading: state => state.base.loading
    })
  }
</script>

<style>
  .layout-main{
    display: flex;
  }
  .layout-main > section {
    flex: 1 1 auto;
    height: 100vh;
    padding: 15px;
    position: relative;
  }
  .layout-main > nav {
    background: rgba(0,0,0,0.04);
    width: 232px;
    min-width: 232px;
    padding:15px;
    flex: 0;
  }
</style>
