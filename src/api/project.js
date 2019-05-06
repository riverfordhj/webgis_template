import request from '@/utils/request'

//查
export function getAllProject() {
  return request({
    url: "project/getall",
    method: "get",
  })
}

export function GetProjectByName(City) {
  return request ({
    url: "project/GetByName",
    method: "get",
    params:{
      City: City
    }
  })
}

export function getRelatedDataByName(projectName) {
  return request ({
    url: "project/getRelatedDataByName",
    method: "get",
    params:{
      projectName: projectName
    }
  })
}

export function deleteProjectByName(projectName) {
  debugger;
  return request ({
    url: "project/deleteProjectByName",
    method: "get",
    params:{
      projectName: projectName
    }
  })
}