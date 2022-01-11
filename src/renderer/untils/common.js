// 获取日期时间
function getDateTime () {
  const date = new Date()
  const month = zeroFill(date.getMonth() + 1)
  const day = zeroFill(date.getDate())
  const hour = zeroFill(date.getHours())
  const minute = zeroFill(date.getMinutes())
  const second = zeroFill(date.getSeconds())

  return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

// 补零
function zeroFill (i) {
  if (i >= 0 && i <= 9) {
    return '0' + i
  } else {
    return i
  }
}

export default {getDateTime, zeroFill}
