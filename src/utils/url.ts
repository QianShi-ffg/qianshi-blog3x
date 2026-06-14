/**
 * 根据天气名称和后缀查找本地天气图标资源。
 */
export const getWeatherUrl: any = (name: string, suffix: string) => {
  let path0 = ''
  const modules: any = import.meta.glob('/src/assets/weather/*.png')

  for (const path in modules) {
    modules[path]().then((mod: any) => {
      if (path === `/src/assets/img/${name}.${suffix}`) {
        console.log(path, mod, 6666666666666)
        path0 = mod.default
      }
    })
  }

  return path0
}
