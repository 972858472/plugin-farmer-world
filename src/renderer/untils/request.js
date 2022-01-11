import axios from 'axios'
import {Message} from 'element-ui'
import store from '../store'
import router from '../router'

const server = axios.create({
  // baseURL: 'http://auth.yhexs.com/api',
  // baseURL: 'http://test.yhexs.com/api',
  baseURL: 'http://plugin.admin/api',
  timeout: 3000,
  successCode: 200
})

server.interceptors.request.use(
  config => {
    if (store.state.Counter.api_token) {
      config.headers['Authorization'] = 'Bearer ' + store.state.Counter.api_token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

server.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      if (res.code === 401) {
        store.dispatch('loginOut')
        store.dispatch('closeChild')
        router.push('/login')
        return
      }
      if (res.code === 402) {
        const {ipcRenderer} = require('electron')
        ipcRenderer.sendSync('sync-message', 'closeAuto')
      }
      Message.error(res.msg)
      return Promise.reject(res)
    }
    return res.data
  },
  error => {
    Message.error('系统错误')
    return Promise.reject(error)
  }
)

export default server
