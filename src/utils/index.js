/**
 * Created by jiachenpan on 16/11/18.
 */

// export function parseTime(time, cFormat) {
//   if (arguments.length === 0) {
//     return null
//   }
//   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
//   let date
//   if (typeof time === 'object') {
//     date = time
//   } else {
//     if (('' + time).length === 10) time = parseInt(time) * 1000
//     date = new Date(time)
//   }
//   const formatObj = {
//     y: date.getFullYear(),
//     m: date.getMonth() + 1,
//     d: date.getDate(),
//     h: date.getHours(),
//     i: date.getMinutes(),
//     s: date.getSeconds(),
//     a: date.getDay()
//   }
//   const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
//     let value = formatObj[key]
//     // Note: getDay() returns 0 on Sunday
//     if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
//     if (result.length > 0 && value < 10) {
//       value = '0' + value
//     }
//     return value || 0
//   })
//   return time_str
// }

// export function formatTime(time, option) {
//   time = +time * 1000
//   const d = new Date(time)
//   const now = Date.now()

//   const diff = (now - d) / 1000

//   if (diff < 30) {
//     return '刚刚'
//   } else if (diff < 3600) {
//     // less 1 hour
//     return Math.ceil(diff / 60) + '分钟前'
//   } else if (diff < 3600 * 24) {
//     return Math.ceil(diff / 3600) + '小时前'
//   } else if (diff < 3600 * 24 * 2) {
//     return '1天前'
//   }
//   if (option) {
//     return parseTime(time, option)
//   } else {
//     return (
//       d.getMonth() +
//       1 +
//       '月' +
//       d.getDate() +
//       '日' +
//       d.getHours() +
//       '时' +
//       d.getMinutes() +
//       '分'
//     )
//   }
// }

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function throttle(fn, wait = 3000) {
  let timer
  return function(...args) {
    if (timer == null) {
      // undefined == null // true undefined === null //false 这里不要写成 严格相等 不然永远执行不进去
      timer = setTimeout(() => (timer = null), wait)
      return fn.apply(this, args)
    }
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
