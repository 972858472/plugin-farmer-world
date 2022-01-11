'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import {handleUpdate} from '../renderer/untils/update'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1200
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', () => {
    mainWindow.webContents.send('send-message', 'closeWindow')
  })

  handleUpdate(mainWindow)

  ipcMain.on('sync-message', (event, arg) => {
    switch (arg) {
      case 'openDevTools':
        mainWindow.webContents.openDevTools()
        event.returnValue = true
        break
      case 'closeDevTools':
        mainWindow.webContents.closeDevTools()
        event.returnValue = false
        break
      case 'closeAuto':
        mainWindow.webContents.send('send-message', 'closeAuto')
        event.returnValue = true
        break
      default :
        event.returnValue = undefined
    }
  })
}

// const shouldQuit = app.makeSingleInstance(() => {
// })
// if (shouldQuit) store.commit('LOGIN_SUCCESS', {username: null, apt_token: null})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('web-contents-created', function (a, b, c) {
  b.on('did-finish-load', function () {
    b.executeJavaScript(`const autoAuth = function () {
      const authButton = document.querySelector('.button.button-secondary.button-large')
      if (authButton) {
        console.log('存在')
        let gameAccount = null
        // 操作授权
        if (document.querySelector('.enable-advanced')) {
          if (document.querySelector('.enable-advanced').innerText === 'Show Details') {
            document.querySelector('.enable-advanced').click()
          }
          gameAccount = document.querySelector('.right.text-bold.text-rem2').innerText.replace(/^(\\s|")+|(\\s|")+$/g, '')
        }
        // 登录授权
        if (document.querySelector('.user-account-container')) {
          gameAccount = document.querySelector('.user-account-container').innerText
        }
        if (authButton.innerText.search('Login') === -1) {
          setTimeout(authButton.click(), 500)
        }
        return Promise.resolve(gameAccount)
      }
    }`, true).then()
    let intervalTime = 0
    const autoAuth = setInterval(function () {
      if (b.isDestroyed()) return
      b.executeJavaScript(`autoAuth()`, true).then(res => {
        if (res !== '' && res) {
          mainWindow.webContents.send('send-message', 'ChangeGameAccount', res)
          clearInterval(autoAuth)
        }
        intervalTime++
        if (intervalTime > 2) {
          clearInterval(autoAuth)
          b.executeJavaScript(`
          setInterval(function(){
            const authButton = document.querySelector('.button.button-secondary.button-large')
            if (authButton && authButton.innerText.search('Login') === -1) {
              authButton.click()
            }
          },5000)
          `, true).then()
        }
      })
    }, 2000)
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// const server = 'https://plugin-farmer-world-jkdldv3x5-972858472.vercel.app'
// const url = `${server}/update/${process.platform}/${app.getVersion()}`

// const {autoUpdater} = require('electron-updater')
// autoUpdater.checkForUpdates().then()

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
