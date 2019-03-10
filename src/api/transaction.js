import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

export function getList(){
  return {
    data:[{
      name: "董家村房屋面",
      site: "ArcGIS Online CN",
      id:"a88b5dc3208049cc991ab64633b175d2",
      status: "success",
      timestamp: 1270943820915,
      username: "James Lewis",
    },{
      name: "董家村水系线",
      site: "ArcGIS Online CN",
      id:"fb0c493d6e1446669862edc16f7a6eaf",
      status: "success",
      timestamp: 319797879492,
      username: "Ronald Hernandez",
    },{
      name: "董家村水系点",
      site: "ArcGIS Online CN",
      id:"e6cb7992cf2347bbb3e1f13c4ce1ad03",
      status: "success",
      timestamp: 616743199669,
      username: "Maria Rodriguez"
    },{
      name: "董家村植被与土质面",
      site: "ArcGIS Online CN",
      id:"e57557968d434d5286554eaa90b29d61",
      status: "success",
      timestamp: 616743199669,
      username: "Maria Rodriguez"
    }
  ]
  };
}
