/*
 * @Descripttion: 1
 * @version: 1
 * @Author: KanMing
 * @Date: 2019-03-20 14:58:28
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-28 20:28:20
 */
import request from '@/utils/request'
import qs from 'qs'
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
    })
  })
}

//用户登出
export function logout() {
  return request({
    url: 'user/logout',
    method: 'get'
  })
}

//获取用户信息
export function getUserInfo() {
  return request({
    url: 'user/GetUserInfoFromToken',
    method: 'get'
  })
}

//创建新用户
export function createUser(data) {
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
export function changePsd(data) {
  return request({
    url: '/user/changePwd',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: data
  })
}

//获取所有用户信息
export function getAllUser() {
  return request({
    url: '/user/getAllUser',
    method: 'get'
  })
}

//修改用户
export function editUser(obj) {
  const data = {
    Id: obj.Id,
    LoginName: obj.LoginName,
    Gender: obj.Gender,
    Tel: obj.Tel,
    Roles: obj.Roles
  }
  return request({
    url: '/user/editUser',
    method: 'post',
    data
  })
}

//重置密码
export function resetPsd(Id) {
  return request({
    url: '/user/resetPsd',
    method: 'get',
    params: {
      Id
    }
  })
}
