<template>
  <section class="calendar">
      <!-- <el-button @click="addData">添加</el-button> -->
      <!-- <el-button @click="toDesktop">固定到桌面</el-button> -->
    <full-calendar v-if="calendarData.length > 0 && reload" :events="calendarData" class="note-calendar" :lang="lang"
       :style="{width: '100%'}"
       @changeMonth="changeMonth"
       @eventClick="eventClick"
    >
    </full-calendar>
    <el-dialog
      title=""
      :visible.sync="noteVisible">
      <h2 slot="title">{{note.title}}</h2>
      <div class="" v-html="note.content||'--'">
      </div>
    </el-dialog>
  </section>
</template>

<script>
import FullCalendar from 'vue-fullcalendar'
import { mapState, mapActions } from 'vuex'
// const { BrowserWindow } = require('electron').remote
// const { screen } = require('electron')
// const size = screen.getPrimaryDisplay().size
// var getLastDay = (d) => {
//   var current = new Date(d)
//   var currentMonth = current.getMonth()
//   var nextMonth = ++currentMonth
//   var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1)
//   var minusDate = 1000 * 60 * 60 * 24
//   return new Date(nextMonthDayOne.getTime() - minusDate)
// }

export default {
  name: 'Calendar',
  data () {
    return {
      reload: true,
      note: {
        title: '',
        content: ''
      },
      noteVisible: false
    }
  },
  components: {
    FullCalendar
  },
  watch: {
    lang () {
      this.reload = false
      setTimeout(() => {
        this.reload = true
      }, 100)
    }
  },
  computed: mapState({
    calendarData: state => state.notes.calendarData,
    lang: state => state.base.lang
  }),
  mounted () {
  },
  methods: {
    // 选择月份
    changeMonth (start, end, current) {
      console.count()
      // let lastDay = getLastDay(current)
      // let month = Number(lastDay.getMonth() + 1)
      // month = month <= 9 ? ('0' + month) : month
      // let date = lastDay.getFullYear() + '-' + month + '-' + lastDay.getDate()
      // let where = [{name: 'updated_at', value: date, symbol: '$lte'}]
      // this.getCalenderData({where: where})
    },
    // 点击事件
    eventClick (event) {
      this.noteVisible = true
      this.note = event
    },
    // 点击当天
    // dayClick (day, jsEvent) {
    //   console.log('dayClick', day, jsEvent)
    // },
    // // 查看更多
    // moreClick (day, events, jsEvent) {
    //   console.log('moreCLick', day, events, jsEvent)
    // },
    ...mapActions([
      'getCalenderData',
      'winClose'
    ])
  }
}
</script>

<style>
  .note-calendar{
    display: flex;
    flex-direction: column;
  }
  .note-calendar .full-calendar-header{
    flex: 0
  }
  .note-calendar .full-calendar-body{
    display: flex;
    flex-direction: column;
    flex: 1 0 auto
  }
  .note-calendar .full-calendar-body .dates{
    flex: 1 0 auto
  }
  .note-calendar .full-calendar-body .dates-bg{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .note-calendar .full-calendar-body .dates-events{
    /* height: 100%; */
  }
  .note-calendar .full-calendar-body .dates .week-row .day-cell{
    min-height: 110px;
  }
  .calendar {
    height: 100%;
  }
</style>
