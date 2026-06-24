import { activeTrajectories, corridorNodes, getNodeById } from '../types/commandDashboard'
import type { TrainTrajectory, TrajectoryStation } from '../types/trainTrajectory'

function nodeToStation(nodeId: string, arrivedAt?: string): TrajectoryStation | null {
  const node = getNodeById(nodeId)
  if (!node) return null
  return {
    id: node.id,
    name: node.name,
    nameEn: node.nameEn,
    lat: node.lat,
    lng: node.lng,
    country: node.country,
    arrivedAt,
  }
}

function buildFromActiveTrajectory(trainNo: string): TrainTrajectory | null {
  const track = activeTrajectories.find((item) => item.trainNo === trainNo)
  if (!track) return null

  const route = track.routeNodeIds
  const currentIndex = route.indexOf(track.currentNodeId)
  if (currentIndex < 0) return null

  const departure = nodeToStation(route[0], track.updatedAt)
  const arrival = nodeToStation(route[route.length - 1])
  const current = nodeToStation(track.currentNodeId, track.updatedAt)
  if (!departure || !arrival || !current) return null

  const passedStations = route
    .slice(1, currentIndex)
    .map((nodeId) => nodeToStation(nodeId, track.updatedAt))
    .filter((station): station is TrajectoryStation => station !== null)

  return {
    trainNo: track.trainNo,
    departure,
    arrival,
    current,
    passedStations,
    updatedAt: track.updatedAt,
  }
}

export function getMockTrainTrajectory(trainNo: string): TrainTrajectory | null {
  return buildFromActiveTrajectory(trainNo.trim())
}

export function listMockTrainNumbers(): string[] {
  return activeTrajectories.map((item) => item.trainNo)
}

export function isKnownMockTrain(trainNo: string): boolean {
  return activeTrajectories.some((item) => item.trainNo === trainNo.trim())
}

/** Dev-only: export corridor nodes as reference for backend mock alignment */
export function getReferenceStationIds(): string[] {
  return corridorNodes.map((node) => node.id)
}
