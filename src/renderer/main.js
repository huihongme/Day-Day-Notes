import Vue from 'vue'
// import axios from 'axios'

import App from './App'

import { remote } from 'electron'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n'
// import locale from 'iview/dist/locale/en-US'
// import zh from 'iview/dist/locale/zh-CN'

import langZh from './lang/zh'
import langEn from './lang/en'

import db from './database'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPowerOff, faPalette, faDesktop, faThumbtack, faFlag, faKey, faSignInAlt, faList, faLanguage, faQuestionCircle, faCog, faCalendarAlt, faCoffee, faStickyNote } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPowerOff, faPalette, faDesktop, faThumbtack, faFlag, faSignInAlt, faKey, faList, faLanguage, faQuestionCircle, faCog, faCalendarAlt, faCoffee, faStickyNote)

Vue.component('font-awesome-icon', FontAwesomeIcon)

const baseUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}`

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.baseUrl = baseUrl
Vue.prototype.$db = db

Vue.use(VueI18n)
Vue.use(ElementUI)

var lang = localStorage.getItem('lang')
if (!lang) lang = 'zh'
store.dispatch('setLang', lang)
// store.dispatch('addWinId', null)
// store.dispatch('notesInit')

console.log(remote.app.getPath('userData'))

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: lang, // set locale
  messages: {
    en: langEn,
    zh: langZh
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
