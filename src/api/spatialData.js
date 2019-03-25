import request from '@/utils/request'
// import qs from "qs"

export function getSpatialData() {
  return request({
    url: "spatialdata/GetData",
    method: "get",
  })
}

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