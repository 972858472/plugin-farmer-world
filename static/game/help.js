let FarmersPlugin = new function () {
  // 用户信息
  this.userinfo = {
    bullion: 0,
    wood: 0,
    meat: 0,
    energy: 0,
    equipmentCount: 0
  }

  // 游戏title列表
  this.gameTitleList = [
    'Home', 'Chest', 'Smithy', 'Exchange', 'Map', 'Market', 'Atomic'
  ]

  // 初始化提示
  this.initPrompt = () => {
    return Promise.resolve('FarmersPlugin初始化成功!')
  }

  // 获取用户信息
  this.getUserInfo = () => {
    let resourceGroup = document.getElementsByClassName('resource__group')
    if (resourceGroup.length === 0) {
      this.closePopModal()
      resourceGroup = document.getElementsByClassName('resource__group')
    }
    this.userinfo.bullion = this.getUserInfoText(resourceGroup[0])
    this.userinfo.wood = this.getUserInfoText(resourceGroup[1])
    this.userinfo.meat = this.getUserInfoText(resourceGroup[2])
    this.userinfo.energy = resourceGroup[3].getElementsByClassName('resource-number')[0].innerText
    this.userinfo.equipmentCount = this.getEquipmentList().length
    return Promise.resolve(this.userinfo)
  }

  // 关闭modal
  this.closePopModal = () => {
    const closeModal = document.getElementsByClassName('close-modal')
    if (closeModal.length !== 0) {
      closeModal[0].click()
    }

    const closeMarketModal = document.getElementsByClassName('close-market-modal')
    if (closeMarketModal.length !== 0) {
      closeMarketModal[0].click()
    }

    const confirmButton = document.getElementsByClassName('plain-button short undefined')
    if (confirmButton.length !== 0) {
      confirmButton[0].click()
    }
  }

  // 获取用户信息的text文本
  this.getUserInfoText = (resourceGroup) => {
    return resourceGroup.getElementsByClassName('resource-number')[0]
      .getElementsByTagName('div')[0].innerText
  }

  // 获取title
  this.getTitle = () => {
    const containerHeaderTilte = document.getElementsByClassName('container__header--tilte')

    if (containerHeaderTilte.length === 0) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('无法获取title')
    }
    Promise.resolve(containerHeaderTilte[0].innerText).then()
    return containerHeaderTilte[0].innerText
  }

  // 修改title
  this.changeTitle = (index) => {
    const gameContent = document.getElementsByClassName('game-content')
    if (gameContent.length === 0) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('无法获取游戏界面')
    }

    const navbarGroup = gameContent[0].getElementsByClassName('navbar-container')[0]
      .getElementsByClassName('navbar-group')

    if (this.getTitle() !== this.gameTitleList[index]) {
      navbarGroup[index].click()
    }
  }

  // 获取装备数量
  this.getEquipmentCount = () => {
    return Promise.resolve(this.getEquipmentList().length)
  }

  // 获取装备
  this.getEquipmentInfo = () => {
    const homeContent = document.getElementsByClassName('home-container')[0].getElementsByClassName('home-content')

    let info = {}

    const isDurable = homeContent[0].getElementsByClassName('card-number')
    if (isDurable.length > 0) {
      info.durable = isDurable[0].getElementsByClassName('content')[0].innerText
    }

    const isLevel = homeContent[0].getElementsByClassName('info-title-level')
    if (isLevel.length > 0) {
      info.level = isLevel[0].innerText
    }

    info.name = homeContent[0].getElementsByClassName('info-title-name')[0].innerText
    info.time = homeContent[0]
      .getElementsByClassName('info-time')[0]
      .getElementsByClassName('card-container--time')[0].innerText

    info.content = {}
    const infoContentArray = document.querySelectorAll('.info-content .info-label')
    for (let i = 0; i < infoContentArray.length; i++) {
      const content = infoContentArray[i].innerText
      const contentArray = content.split('\n')
      info.content[contentArray[0]] = contentArray[1]
    }

    const buttons = homeContent[0].getElementsByClassName('plain-button semi-short')
    info.disabled = buttons[0].className.indexOf('disabled') !== -1

    return Promise.resolve(info)
  }

  // 操作装备
  this.operateEquipment = (index) => {
    this.closePopModal()
    const homeContent = document.getElementsByClassName('home-container')[0]
      .getElementsByClassName('home-content')
    const buttons = homeContent[0].getElementsByClassName('plain-button semi-short')
    buttons[index].click()
    this.closePopModal()
  }

  // 获取装备列表
  this.getEquipmentList = () => {
    let homeContainer = document.getElementsByClassName('home-container')
    if (homeContainer.length === 0 || this.getTitle() !== 'Home') {
      this.changeTitle(0)
      homeContainer = document.getElementsByClassName('home-container')
      if (homeContainer.length === 0) {
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject('无法获取到装备').then()
        return []
      }
    }
    return homeContainer[0]
      .getElementsByClassName('vertical-carousel-container')[0]
      .getElementsByTagName('img')
  }

  // 吃肉
  this.eatMeat = (energy) => {
    this.closePopModal()
    document.getElementsByClassName('resource-energy--plus')[0].click()
    const clickCount = parseInt(energy / 5) + 1
    for (let i = 0; i < clickCount; i++) {
      document.getElementsByClassName('image-button')[2].click()
    }
    document.querySelector('.plain-button.long').click()
    this.closePopModal()
  }

  // 切换装备
  this.changeEquipment = (index) => {
    document.getElementsByClassName('vertical-carousel-container')[0]
      .getElementsByTagName('img')[index].click()
  }

  // 是否是游戏界面
  this.isHome = () => {
    if (document.querySelector('.game-content')) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  // 切换地图
  this.changeMap = (currentMapIndex) => {
    this.changeTitle(4)
    const nextMapIndex = this.getNextMapIndex(currentMapIndex)
    document.getElementsByClassName('map-container-bg')[nextMapIndex].click()
    return Promise.resolve(nextMapIndex)
  }

  // 获取下一个可点的地图下标
  this.getNextMapIndex = (currentMapIndex) => {
    let nextMapIndex = currentMapIndex >= 3 ? 0 : currentMapIndex + 1
    const grayscale = document.getElementsByClassName('map-container-bg')[nextMapIndex].style.filter
    return grayscale === 'grayscale(1)' ? this.getNextMapIndex(nextMapIndex) : nextMapIndex
  }
}()

FarmersPlugin.initPrompt()
