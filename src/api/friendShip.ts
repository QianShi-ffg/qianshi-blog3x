
import { apiClient } from './http'

/**
 * 查询前台友链列表，列表页展示已通过或允许展示的友链数据。
 */
export const getFriendShipList = (params: object) => {
  return apiClient.get( '/friendShip', { params })
}

export interface FriendShipApplyPayload {
  name: string
  blogUrl: string
  icon: string
  desc: string
  contact: string
  hasBacklink: boolean
}

/**
 * 提交友链申请，前台弹窗表单确认后由后台进行处理。
 */
export const applyFriendShip = (payload: FriendShipApplyPayload) => {
  return apiClient.post('/friendShip/apply', payload)
}
