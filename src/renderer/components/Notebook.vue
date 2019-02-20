<template>
  <section class="notebook">
    <h3>
      <div style="float:right">
        <!-- <el-date-picker
          v-model="sortDate"
          size="small"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日">
        </el-date-picker> -->
        <!-- <DatePicker :open="dateOpen" type="date" :value="sortDate" :options="options" placement="top" :confirm="true" @on-change="dateChange" @on-clear="dateOpen=false" @on-ok="dateClick">
          <span @click="dateOpen = !dateOpen">
          </span>
        </DatePicker> -->
        <el-tooltip trigger="hover" content="添加" placement="right">
          <span @click="$store.dispatch('setModalVisible', true)"> <i class="el-icon-circle-plus-outline"/></span>
        </el-tooltip>
      </div>
      <el-popover
        placement="top-start"
        title=""
        width="200"
        v-model="visible"
        trigger="click">
        <a slot="reference" @click.native="visible=!visible">{{$t('note.title')}} <i class="el-icon-arrow-down" /></a>
        <div>
          <el-input clearable @clear="findNotebook" size="small" :placeholder="$t('placeholder.note_search')" v-model="title">
            <el-button icon="el-icon-search" slot="append" @click="findNotebook"/>
          </el-input>
        </div>
      </el-popover>
    </h3>
    <!-- @scroll="handleScroll"> -->
    <div class="notebook-group" v-if="notes.length > 0">
      <div v-for="(group, ind) in splitGroup(notes)">
        <div class="notebook-date">{{ind}}</div>
        <div class="notebook-item" :class="{'selected':selectId == note._id}" @click="changeNote(note)" v-for="(note, index) in group">
          <el-tooltip :content="$t('note.todesktop')" placement="right" :style="{float: 'right'}">
            <el-button @click.stop="toDesktop(note._id)" type="text" size="small"><font-awesome-icon icon="desktop" :style="{fontSize: '16px', color: windows[note._id]!==undefined?'#409EFF':'#999'}"></font-awesome-icon></el-button>
          </el-tooltip>
          <h5>{{note.title}}</h5>
          <p>{{note.updated_at | splitDate}}</p>
        </div>
      </div>
    </div>
    <div class="notebook-group" v-else>
      <div title="您还没有便签" selected label="去创建吧" />
    </div>
    <div class="page-bottons">
      <el-button type="text" style="float:right" icon="el-icon-arrow-right" @click="nextPage"></el-button>
      <el-button type="text" :disabled="page==1" style="" icon="el-icon-arrow-left" @click="prevPage"></el-button>
    </div>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  const { BrowserWindow } = require('electron').remote
  const { screen } = require('electron')
  const size = screen.getPrimaryDisplay().size
  const _ = require('lodash')

  export default {
    name: 'Notebook',
    components: {
    },
    data () {
      return {
        title: '',
        busy: false,
        visible: false,
        sortDate: '',
        dateOpen: false,
        options: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        }
      }
    },
    computed: mapState({
      selectId: state => state.notes.select_id,
      page: state => state.notes.page,
      note: state => state.notes.note,
      notes: state => state.notes.data,
      windows: state => state.base.windows
    }),
    filters: {
      splitDate (val) {
        let date = val.split(' ')[1]
        return date
      }
    },
    mounted () {
      this.findNotebook()
    },
    methods: {
      objectLength (obj) {
        var size = 0
        for (let k in obj) {
          if (obj.hasOwnProperty(k)) size++
        }
        return size
      },
      toDesktop (id) {
        if (this.objectLength(this.windows) >= 5) {
          this.$notify.error('只能固定5个便签')
          return false
        }
        if (this.getWin(id)) {
          this.getWin(id).focus()
          return
        }
        let href = window.location.href
        let url = href.substring(0, href.indexOf('#') + 1)
        var w = 300 // size.width
        var h = 300 // size.height
        var x = size.width - 300 - 10
        var y = 10

        let win = new BrowserWindow({
          width: w,
          height: h,
          x: x,
          y: y,
          show: false,
          simpleFullscreen: true,
          // titleBarStyle: 'customButtonsOnHover',
          backgroundColor: '#00ffffff',
          // type: 'desktop',
          // hasShadow: false,
          // titleBarStyle: 'hidden',
          // vibrancy: 'dark',
          transparent: true,
          opacity: 1,
          frame: false
        })
        // win.setAlwaysOnTop(true)
        win.on('close', () => {
          this.delWinId(id)
          win = null
        })

        win.loadURL(url + `/desktop/${id}/${win.id}`)
        win.once('ready-to-show', () => {
          // win.setTitle(this.id)
          this.addWinId({id: id, wid: win.id})
          win.show()
        })
      },
      // handleScroll (e) {
      //   var currentScrollPosition = e.srcElement.scrollTop
      //   if (currentScrollPosition > this.scrollPosition) {
      //     if (currentScrollPosition === e.srcElement.scrollHeight - e.target.clientHeight) {
      //       this.nextPage()
      //     }
      //   }
      //   this.scrollPosition = currentScrollPosition
      // },
      findNotebook () {
        let where = []
        this.visible = false
        if (this.title) {
          where.push({name: 'title', value: this.title, symbol: '$regex'})
        }
        this.getNotes({where: where})
      },
      getWin (id) {
        let wid = this.windows[id]
        if (wid !== undefined && wid !== '') {
          return BrowserWindow.fromId(wid)
        }
        return false
      },
      splitGroup (data) {
        let res = _.groupBy(data, e => e.updated_at.split(' ')[0])
        return res
      },
      changeNote (data) {
        this.setNote(data)
      },
      dateChange (date) {
        this.sortDate = date + ' 23:59:59'
      },
      dateClick () {
        this.dateOpen = !this.dateOpen
        let where = [{name: 'updated_at', value: this.sortDate, symbol: '$lte'}]
        this.getNotes({where: where})
      },
      ...mapActions([
        'getNotes',
        'setLoading',
        'nextPage',
        'prevPage',
        'setNote',
        'addWinId',
        'delWinId'
      ])
    }
  }
</script>

<style>
 .notebook{
   position: relative;
   height: 100%;
   /* display: flex; */
   /* flex-direction: column; */
 }
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
   position:absolute;
   top: 30px;
   left:0;
   bottom:20px;
   overflow-y: scroll;
   /* flex:1 0 auto; */
 }
 .page-bottons{position: absolute;bottom:-10px;left:0;z-index: 10;width: 100%;}
 .notebook-group .ivu-cell{
   padding-left: 5px;
   padding-right: 5px;
   border-radius: 4px;
   margin-bottom: 5px
 }
 .notebook-group .notebook-item{
   padding:10px;
   border-radius: 4px;
   background-color: rgba(255,255,255,.6);
   margin-bottom: 5px;
   cursor: pointer;
 }
 .notebook-group .notebook-item:hover,
 .notebook-group .notebook-item.selected{
   background: rgba(0,0,0,.05);
 }
 .notebook-group .notebook-date{
   color:#999;
   font-size:12px;
   border-bottom:1px solid #ccc;
   margin-bottom: 10px;
   padding:5px 0;
 }
 .notebook-group .notebook-item.selected a{color:#333}
 .notebook-group .notebook-item h5{color:#666;margin: 0 0 5px}
 .notebook-group .notebook-item p{
   font-size: 12px;
   color:#999;
 }
</style>
