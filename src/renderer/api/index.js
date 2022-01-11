import request from '../untils/request'

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function changeState (data) {
  return request({
    url: '/changeState',
    method: 'post',
    data
  })
}

export function addLog (data) {
  return request({
    url: '/addLog',
    method: 'post',
    data
  })
}

export function getLog (params) {
  return request({
    url: '/getLog',
    method: 'get',
    params
  })
}

export function getAccountInfo () {
  return request({
    url: '/getAccountInfo',
    method: 'get'
  })
}

export function initEquipment (data) {
  return request({
    url: '/initEquipment',
    method: 'post',
    data
  })
}
