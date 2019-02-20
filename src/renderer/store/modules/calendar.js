const state = {
  close: false,
  reload: false,
  data: []
}

const mutations = {
  ADD (state, data) {
    state.data.push(data)
  },
  CLOSE (state, value) {
    state.close = value
  },
  RELOAD (state, value) {
    state.reload = value
  }
}

const actions = {
  addCalendarData ({commit}, value) {
    commit('ADD', value)
  },
  winClose ({commit}, value) {
    commit('CLOSE', value)
  },
  winReload ({commit}, value) {
    commit('RELOAD', value)
  }
}

export default {
  state,
  mutations,
  actions
}
