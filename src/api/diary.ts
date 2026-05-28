import { mockRequest } from './http'
import { momentSummaries, moments } from './mock-data'

export const listMoments = () => mockRequest(momentSummaries)

export const getMomentById = (id: number) => {
  return mockRequest(moments.find((moment) => moment.id === id) ?? null)
}
