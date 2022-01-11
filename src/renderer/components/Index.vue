<template>
  <div>
    <el-card class="flex">
      <el-tag>用户名：{{ $store.state.Counter.username }}</el-tag>
      <el-tag type="success">金条：{{ userinfo.bullion }}</el-tag>
      <el-tag type="info">木材：{{ userinfo.wood }}</el-tag>
      <el-tag type="warning">肉：{{ userinfo.meat }}</el-tag>
      <el-tag type="danger">能量值：{{ userinfo.energy }}</el-tag>
      <el-button-group>
        <el-button @click="checkUpdate" size="small">V{{ version }} 检查版本</el-button>
        <el-button @click="logout" size="small">登出</el-button>
      </el-button-group>
    </el-card>
    <el-card>
      <el-form :model="config" size="mini" style="width: 100%">
        <el-form-item label="能量低于多少吃肉：">
          <el-input-number v-model="config.minEnergy"></el-input-number>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="success" v-if="!$store.state.Counter.isOpen" @click="start">启动游戏</el-button>
      <el-button type="danger" v-else @click="stop">关闭游戏</el-button>
      <el-button type="primary" v-if="!isAuto" @click="openAuto">智能工作</el-button>
      <el-button type="danger" v-else @click="closeAuto">关闭智能</el-button>
