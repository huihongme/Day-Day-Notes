<template>
    <div class="sticker" :style="{backgroundColor: note.color||'#fff'}">
      <div class="win-bar">
        <a href="javascript:window.close()"><i class="el-icon-close" /></a>
        <a>{{note.title}}</a>
        <a @click="top" :class="isTop?'top':''">
          <el-button type="text" size="small"><font-awesome-icon icon="thumbtack" :style="{fontSize: '16px'}"></font-awesome-icon></el-button>
        </a>
      </div>
      <div class="content" v-html="note.content"></div>
    </div>
</template>

<script>
// import FullCalendar from 'vue-fullcalendar'
import { mapState, mapActions } from 'vuex'
// import { VueEditor } from 'vue2-editor'
const {BrowserWindow} = require('electron').remote

export default {
  name: 'Sticker',
  data () {
    return {
      id: 0,
      isTop: false,
      content: '',
      isSave: false,
      note: {
        title: '',
        content: ''
      }
    }
  },
  components: {
  },
  watch: {
  },
  computed: mapState({
    close: state => state.desktop.close,
    calendarData: state => state.desktop.data
  }),
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.id = this.$route.params.id
      this.note = {
        title: null,
        content: ''
      }
      if (Number(this.id) !== 0) {
        this.find()
      }
      // 设置默认置顶
      // this.top()
    },
    find () {
      this.$db.notes.findOne({_id: this.id}, (err, doc) => {
        if (!err && doc !== null) {
          this.note = doc
        }
      })
    },
    top () {
      this.isTop = !this.isTop
      let win = BrowserWindow.fromId(Number(this.$route.params.wid))
      // win.setEnabled(this.isTop)
      win.setAlwaysOnTop(this.isTop)
    },
    ...mapActions([
      'addWinId'
    ])
  }
}
</script>

<style>
/* body{background: transparent !important} */
.desktop{display: flex;align-items: center;}
.desktop > div {
  flex: 1
}
.desktop .comp-full-calendar{background-color: rgba(255,255,255,.05);color:#fff}
.desktop .full-calendar-body .dates .week-row .day-cell.today{background-color: rgba(252,248,227,.4)}
.desktop .full-calendar-body .dates .week-row .day-cell,
.desktop .full-calendar-body .weeks,
.desktop .full-calendar-body .dates .week-row{border-color:rgba(255,255,255,.4)}
.desktop .quillWrapper .ql-snow.ql-toolbar{
  height: 30px;
  text-align: left
}
.desktop .full-calendar-body .dates .dates-events .events-week .events-day.not-cur-month .day-number{
  color: rgba(255,255,255,.5)
}


.desktop .quillWrapper .ql-toolbar.ql-snow{border:none !important;padding:4px 10px 0 !important;
  background: rgba(255,255,255,.2)
}
.desktop .ql-container.ql-snow{border:none !important}
.desktop .ql-snow .ql-toolbar button svg, .quillWrapper .ql-snow.ql-toolbar button svg{
  width: 18px !important;
  height: 18px !important;
  opacity: .9;
}
.win-bar{
  display: flex;
  width: 100%;
  height:30px;
  justify-content: space-between;
  -webkit-app-region: drag;
  background: rgba(0,0,0,0.1);
  /* align-items: flex-start; */
}
.win-bar > a{
  display: flex;
  width:30px;
  height: 30px;
  align-items: center;
  color:#fff;
  justify-content: center;
  flex: 0 0 auto;
  text-decoration: none;
  font-size: 16px;
}
#app .win-bar > a:nth-child(2){
  color: #333;
  font-size: 12px;
  flex: 1 0 auto;
}
.win-bar > a.top{
  transform: rotate(15deg);
}
.win-bar > a path{fill: #999}
.win-bar > a.top path{fill: #409EFF}
.sticker {
  width: 300px;
  height:300px;
  color: #333;
  text-align: center;
  font-size: 40px;
}

.sticker h2 {
  padding: 0;
  margin: 0;
}
.sticker .buttons{
  width:100%;
  padding:5px;
  height:35px;
  /* background: rgba(255,255,255,.5); */
}
.sticker .buttons{
  position: absolute;
  bottom:0;
  left:0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sticker .buttons .ivu-btn{vertical-align: top;}
.sticker .content{font-size: 12px;padding: 10px;text-align: left}
.note-colors{
  width: 120px;
  height: 16px;
  display: flex;
  justify-content: space-between;
}
.note-color {
  display: inline-block;
  cursor: pointer;
  width: 16px;
  height: 16px;
  position: relative;
}
.note-color::after{
  content: '';
  width: 20px;
  height: 20px;
  border: 1px solid #fff;
  position: absolute;
  left:-2px;
  top:-2px;
  display: none;
}
.note-color:hover::after, .note-color.selected::after{
  display: block;
}
</style>
