import db from '../../database'
import dateFormat from 'dateformat'
const _ = require('lodash')
var saveFlag
const state = {
  modal_visible: false,
  select_id: '',
  page: 1,
  per_page: 20,
  current_page: 1,
  where: [],
  total: 1,
  note: {_id: '', title: null, content: ''},
  data: [],
  calendarData: []
}

function formatWhere (where) {
  let str = {}
  for (let k in where) {
    let obj = {}
    let regex = where[k]['value']
    if (where[k]['symbol'] === '$regex') regex = new RegExp(where[k]['value'])
    obj[where[k]['symbol']] = regex
    str[where[k]['name']] = obj
  }
  return str
}

const mutations = {
  SETMODALVISIBLE (state, value) {
    state.modal_visible = value
  },
  SETSELECTID (state, value) {
    state.select_id = value
  },
  SETDATA (state, data) {
    if (data === null) {
      state.data = []
      return
    }
    // let newData = Object.assign(data, state.data)
    state.data = data
  },
  SETCALENDERDATA (state, data) {
    for (let k in data) {
      data[k].start = data[k].updated_at.split(' ')[0]
      data[k].end = data[k].updated_at.split(' ')[0]
    }
    state.calendarData = data
  },
  SETNOTE (state, data) {
    state.note = data
  },
  SETWHERE (state, where) {
    state.where = where
  },
  SETPERPAGE (state, value) {
    state.per_page = value
  },
  SETPAGE (state, value) {
    state.page = value
  },
  SETTOTAL (state, value) {
    state.total = value
  },
  DELDATA (state, id) {
    for (var k in state.data) {
      if (state.data.hasOwnProperty(k) && state.data[k]._id === id) {
        state.data.splice(k, 1)
        if (state.data[0]) state.select_id = state.data[0]._id
      }
    }
  }
}

const actions = {
  setNote ({dispatch, commit, state}, value) {
    if (value) {
      commit('SETSELECTID', value._id)
      commit('SETNOTE', value)
    } else {
      commit('SETNOTE', {title: null, content: ''})
    }
  },
  setModalVisible ({commit}, value) {
    commit('SETMODALVISIBLE', value)
  },
  setNotes ({commit}, data) {
    commit('SETDATA', data)
  },
  setPerPage ({dispatch, commit, state}, page) {
    commit('SETPERPAGE', page)
    // dispatch('getNotes', state.where)
  },
  notesInit ({commit}) {
    commit('SETPAGE', 1)
    commit('SETPERPAGE', 15)
    commit('SETDATA', null)
  },
  setPage ({dispatch, commit, state}, page) {
    commit('SETPAGE', page)
    // dispatch('getNotes', state.where)
  },
  nextPage ({dispatch, commit, state}) {
    db.notes.count(state.where, (err, count) => {
      if (!err) {
        if (state.page + 1 <= Math.ceil(count / state.per_page)) {
          dispatch('getNotes', {where: state.where, page: state.page + 1})
        }
      }
    })
  },
  prevPage ({dispatch, commit, state}) {
    if (state.page - 1 >= 1) {
      dispatch('getNotes', {where: state.where, page: state.page - 1})
    }
  },
  getNotes ({dispatch, commit, state}, data = {page: 1, where: []}) {
    let {page = state.page, where} = data
    let skip = 0
    let perPage = state.per_page
    if (Number(page) < 1) page = 1
    skip = (page - 1) * perPage
    let findWhere = formatWhere(where)
    //
    // for (let k in where) {
    //   let obj = {}
    //   let regex = new RegExp(where[k]['value'])
    //   findWhere[where[k]['name']] = obj[where[k]['symbol']] = regex
    // }

    commit('SETWHERE', findWhere)
    return db.notes.find(findWhere).sort({updated_at: -1}).skip(skip).limit(perPage).exec((err, docs) => {
      if (!err) {
        commit('SETDATA', docs)
        commit('SETPAGE', page)
        commit('SETMODALVISIBLE', false)
        setTimeout(() => {
          dispatch('setLoading', false)
        }, 500)
        if (docs.length > 0) dispatch('setNote', docs[0])
      }
    })
  },
  getCalenderData ({dispatch, commit, state}, data = {where: []}) {
    let {where} = data
    let findWhere = formatWhere(where)
    console.log(findWhere)
    return db.notes.find(findWhere).exec((err, docs) => {
      console.log(docs)
      if (!err) {
        commit('SETCALENDERDATA', docs)
        setTimeout(() => {
          dispatch('setLoading', false)
        }, 500)
      }
    })
  },
  getNote ({dispatch, commit, state}, id) {
    dispatch('setLoading', true)
    commit('SETNOTE', {title: null, content: ''})
    if (Number(state.select_id) === 0 || state.select_id === '') return
    db.notes.findOne({_id: id}, (err, doc) => {
      if (!err && doc !== null) {
        dispatch('setNote', doc)
      }
      setTimeout(() => {
        dispatch('setLoading', false)
      }, 500)
    })
  },
  saveNote ({dispatch, commit, state}, doc) {
    if (!_.isPlainObject(doc)) console.log(new Error('参数必须是一个对象'))
    let now = new Date()
    let date = dateFormat(now, 'yyyy-mm-dd HH:MM:ss')
    // 更新时间
    doc.updated_at = date
    dispatch('setSaveing', true)
    if (!doc._id) {
      // 创建时间
      doc.created_at = date
      // 插入新数据
      db.notes.insert(doc, (err, newDoc) => {
        if (!err) {
          commit('SETMODALVISIBLE', false)
          commit('SETSELECTID', newDoc._id)
          dispatch('getNotes')
          clearTimeout(saveFlag)
          saveFlag = setTimeout(() => {
            dispatch('setSaveing', false)
          }, 3000)
        }
      })
    } else {
      // 更新数据
      db.notes.update({ _id: doc._id }, {$set: doc}, {}, (err, newDoc) => {
        if (!err) {
          dispatch('getNotes')
        }
        clearTimeout(saveFlag)
        saveFlag = setTimeout(() => {
          dispatch('setSaveing', false)
        }, 3000)
      })
    }
  },
  delNotes ({dispatch, commit}, id) {
    db.notes.remove({ _id: id }, {}, (err) => {
      if (!err) {
        dispatch('setNote', null)
        dispatch('getNotes')
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
