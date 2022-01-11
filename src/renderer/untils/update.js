
const {ipcMain} = require('electron')
const {autoUpdater} = require('electron-updater')
const {build, version} = require('../../../package.json')

process.env.version = version

// 立即更新
ipcMain.on('ev-update-now', () => {
  console.log('ev-update-now::: 用户同意更新，开始更新')

  autoUpdater.quitAndInstall()
})

// 立即下载
ipcMain.on('ev-download-now', () => {
  console.log('ev-download-now::: 用户同意下载，开始下载')

  autoUpdater.downloadUpdate().then()
})

// 用户也可以通过点击按钮去检测更新
ipcMain.on('ev-check-for-update', () => {
  console.log('ev-check-for-update::: 执行自动更新检查')

  autoUpdater.checkForUpdates().then()
})

function handleUpdate (mainWindow) {
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  }

  autoUpdater.autoDownload = false

  // 设置下载地址
  autoUpdater.setFeedURL(build.publish[0].url)

  // 检查更新出错
  autoUpdater.on('error', () => {
    console.log('autoUpdater-error:::', arguments)

    sendUpdateMessage(message.error)
  })

  // 检查是否有版本更新
  autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update:::', arguments)

    sendUpdateMessage(message.checking)
  })

  // 检测到有版本更新
  autoUpdater.on('update-available', () => {
    console.log('update-available:::', arguments)

    mainWindow.webContents.send('ev-should-download')
  })

  // 未发现有新版本
  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available:::', arguments)

    sendUpdateMessage(message.updateNotAva)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', progressObj => {
    console.log('download-progress:::', progressObj)

    mainWindow.setProgressBar(progressObj.percent / 100)
  })

  // 下载完成，询问用户是否更新
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    console.log('update-downloaded::: 下载完成，询问用户是否更新')

    mainWindow.webContents.send('ev-should-update', {
      event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl,
      quitAndUpdate
    })
  })

  function sendUpdateMessage (text) {
    mainWindow.webContents.send('ev-message', text)
  }
}

module.exports = {
  handleUpdate
}
