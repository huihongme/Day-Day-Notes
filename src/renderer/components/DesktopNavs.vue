<template>
  <section class="notebook">
    <h3>
        <a>桌面设置</a>
    </h3>
    <CellGroup class="notebook-group" v-if="notes.length>0" @on-click="setSelectId">
      <Cell title="设置"  label="设置桌面" :to="'/desktop/setup'" :name="1"/>
    </CellGroup>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Notebook',
    components: {
    },
    data () {
      return {
      }
    },
    computed: mapState({
      selectId: state => state.notes.select_id,
      notes: state => state.notes.data
    }),
    mounted () {
    },
    methods: {
      setSelectId (id) {
        console.log(id)
      },
      ...mapActions([
        'getNotes'
      ])
    }
  }
</script>

<style>
 .notebook{position: relative;height: 100%}
 .notebook h3{
   font-size: 14px;
   font-weight: normal;
   border-bottom:1px solid #ddd;
   padding-top:4px;
   padding-bottom:6px;
   margin-bottom: 8px;
 }
 .notebook-group {
   width:100%;
   position: absolute;
   top:38px;
   bottom:0;
   left:0;
   overflow-y: scroll;
 }
 .notebook-group .ivu-cell{
   padding-left: 5px;
   padding-right: 5px;
   border-radius: 4px;
   margin-bottom: 5px
 }

 .notebook-group .ivu-cell-selected{
   background: rgba(0,0,0,.05);
 }
 #app .notebook-group .ivu-cell-selected a{color:#333}
 .notebook-group .ivu-cell-selected .ivu-cell-label{color:#999}
 .notebook-sort .ivu-poptip-body{padding: 8px}
</style>
