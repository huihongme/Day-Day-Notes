<template>
  <layout-main class="notes">
    <notebook slot="nav"></notebook>
    <note-detail slot="section"></note-detail>
    <!-- <router-view slot="section"></router-view> -->
  </layout-main>
</template>

<script>
  import LayoutMain from './LayoutMain'
  import Notebook from '../components/Notebook'
  import NoteDetail from '../components/NoteDetail'
  // const {BrowserWindow} = require('electron').remote
  // const {screen} = require('electron')
  // const size = screen.getPrimaryDisplay().size
  // const path = require('path')
  // import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'Notes',
    data () {
      return {
        note: {}
      }
    },
    components: {
      LayoutMain, Notebook, NoteDetail
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
</style>
