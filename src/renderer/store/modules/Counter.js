const state = {
  main: 0,
  username: null,
  gameAccount: null,
  api_token: null,
  gameView: null,
  isOpen: false,
  isAuto: false
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  },
  LOGIN_SUCCESS (state, user) {
    state.username = user.account
    state.api_token = user.api_token
  },
  CHANGE_GAME_ACCOUNT (state, gameAccount) {
    state.gameAccount = gameAccount
  },
  LOGIN_OUT (state) {
    state.username = null
    state.api_token = null
    state.gameAccount = null
    window.location.reload()
  },
  OPEN_CHILD (state) {
    state.isOpen = true
    const BrowserWindow = require('electron').remote.BrowserWindow
    global.ChildWindow = new BrowserWindow({
      height: 800,
      width: 1200
    })
    global.ChildWindow.loadURL('https://play.farmersworld.io/')
    global.ChildWindow.on('close', function (e) {
      const store = require('../../store')
      store.default.dispatch('changeIsOpen')
      global.ChildWindow = null
    })
  },
  INIT_HELP () {
    const fs = require('fs')
    const readFile = fs.readFileSync(__static + '/game/help.js')
    const jsString = readFile.toString()
    const webContent = global.ChildWindow.webContents
    webContent.executeJavaScript(jsString).then(function (res) {
      console.log(res)
    })
  },
  CHANGE_IS_OPEN (state) {
    state.isOpen = false
    window.location.reload()
  },
  CLOSE_CHILD (state) {
    state.isOpen = false
    if (global.ChildWindow) {
      global.ChildWindow.close()
      global.ChildWindow = null
    }
  },
  GET_DATA (state) {
    console.log(123)
  }
}

const actions = {
  someAsyncTask ({commit}) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  loginSuccess ({commit}, user) {
    commit('LOGIN_SUCCESS', user)
  },
  loginOut ({commit}) {
    commit('LOGIN_OUT')
  },
  openChild ({commit}) {
    commit('OPEN_CHILD')
    commit('INIT_HELP')
  },
  closeChild ({commit}) {
    commit('CLOSE_CHILD')
  },
  changeIsOpen ({commit}) {
    commit('CHANGE_IS_OPEN')
  },
  getData ({commit}) {
    commit('GET_DATA')
  }
}

export default {
  state,
  mutations,
  actions
}
