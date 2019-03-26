import request from '@/utils/request'
import qs from "qs"
// import { getToken } from '@/utils/auth'

//用户登录
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

//用户登出
export function logout() {
  return request({
    url: "user/logout",
    method: "get",
  })
}

//获取用户信息
export function getUserInfo() {
  return request({
    url: "user/GetUserInfoFromToken",
    method: "get",
  })
}

//创建新用户
export function createUser(data){
  return request({
    url: '/user/register',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: data
  })
}

//修改密码
export function changePsd(data){
  return request({
    url: '/user/changePwd',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: data
  })
}