import { mockRequest } from './http'
import { projects } from './mock-data'

export const listProjects = () => mockRequest(projects)

export const getProjectById = (id: number) => {
  return mockRequest(projects.find((project) => project.id === id) ?? null)
}
