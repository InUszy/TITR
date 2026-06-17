import { getMockTrainTrajectory, isKnownMockTrain } from './mockTrainTrajectory'
import type { TrainTrajectory } from '../types/trainTrajectory'

function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? ''
}

export class TrainTrajectoryError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'TrainTrajectoryError'
    this.status = status
  }
}

export async function fetchTrainTrajectory(trainNo: string): Promise<TrainTrajectory> {
  const normalized = trainNo.trim()
  if (!normalized) {
    throw new TrainTrajectoryError('Train number is required')
  }

  const baseUrl = getApiBaseUrl()

  // 开发环境未配置后端地址时，直接使用 Mock，避免 Vite 代理空连 localhost:8080
  if (import.meta.env.DEV && !baseUrl) {
    if (isKnownMockTrain(normalized)) {
      const mock = getMockTrainTrajectory(normalized)
      if (mock) return mock
    }
    throw new TrainTrajectoryError('Train trajectory not found', 404)
  }

  const endpoint = `${baseUrl || ''}/api/trains/${encodeURIComponent(normalized)}/trajectory`

  try {
    const res = await fetch(endpoint)
    if (!res.ok) {
      if (import.meta.env.DEV && isKnownMockTrain(normalized)) {
        const mock = getMockTrainTrajectory(normalized)
        if (mock) return mock
      }
      if (res.status === 404) {
        throw new TrainTrajectoryError('Train trajectory not found', 404)
      }
      throw new TrainTrajectoryError(`Request failed (${res.status})`, res.status)
    }
    return (await res.json()) as TrainTrajectory
  } catch (error) {
    if (import.meta.env.DEV && isKnownMockTrain(normalized)) {
      const mock = getMockTrainTrajectory(normalized)
      if (mock) return mock
    }
    if (error instanceof TrainTrajectoryError) throw error
    throw new TrainTrajectoryError(
      import.meta.env.DEV
        ? 'Unable to reach trajectory API; configure VITE_API_BASE_URL or use a mock train number'
        : 'Unable to reach trajectory API',
    )
  }
}
