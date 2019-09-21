import request from '@/utils/request'

export function uploadModelPostion(data) {
    // debugger
    return request({
        url: '/spatialdata/UploadModelPostion',
        method: 'post',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //   },
        data
    })
}