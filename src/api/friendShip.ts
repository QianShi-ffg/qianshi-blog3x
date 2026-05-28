
import { mockRequest, apiClient } from './http'
// 友链列表
export const getFriendShipList = (params: object) => {
  return apiClient.get( '/friendShip', { params })
}