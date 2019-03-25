import request from '@/utils/request'
import qs from "qs"
// import { getToken } from '@/utils/auth'

export function loginByUsername(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify({
      LoginName: username,
      Pwd: password
    }),
  })
}

export function logout() {
  return request({
    url: "user/logout",
    method: "get",
  })
}

export function getUserInfo() {
  return request({
    url: "user/GetUserInfoFromToken",
    method: "get",
  })
}