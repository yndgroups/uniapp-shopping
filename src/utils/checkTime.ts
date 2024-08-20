/**
 *
 * @param creatTime 创建时间
 * @returns 超时返回false  未超时true
 */
export function checkTime(creatTime: string): boolean {
  let times = new Date(convertUtcToLocal(creatTime)).getTime();
  let nowTime = new Date().getTime();
  return times > nowTime;
}

function convertUtcToLocal(utcIsoString: string) {
  // 创建一个Date对象表示UTC时间
  const utcDate = new Date(utcIsoString);

  // 检查日期是否有效
  if (isNaN(utcDate.getTime())) {
    throw new Error("Invalid ISO 8601 date string");
  }

  // 获取本地时区偏移量（以分钟为单位）
  const localOffset = utcDate.getTimezoneOffset();

  // 转换为本地时间（毫秒）
  const localTime = utcDate.getTime() + localOffset * 60 * 1000;

  // 创建一个新的Date对象表示本地时间
  const localDate = new Date(localTime);
  localDate.setMinutes(localDate.getMinutes() + 3);
  // 格式化日期时间字符串
  const formattedDate = `${localDate.getFullYear()}/${padZero(
    localDate.getMonth() + 1
  )}/${padZero(localDate.getDate())} ${padZero(localDate.getHours())}:${padZero(
    localDate.getMinutes()
  )}:${padZero(localDate.getSeconds())}`;

  return formattedDate;

  // 辅助函数：在数字前面补零
  function padZero(num: number) {
    return num.toString().padStart(2, "0");
  }
}
