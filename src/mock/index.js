import Mock from 'mockjs'
import loginAPI from './login'
import tableAPI from './table'
// import getTask from './task'

Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// Mock.mock(/\/task\/list\.*/, 'get', getTask.getList)
Mock.mock(/\/table\/tabletestdata/, 'get', tableAPI.getTableTestData)

export default Mock

