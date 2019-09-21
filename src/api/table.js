import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}




export function getPropertyData() {
  return {
    tableData:[
      {
       name:'云南省行政区划图',
       type:'图片',
       format:'img',
       date:'2019.2.28',
       size: '12.0 KB',
       status: '草案',
       person: '王xx',
       phone: 'xxx',
      },
      {
        name:'关坝河一期工程设计方案',
        type:'文档',
        format:'Word',
        date:'2019.2.28',
        size: '12.0 KB',
        status: '草案',
        person: '王xx',
        phone: 'xxx',
      },
      {
        name:'关坝河一期工程质量检测报告',
        type:'文档',
        format:'PDF',
        date:'2019.2.28',
        size: '12.0 KB',
        status: '草案',
        person: '王xx',
        phone: 'xxx',
      },
      {
        name:'董家村2019年外出务工人口统计',
        type:'文档',
        format:'Excel',
        date:'2019.2.28',
        size: '12.0 KB',
        status: '草案',
        person: '王xx',
        phone: 'xxx',
      },
    ]
  }
}
