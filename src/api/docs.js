import request from '@/utils/request'
// import qs from "qs"

export function getDocsInfo(proj) {
  return request({
    url: '/docs/GetDocInfoByProj',
    method: 'get',
    params:{
      proj:proj
    }
  })
}