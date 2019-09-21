import request from '@/utils/request'
import qs from "qs"


export function uploadFlightPath(path,name, desc) {
    // debugger
    const data = {
        path,
        name,
        desc
    }
    return request({
        url: '/FlightPath/UploadFlightPath',
        method: 'post',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //   },
        data
    })
}

export function getAllFlightPath(){
    return request({
        url: '/FlightPath/GetFlightPath',
        method: 'post',
    })
}