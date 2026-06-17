export interface TrajectoryStation {
  id?: string
  name: string
  nameEn?: string
  lat: number
  lng: number
  arrivedAt?: string
}

export interface TrainTrajectory {
  trainNo: string
  departure: TrajectoryStation
  arrival: TrajectoryStation
  current: TrajectoryStation
  passedStations: TrajectoryStation[]
  updatedAt?: string
}

export type TrajectoryStationRole = 'departure' | 'arrival' | 'current' | 'passed'
