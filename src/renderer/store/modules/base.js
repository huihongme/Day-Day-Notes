const state = {
  message: '',
  loading: false,
  saveing: false,
  lang: 'zh',
  windows: {}
}

const mutations = {
  SETLOADING (state, value) {
    state.loading = value
  },
  SETSAVEING (state, value) {
    state.saveing = value
  },
  SETMESSAGE (state, value) {
    state.modal_visible = value
  },
  SETLANG (state, value) {
    state.lang = value
  },
  ADDWINID (state, data) {
    if (data === null) {
      state.windows = {}
    } else {
      state.windows[data.id] = data.wid
    }
  },
  DELWINID (state, data) {
    delete state.windows[data]
  }
}

const actions = {
  setLoading ({commit}, value) {
    commit('SETLOADING', value)
  },
  setSaveing ({commit}, value) {
    commit('SETSAVEING', value)
  },
  setLang ({commit}, value) {
    commit('SETLANG', value)
  },
  setMessage ({commit}, value) {
    commit('SETMESSAGE', value)
  },
  addWinId ({commit}, data) {
    commit('ADDWINID', data)
  },
  delWinId ({commit}, data) {
    commit('DELWINID', data)
  }
}

export default {
  state,
  mutations,
  actions
}
