export function arrayEquals  (a, b) {
  if (a.length !== b.length) return false

  let c = b.slice()
  // 在可以提前退出的情况下不要使用forEach
  for (let i = 0, len = a.length; i < len; i++) {
    let j = c.indexOf(a[i])
    if ( j === -1 ) return false
    c.splice(j, 1) // 删除已经匹配的元素，可以缩短下次匹配的时间
  }
  return true
}

// export function 