/*
 * 核心方法，实现加减乘除运算，确保不丢失精度
 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
 *
 * @param a {number} 运算数1
 * @param b {number} 运算数2
 * @param op {string} 运算类型，有加减乘除（add/subtraction/multiplication/division）
 *
 */
export const operation = (a: number, b: number, op: string) => {
  var o1 = toInteger(a)
  var o2 = toInteger(b)
  var n1 = o1.num
  var n2 = o2.num
  var t1 = o1.times
  var t2 = o2.times
  var max = t1 > t2 ? t1 : t2
  var result = null
  switch (op) {
    case 'addition':
      if (t1 === t2) {
        // 两个小数位数相同
        result = n1 + n2
      } else if (t1 > t2) {
        // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2)
      } else {
        // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2
      }
      return result / max
    case 'subtraction':
      if (t1 === t2) {
        result = n1 - n2
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2)
      } else {
        result = n1 * (t2 / t1) - n2
      }
      return result / max
    case 'multiplication':
      result = (n1 * n2) / (t1 * t2)
      return result
    case 'division':
      result = (n1 / n2) * (t2 / t1)
      return result
  }
}

// 加减乘除的四个接口
export const addition = (a: number, b: number) => {
  return Number(operation(a, b, 'addition'))
}
// 减法
export const subtraction = (a: number, b: number) => {
  return operation(a, b, 'subtraction')
}
// 乘法
export const multiplication = (a: number, b: number) => {
  return Number(operation(a, b, 'multiplication'))
}
// 除法
export const division = (a: number, b: number) => {
  return operation(a, b, 'division')
}

/*
 * 判断obj是否为一个整数
 */
export const isInteger = (obj: number) => {
  return Math.floor(obj) === obj
}

/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
export const toInteger = (floatNum: number) => {
  var ret = { times: 1, num: 0 }
  if (isInteger(floatNum)) {
    ret.num = floatNum
    return ret
  }
  var strfi = floatNum + ''
  var dotPos = strfi.indexOf('.')
  var len = strfi.substr(dotPos + 1).length
  var times = Math.pow(10, len)
  var intNum = parseInt(floatNum * times + 0.5 + '', 10)
  ret.times = times
  ret.num = intNum
  return ret
}

export default operation
