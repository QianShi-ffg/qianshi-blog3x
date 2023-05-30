export default () => {
  // window._hmt = window._hmt || []
  const hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?4c1ec48699f9f08a2bc0bc4796ddf779'
  const s = document.getElementsByTagName('script')[0]
  s.parentNode?.insertBefore(hm, s)
}
