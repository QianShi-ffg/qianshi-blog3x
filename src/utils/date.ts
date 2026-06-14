/**
 * 将任意可被 Date 解析的时间值格式化为 YYYY-MM-DD。
 */
export const date = (time: any) => {
  const dateTime = new Date(time)
  const month = String(dateTime.getMonth() + 1).padStart(2, '0')
  const day = String(dateTime.getDate()).padStart(2, '0')

  return `${dateTime.getFullYear()}-${month}-${day}`
}
