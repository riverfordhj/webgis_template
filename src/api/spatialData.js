import request from '@/utils/request'
// import qs from "qs"

//查
export function getSpatialData() {
  return request({
    url: "spatialdata/GetData",
    method: "get",
  })
}

//增
export function addSpatialData(data) {
  return request({
    url: "spatialdata/AddData",
    method: "post",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: data
  })
}

//删
export function deleteSpatialData(data) {
  return request({
    url: "spatialdata/DeleteData",
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    data:data
  })
}