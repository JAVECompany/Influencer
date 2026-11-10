import type { Angles, Box, ExploreItem } from '../types/creatorDiscovery'

type GlobeCard = { item: ExploreItem; size: number; left: number; top: number; width: number; depth: number }

const goldenAngle = Math.PI * (3 - Math.sqrt(5))

export const circleSize = (count: number, peak: number, compact: boolean) =>
  Math.round((34 + 74 * (count / peak) ** 0.57) * (compact ? 0.72 : 1))

export function globeCards(
  orbit: ExploreItem[],
  width: number,
  height: number,
  angles: Angles,
  reserved: Box,
  peak: number
) {
  const compact = width < 560
  const radiusX = width * (compact ? 0.57 : 0.51)
  const radiusY = height * 0.49
  const occupied = [reserved]
  const visible: GlobeCard[] = []
  const sinYaw = Math.sin(angles.yaw)
  const cosYaw = Math.cos(angles.yaw)
  const sinPitch = Math.sin(angles.pitch)
  const cosPitch = Math.cos(angles.pitch)
  orbit.forEach((item, index) => {
    const z = 0.86 - (1.83 * index) / Math.max(1, orbit.length - 1)
    const ring = Math.sqrt(1 - z * z)
    const theta = index * goldenAngle - 1.48
    const x = Math.cos(theta) * ring
    const y = Math.sin(theta) * ring
    const rotX = cosYaw * x + sinYaw * z
    const depth = -sinYaw * x + cosYaw * z
    const rotY = cosPitch * y - sinPitch * depth
    const rotZ = sinPitch * y + cosPitch * depth
    if (rotZ < 0.01) return
    const size = Math.round(circleSize(item.count, peak, compact) * (0.64 + 0.36 * rotZ))
    const left = width / 2 + radiusX * rotX
    const top = height / 2 + radiusY * rotY
    const w = Math.max(44, size + 10)
    const h = size + 18
    const box: Box = [left - w / 2, top - h / 2, left + w / 2, top + h / 2]
    if (box[0] < 5 || box[1] < 6 || box[2] > width - 5 || box[3] > height - 6) return
    if (occupied.some(([x1, y1, x2, y2]) => box[0] < x2 && box[2] > x1 && box[1] < y2 && box[3] > y1)) return
    occupied.push(box)
    visible.push({ item, size, left, top, width: w, depth: rotZ })
  })
  return visible
}
