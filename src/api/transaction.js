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
      order_no: "2E45f34b-3B46-E892-3101-B6eaceADDc2B",
      price: 1938,
      status: "success",
      timestamp: 1270943820915,
      username: "James Lewis",
    },{
      order_no: "6C6C95E7-cf24-f72D-ef50-34C554d8FddC",
      price: 7248.8,
      status: "pending",
      timestamp: 319797879492,
      username: "Ronald Hernandez",
    },{
      order_no: "aBAc74c2-dBDb-fBF1-366D-f334593bC95A",
      price: 8956.43,
      status: "success",
      timestamp: 616743199669,
      username: "Maria Rodriguez"
    }]
  };
}
