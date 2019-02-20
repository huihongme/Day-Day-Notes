<template>
  <section class="calendar">
      <!-- <el-button @click="addData">添加</el-button> -->
      <!-- <el-button @click="toDesktop">固定到桌面</el-button> -->
    <full-calendar :events="calendarData" class="note-calendar" lang="zh"
       :style="{width: '100%'}"
       @changeMonth="changeMonth"
       @eventClick="eventClick"
       @dayClick="dayClick"
       @moreClick="moreClick">
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

export default {
  name: 'Calendar',
  data () {
    return {
      note: {},
      noteVisible: false
    }
  },
  components: {
    FullCalendar
  },
  watch: {
  },
  computed: mapState({
    calendarData: state => state.notes.calendarData
  }),
  mounted () {
    // this.getCalenderData()
  },
  methods: {
    addData () {
      let data = {
        title: 'eeeeeeeee', // 事件内容
        start: '2019-02-01', // 事件开始时间
        end: '2019-02-02', // 事件结束时间
        cssClass: 'red' // 事件的样式   class名（由后台返回数据）  red为自己定义的class名
      }
      this.addCalendarData(data)
    },
    // 选择月份
    changeMonth (start, end, current) {
      let lastDay = this.getLastDay(current)
      let month = Number(lastDay.getMonth() + 1)
      month = month <= 9 ? ('0' + month) : month
      let date = lastDay.getFullYear() + '-' + month + '-' + lastDay.getDate()
      let where = [{name: 'updated_at', value: date, symbol: '$lte'}]
      this.getCalenderData({where: where})
    },
    getLastDay (d) {
      var current = new Date(d)
      var currentMonth = current.getMonth()
      var nextMonth = ++currentMonth
      var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1)
      var minusDate = 1000 * 60 * 60 * 24
      return new Date(nextMonthDayOne.getTime() - minusDate)
    },
    // 点击事件
    eventClick (event, jsEvent, pos) {
      this.noteVisible = true
      this.note = event
      console.log('eventClick', event, jsEvent, pos)
    },
    // 点击当天
    dayClick (day, jsEvent) {
      console.log('dayClick', day, jsEvent)
    },
    // 查看更多
    moreClick (day, events, jsEvent) {
      console.log('moreCLick', day, events, jsEvent)
    },
    ...mapActions([
      'getCalenderData',
      'winClose',
      'addCalendarData'
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
