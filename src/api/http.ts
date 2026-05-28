export interface ApiResponse<T> {
  code?: number
  data?: T
  message?: string
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>
  timeout?: number
}

export interface ApiClientOptions {
  baseURL?: string
  timeout?: number
}

const DEFAULT_TIMEOUT = 10000

// 后端异常状态统一映射，业务层只需要处理抛出的 Error。
const statusMessages: Record<number, string> = {
  400: '请求错误(400)',
  401: '未授权，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)',
  505: 'HTTP版本不受支持(505)',
}

// 判断是否为普通对象，用于区分 JSON 数据和 FormData、Blob 等原生请求体。
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Object.prototype.toString.call(value) === '[object Object]'
}

// 过滤空值后拼接查询参数，避免出现 foo=undefined 这类无效参数。
const buildQuery = (params?: RequestConfig['params']) => {
  if (!params) return ''

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    searchParams.append(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

// 合并基础地址和接口路径；传入完整 URL 时直接返回，方便兼容第三方接口。
const joinURL = (baseURL: string, url: string) => {
  if (/^https?:\/\//i.test(url)) return url
  return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

export class Request {
  private baseURL: string
  private timeout: number

  // 初始化请求实例，优先使用传入配置，其次读取环境变量中的接口地址。
  constructor(config: ApiClientOptions = {}) {
    this.baseURL = config.baseURL ?? import.meta.env.VITE_API_BASE_URL ?? ''
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT
  }

  // 兼容两类响应：标准 HTTP 响应，以及后端常见的 { code, data, message } 包装格式。
  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(statusMessages[response.status] ?? `连接出错(${response.status})`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    const contentType = response.headers.get('content-type') ?? ''
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    if (isPlainObject(payload) && 'code' in payload) {
      const apiResponse = payload as ApiResponse<T>
      if (apiResponse.code === 200) {
        return apiResponse.data as T
      }

      throw new Error(apiResponse.message || '系统错误，请稍后再试')
    }

    return payload as T
  }

  // 发起实际请求，并统一处理 query、超时、JSON 请求体和响应解析。
  public async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = this.timeout, headers, body, ...requestConfig } = config
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), timeout)
    const requestURL = `${joinURL(this.baseURL, url)}${buildQuery(params)}`

    try {
      // 普通对象默认按 JSON 提交；FormData、Blob 等原生 body 会保持原样。
      const response = await fetch(requestURL, {
        ...requestConfig,
        body: body && isPlainObject(body) ? JSON.stringify(body) : body,
        headers: {
          ...(body && isPlainObject(body) ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        signal: controller.signal,
      })

      return await this.parseResponse<T>(response)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    } finally {
      window.clearTimeout(timer)
    }
  }

  // GET 请求快捷方法，主要用于列表、详情等读取型接口。
  public get<T>(url: string, config: RequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  // POST 请求快捷方法，主要用于创建、提交表单等写入型接口。
  public post<T>(url: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'POST', body: data as BodyInit })
  }

  // PUT 请求快捷方法，主要用于整条资源的更新。
  public put<T>(url: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'PUT', body: data as BodyInit })
  }

  // DELETE 请求快捷方法，主要用于删除资源。
  public delete<T>(url: string, config: RequestConfig = {}) {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }
}

// 导出默认请求实例，页面和业务模块可直接复用同一套基础配置。
export const apiClient = new Request()

// 当前项目还没有真实后端，mock API 保持异步形态，方便后续替换为 apiClient 请求。
export const mockRequest = async <T>(data: T): Promise<T> => {
  return structuredClone(data)
}

export default apiClient