<!--      <el-button type="primary" v-if="!isOpenDevTools" @click="openDevTools">开启开发者工具</el-button>-->
<!--      <el-button type="danger" v-else @click="closeDevTools">关闭开发者工具</el-button>-->
<!--      <el-button @click="log.switch = true">日志</el-button>-->
<!--      <el-button @click="restartGame">自动重启游戏</el-button>-->
    </el-card>
    <el-card>
      <el-tabs type="border-card" style="width: 100%" :stretch="true">
        <el-tab-pane label="FarmerWorld">
          <el-table :data="tableData[0]" border height="430px">
            <el-table-column type="index" label="ID">
            </el-table-column>
            <el-table-column prop="name" label="物品名称"></el-table-column>
            <el-table-column prop="durable" label="耐久度"></el-table-column>
            <el-table-column prop="level" label="等级"></el-table-column>
            <el-table-column prop="content" label="内容" min-width="150">
              <template slot-scope="scope">
                <div v-for="(value,title) in scope.row.content" style="display: flex;justify-content: space-between">
                  <div>{{ title }}：</div>
                  <div>{{ value }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="点击次数" width="80">
              <template slot-scope="scope">
                {{ equipmentClickTimes[0][scope.$index] ? equipmentClickTimes[0][scope.$index].time : 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间"></el-table-column>
          </el-table>
        </el-tab-pane>
<!--        <el-tab-pane label="种地">-->
<!--          <el-table :data="tableData[2]" border height="430px">-->
<!--            <el-table-column type="index" label="ID">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="name" label="物品名称"></el-table-column>-->
<!--            <el-table-column prop="durable" label="进度"></el-table-column>-->
<!--            <el-table-column prop="level" label="等级"></el-table-column>-->
<!--            <el-table-column prop="content" label="内容" min-width="150">-->
<!--              <template slot-scope="scope">-->
<!--                <div v-for="(value,title) in scope.row.content" style="display: flex;justify-content: space-between">-->
<!--                  <div>{{ title }}：</div>-->
<!--                  <div>{{ value }}</div>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="点击次数" width="80">-->
<!--              <template slot-scope="scope">-->
<!--                {{ equipmentClickTimes[2][scope.$index] ? equipmentClickTimes[2][scope.$index].time : 0 }}-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="time" label="时间"></el-table-column>-->
<!--          </el-table>-->
<!--        </el-tab-pane>-->
      </el-tabs>
    </el-card>


    <el-dialog title="仅显示当日日志" :visible.sync="log.switch">
      <div style="display: flex;justify-content: flex-end">
        <el-button @click="getLogData" size="mini" type="info">刷新</el-button>
      </div>
      <el-tabs v-model="log.activeName" @tab-click="getLogData">
        <el-tab-pane label="金币" name="bullion">
        </el-tab-pane>
        <el-tab-pane label="木材" name="wood">
        </el-tab-pane>
        <el-tab-pane label="肉" name="meat">
        </el-tab-pane>
        <el-table :data="log.data" height="300px">
          <el-table-column property="created_at" label="时间"></el-table-column>
          <el-table-column property="diff" label="变化量">
            <template slot-scope="scope">
              <span :style="{color: getColor(scope.row.diff).color}">
                {{ scope.row.diff }}
                <i :class="getColor(scope.row.diff).icon"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column property="amount" label="变化后余额"></el-table-column>
        </el-table>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script>

import Vue from 'vue'
import {addLog, changeState, getAccountInfo, getLog, initEquipment} from '../api'

export default {
  data () {
    return {
      version: process.env.version,
      log: {
        switch: false,
        activeName: 'bullion',
        data: []
      },
      userinfo: {
        bullion: 0,
        wood: 0,
        meat: 0,
        energy: 0
      },
      current: {
        meat: 0,
        energy: 0
      },
      config: {
        minEnergy: 200
      },
      equipment: {
        current: 0,
        // 是否第一次加载
        isFirst: true,
        // 是否是初始化
        isInit: true,
        // 第一个读完装备的地图
        firstMapIndex: 0
      },
      tableData: {
        0: [],
        1: [],
        2: [],
        3: []
      },
      tableDataCount: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      },
      timings: {
        map: null,
        mapLock: null,
        mapIndex: 0
      },
      isAuto: false,
      isOpenDevTools: false,
      equipmentClickTimes: {
        0: [],
        1: [],
        2: [],
        3: []
      },
      updateProgress: null
    }
  },
  methods: {
    // 获取日志数据
    getLogData () {
      const that = this
      getLog({type: that.log.activeName}).then(res => {
        that.log.data = res
      })
    },
    // 登出
    logout () {
      const that = this
      changeState({action: 'scriptState', state: 0}).then(() => {
        that.stop()
        that.$store.dispatch('loginOut')
      })
    },
    // 重启游戏
    restartGame () {
      this.closeAuto()
      const that = this
      global.ChildWindow.webContents.executeJavaScript(`
        window.location.reload()
        `, true).then(() => {
        that.$store.commit('INIT_HELP')
        global.ChildWindow.webContents.executeJavaScript(`
const intervalLogin = setInterval(() => {
          if (document.querySelector('.login-button')) {
            console.log('存在')
            document.querySelector('.login-button').click()
            document.querySelector('.login-modal-button').click()
          } else {
            console.log('清除')
            clearInterval(intervalLogin)
          }
        }, 5000)
          `, true)
        const startAuto = setInterval(() => {
          global.ChildWindow.webContents.executeJavaScript(`
        FarmersPlugin.isHome()
        `, true).then(res => {
            if (res) {
              console.log('游戏界面')
              clearInterval(startAuto)
              that.openAuto()
            } else {
              console.log('不是游戏界面')
            }
          })
        }, 5000)
      })
    },
    // 开始游戏
    start () {
      this.$store.dispatch('openChild')
    },
    // 停止游戏
    stop () {
      this.closeAuto()
      this.$store.dispatch('closeChild')
    },
    test (scope) {
      console.log(scope)
      return 1
    },
    // 开启自动
    openAuto () {
      if (!this.$store.state.Counter.isOpen) {
        this.$message.error('请先打开游戏')
        return
      }
      const that = this
      changeState({
        action: 'scriptState',
        state: 2,
        gameAccount: this.$store.state.Counter.gameAccount
      }).then(() => {
        that.isAuto = true
        that.initState()
        console.log('开启自动')
        that.timings.map = setInterval(() => {
          that.autoOperate()
        }, 7000)
      })
    },
    // 自动操作
    autoOperate () {
      let that = this
      if (!this.timings.mapLock) {
        // 切换地图
        this.timings.mapLock = true
        this.equipment.current = 0
        global.ChildWindow.webContents.executeJavaScript(`FarmersPlugin.changeMap(${that.timings.mapIndex})`, true).then(newMapIndex => {
          that.timings.mapIndex = newMapIndex
        })
        return
      }
      // 获取用户信息
      global.ChildWindow.webContents.executeJavaScript(`FarmersPlugin.getUserInfo()`, true).then(userinfo => {
        that.tableDataCount[that.timings.mapIndex] = userinfo.equipmentCount
        if (userinfo.equipmentCount === 0) {
          that.timings.mapLock = false
          return
        }
        that.handleUserinfo(userinfo)

        global.ChildWindow.webContents.executeJavaScript(`FarmersPlugin.getEquipmentInfo()`, true).then(equipmentInfo => {
          // 记录更新装备信息
          if (that.tableData[that.timings.mapIndex][that.equipment.current]) {
            Vue.set(that.tableData[that.timings.mapIndex], that.equipment.current, equipmentInfo)
          } else {
            that.tableData[that.timings.mapIndex].push(equipmentInfo)
          }
          // 耐久是否够用
          if (equipmentInfo.durable) {
            const durable = parseInt(equipmentInfo.durable.split('/')[0])
            if (durable <= parseInt(equipmentInfo.content['Durability Consumed:'])) {
              global.ChildWindow.webContents.executeJavaScript(`FarmersPlugin.operateEquipment(1)`, true).then(() => {
                that.changeEquipment()
              })
              return
            }
          }
          // 是否空闲且能量足够
          const need = equipmentInfo.content['Energy Consumed:'] || equipmentInfo.content['Consumed Energy:'] || '0'
          if (!equipmentInfo.disabled && that.current.energy > parseInt(need)) {
            global.ChildWindow.webContents.executeJavaScript(`FarmersPlugin.operateEquipment(0)`, true).then(() => {
              // 记录点击时间和点击次数
              that.handleClickTime()
              that.changeEquipment()
            })
          } else {
            // 能量不够吃肉
            that.handleEatMeat()
          }
        })
      })
    },
    // 处理点击次数和时间
    handleClickTime () {
      // 记录点击时间和点击次数
      const currentTime = (new Date()).getTime()
      const lastTime = this.equipmentClickTimes[this.timings.mapIndex][this.equipment.current] ? this.equipmentClickTimes[this.timings.mapIndex][this.equipment.current].lastTime : 0
      // 点击频率是否超过一小时
      if (currentTime - lastTime > 3600000) {
        this.equipmentClickTimes[this.timings.mapIndex][this.equipment.current] = {
          time: 1,
          lastTime: currentTime
        }
      } else {
        this.equipmentClickTimes[this.timings.mapIndex][this.equipment.current].time++
        this.equipmentClickTimes[this.timings.mapIndex][this.equipment.current].lastTime = currentTime
        if (this.equipmentClickTimes[this.timings.mapIndex][this.equipment.current].time > 6) {
          // this.equipmentClickTimes[this.timings.mapIndex] = []
          // this.restartGame()
          changeState({action: 'gameState', state: 1})
        }
      }
    },
    // 处理吃肉
    handleEatMeat () {
      if (this.current.energy < this.config.minEnergy) {
        const energy = this.config.minEnergy - this.current.energy
        const that = this
        if (this.current.meat * 5 > energy) {
          global.ChildWindow.webContents.executeJavaScript(`FarmersPlugin.eatMeat(${energy})`, true).then(() => {
            that.changeEquipment()
          })
          return
        } else {
          console.log('------肉不够了')
        }
      }
      this.changeEquipment()
    },
    // 处理用户信息
    handleUserinfo (userinfo) {
      const data = []
      if (this.userinfo.bullion !== userinfo.bullion) {
        data.push({amount: userinfo.bullion, type: 'bullion'})
      }
      if (this.userinfo.wood !== userinfo.wood) {
        data.push({amount: userinfo.wood, type: 'wood'})
      }
      if (this.userinfo.meat !== userinfo.meat) {
        data.push({amount: userinfo.meat, type: 'meat'})
      }
      if (data.length > 0) {
        addLog({data, gameAccount: this.$store.state.Counter.gameAccount})
      }
      this.userinfo = userinfo
      this.current.energy = parseInt(userinfo.energy.split('/')[0])
      this.current.meat = parseInt(userinfo.meat)
    },
    // 关闭自动
    closeAuto () {
      this.isAuto = false
      this.initState()
      changeState({action: 'scriptState', state: 1})
      console.log('已关闭')
    },
    // 初始化状态
    initState () {
      clearInterval(this.timings.map)
      this.timings.mapLock = false
      this.timings.mapIndex = 0
      this.equipment.isFirst = true
      this.equipment.isInit = true
    },
    // 切换下一件装备
    changeEquipment () {
      if (this.equipment.current >= this.tableDataCount[this.timings.mapIndex] - 1) {
        this.timings.mapLock = false
        if (this.equipment.isFirst) {
          this.equipment.isFirst = false
          this.equipment.firstMapIndex = this.timings.mapIndex
          return
        }
        if (!this.equipment.isFirst && this.equipment.isInit && this.timings.mapIndex === this.equipment.firstMapIndex) {
          initEquipment({data: this.tableData, gameAccount: this.$store.state.Counter.gameAccount}).then(() => {
            this.equipment.isInit = false
          })
        }
        return
      }
      this.equipment.current++
      const that = this
      global.ChildWindow.webContents.executeJavaScript(`FarmersPlugin.changeEquipment(${that.equipment.current})`, true).then()
    },
    // 打开开发者工具
    openDevTools () {
      this.isOpenDevTools = this.$electron.ipcRenderer.sendSync('sync-message', 'openDevTools')
      if (global.ChildWindow) global.ChildWindow.webContents.openDevTools()
    },
    // 关闭开发者工具
    closeDevTools () {
      this.isOpenDevTools = this.$electron.ipcRenderer.sendSync('sync-message', 'closeDevTools')
      if (global.ChildWindow) global.ChildWindow.webContents.closeDevTools()
    },
    // 日志颜色
    getColor (val) {
      if (!val) return {color: '', icon: ''}
      if (val === '0') {
        return {color: '#606266', icon: ''}
      } else if (val.search('-') === -1) {
        return {color: 'red', icon: 'el-icon-top'}
      } else {
        return {color: 'green', icon: 'el-icon-bottom'}
      }
    },
    checkUpdate () {
      this.$electron.ipcRenderer.send('ev-check-for-update')
    }
  },
  mounted () {
    const that = this
    this.$electron.ipcRenderer.on('send-message', (event, arg, data) => {
      switch (arg) {
        case 'closeWindow':
          global.ChildWindow.close()
          global.ChildWindow = null
          changeState({action: 'scriptState', state: 1})
          break
        case 'ChangeGameAccount':
          that.$store.commit('CHANGE_GAME_ACCOUNT', data)
          break
        case 'closeAuto':
          that.closeAuto()
          break
        default:
          event.returnValue = arg
      }
    })
    getAccountInfo().then()
    this.$electron.ipcRenderer.on('ev-message', (event, message) => {
      that.$notify({
        message,
        title: '提示'
      })
    })
    this.$electron.ipcRenderer.on('ev-should-download', () => {
      that.$confirm('检查到新版本，是否下载?', '提示', {
        confirmButtonText: '下载',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$electron.ipcRenderer.send('ev-download-now')
        that.updateProgress = setInterval(() => {
          that.$electron.ipcRenderer.send('download-progress')
        }, 1000)
      })
    })
    this.$electron.ipcRenderer.on('ev-should-update', () => {
      that.$confirm('已下载完成，是否更新?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$electron.ipcRenderer.send('ev-update-now')
        clearInterval(that.updateProgress)
      })
    })
  }
}
</script>

<style>
.flex .el-card__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.el-dialog__body {
  padding: 0 20px !important;
}
.el-button--success{
  background-color: #FF7F24 !important;
  border-color: #FF7F24 !important;
}
</style>
