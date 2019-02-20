import Datastore from 'nedb'
import path from 'path'
import { app, remote } from 'electron' // 引入remote模块

const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块

const STORE_PATH = APP.getPath('userData')
// 实例化连接对象（不带参数默认为内存数据库）
const db = {}
// console.log(path.join(electron.app.getPath('userData'), 'notes.db'))
db.notes = new Datastore({
  autoload: true,
  filename: path.join(STORE_PATH, 'static/notes.db')
})

db.system = new Datastore({
  autoload: true,
  filename: path.join(STORE_PATH, 'static/system.db')
})

export default db
