import request from '@/utils/request'

export function getTableTestData() {
    return request({
      url: '/table/tabletestdata',
      method: 'get'
    })
  }

export function getMockData() {
    // debugger
    return {
        tableData: [{
            name: '董家村房屋面',
            xzq: '云南省',
            type: '二维矢量',
            format: 'Shapefile',
            date: '2019-02-27',
            size: '12.0 KB',
            status: '草案',
            serverAddress: 'a88b5dc3208049cc991ab64633b175d2',
            person: '王xx',
            phone: 'xxx',
        },
        {
            name: '董家村水系线',
            xzq: '云南省',
            type: '二维矢量',
            format: 'Shapefile',
            date: '2019-02-27',
            size: '6.71 KB',
            status: '草案',
            serverAddress: 'fb0c493d6e1446669862edc16f7a6eaf',
            person: '王xx',
            phone: 'xxx',
        },
        {
            name: '董家村水系点',
            xzq: '云南省',
            type: '二维矢量',
            format: 'Shapefile',
            date: '2019-02-27',
            size: '4.68 KB',
            status: '草案',
            serverAddress: 'e6cb7992cf2347bbb3e1f13c4ce1ad03',
            person: '王xx',
            phone: 'xxx',
        },
        {
            name: '董家村植被与土质面',
            xzq: '云南省',
            type: '二维矢量',
            format: 'Shapefile',
            date: '2019-02-27',
            size: '5.33 KB',
            status: '草案',
            serverAddress: 'e57557968d434d5286554eaa90b29d61',
            person: '王xx',
            phone: 'xxx',
        },
        {
            name: '董家村植被与土质线',
            xzq: '云南省',
            type: '二维矢量',
            format: 'Shapefile',
            date: '2019-02-27',
            size: '13.8 KB',
            status: '草案',
            serverAddress: 'e750516c0b3742bd9b7307c80b0f76ca',
            person: '王xx',
            phone: 'xxx',
        },
        {
            name: '董家村植被与土质点',
            xzq: '云南省',
            type: '二维矢量',
            format: 'Shapefile',
            date: '2019-02-27',
            size: '10.9 KB',
            status: '草案',
            serverAddress: '8fc2cf216b234ebda3fc87268f3e1173',
            person: '王xx',
            phone: 'xxx',
        },  
        {
            name: '董家村三维模型',
            xzq: '云南省',
            type: '三维倾斜测量',
            format: '3dTiles',
            date: '2019-02-27',
            size: '1.15 GB',
            status: '有效',
            serverAddress: 'http://202.114.148.160/sogbTo3dtiles/DongJiaCun/tileset.json',
            person: '王xx',
            phone: 'xxx',
        },  
        {
            name: '关坝河三维模型',
            xzq: '云南省',
            type: '三维倾斜测量',
            format: '3dTiles',
            date: '2019-02-27',
            size: '1.00 GB',
            status: '有效',
            serverAddress: 'http://202.114.148.160/sogbTo3dtiles/GuanBaHe/tileset.json',
            person: '王xx',
            phone: 'xxx',
        },  
    ]
    }
}