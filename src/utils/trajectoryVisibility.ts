import { getNodeById } from '../types/commandDashboard'
import type { CorridorCountryId } from '../types/corridorCountries'
import type { TrainTrajectory, TrajectoryStation } from '../types/trainTrajectory'

export function resolveStationCountry(station: TrajectoryStation): CorridorCountryId | null {
  if (station.country) return station.country
  if (station.id) {
    const node = getNodeById(station.id)
    if (node?.country) return node.country
  }
  return null
}

/** 轨迹路径站点：出发 → 途经 → 当前（不含到达站） */
export function getTrajectoryPathStations(trajectory: TrainTrajectory): TrajectoryStation[] {
  return [trajectory.departure, ...trajectory.passedStations, trajectory.current]
}

export function getMaxTrajectoryStep(trajectory: TrainTrajectory): number {
  return Math.max(0, getTrajectoryPathStations(trajectory).length - 1)
}

export function clampTrajectoryStep(trajectory: TrainTrajectory, step: number): number {
  return Math.max(0, Math.min(step, getMaxTrajectoryStep(trajectory)))
}

export function getRevealedStationsAtStep(
  trajectory: TrainTrajectory,
  step: number,
): TrajectoryStation[] {
  const path = getTrajectoryPathStations(trajectory)
  const clamped = clampTrajectoryStep(trajectory, step)
  return path.slice(0, clamped + 1)
}

/**
 * 分步可见国家：
 * - 始终含出发国、到达国
 * - 追加当前步骤及之前路径站点所在国
 */
export function getVisibleCountriesAtStep(
  trajectory: TrainTrajectory,
  step: number,
): CorridorCountryId[] {
  const visible = new Set<CorridorCountryId>()

  const departureCountry = resolveStationCountry(trajectory.departure)
  const arrivalCountry = resolveStationCountry(trajectory.arrival)
  if (departureCountry) visible.add(departureCountry)
  if (arrivalCountry) visible.add(arrivalCountry)

  for (const station of getRevealedStationsAtStep(trajectory, step)) {
    const country = resolveStationCountry(station)
    if (country) visible.add(country)
  }

  return [...visible]
}

/** 全量展示（不分步） */
export function getVisibleCountriesFromTrajectory(trajectory: TrainTrajectory): CorridorCountryId[] {
  return getVisibleCountriesAtStep(trajectory, getMaxTrajectoryStep(trajectory))
}

export function getStationRoleAtStep(
  trajectory: TrainTrajectory,
  step: number,
  stationIndex: number,
): 'departure' | 'passed' | 'current' {
  const revealed = getRevealedStationsAtStep(trajectory, step)
  if (stationIndex === 0) return 'departure'
  if (stationIndex === revealed.length - 1 && revealed.length > 1) return 'current'
  return 'passed'
}
