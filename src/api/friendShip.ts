
import { apiClient } from './http'
// 友链列表
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

export const applyFriendShip = (payload: FriendShipApplyPayload) => {
  return apiClient.post('/friendShip/apply', payload)
}
