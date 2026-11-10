import { formatNumber } from '../../../shared/utils/format/format'
import type { Angles, Box, ExploreItem } from '../types/creatorDiscovery'

type GlobeCard = { item: ExploreItem; size: number; left: number; top: number; width: number; depth: number }
type GlobePoint = { item: ExploreItem; x: number; y: number; z: number }

const goldenAngle = Math.PI * (3 - Math.sqrt(5))

export const circleSize = (count: number, peak: number, compact: boolean) =>
  Math.round((29 + 61 * (count / peak) ** 0.57) * (compact ? 0.76 : 1))

const cardWidth = (size: number, count: number) => Math.max(44, size + 4, formatNumber(count).length * 6 + 14)
const cardHeight = (size: number) => Math.max(44, size + 18)

function globePoints(
  items: ExploreItem[],
  radiusX: number,
  radiusY: number,
  peak: number,
  compact: boolean
): GlobePoint[] {
  const subscribed = items.filter((item) => item.subscribed)
  const sizes = subscribed.map(({ count }) => circleSize(count, peak, compact))
  const columnWidth =
    Math.max(44, ...subscribed.map(({ count }, index) => cardWidth(sizes[index], count))) + 2
  const rowHeight = Math.max(44, ...sizes.map(cardHeight)) + 4
  const columns = Math.max(1, Math.floor((radiusX * 1.25) / columnWidth))
  const rows = Math.max(1, Math.floor((radiusY * 1.25) / rowHeight))
  const centered = subscribed.slice(0, columns * rows)
  const rowCount = Math.ceil(centered.length / columns)
  const centerPoints = centered.map((item, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const itemsInRow = Math.min(columns, centered.length - row * columns)
    const x = ((column - (itemsInRow - 1) / 2) * columnWidth) / radiusX
    const y = ((row - (rowCount - 1) / 2) * rowHeight) / radiusY
    return { item, x, y, z: Math.sqrt(1 - x * x - y * y) }
  })
  const orbit = [...subscribed.slice(centered.length), ...items.filter((item) => !item.subscribed)]
  const orbitPoints = orbit.map((item, index) => {
    const z = 0.92 - (1.9 * index) / Math.max(1, orbit.length - 1)
    const ring = Math.sqrt(1 - z * z)
    const theta = index * goldenAngle - 1.48
    return { item, x: Math.cos(theta) * ring, y: Math.sin(theta) * ring, z }
  })
  return [...centerPoints, ...orbitPoints]
}

export function globeCards(
  items: ExploreItem[],
  width: number,
  height: number,
  angles: Angles,
  peak: number
) {
  if (!width || !height) return []
  const compact = width < 560
  const radiusX = width * (compact ? 0.57 : 0.51)
  const radiusY = height * 0.49
  const occupied: Box[] = []
  const visible: GlobeCard[] = []
  const sinYaw = Math.sin(angles.yaw)
  const cosYaw = Math.cos(angles.yaw)
  const sinPitch = Math.sin(angles.pitch)
  const cosPitch = Math.cos(angles.pitch)
  for (const { item, x, y, z } of globePoints(items, radiusX, radiusY, peak, compact)) {
    const rotX = cosYaw * x + sinYaw * z
    const depth = -sinYaw * x + cosYaw * z
    const rotY = cosPitch * y - sinPitch * depth
    const rotZ = sinPitch * y + cosPitch * depth
    if (rotZ < 0.01) continue
    const size = Math.round(circleSize(item.count, peak, compact) * (0.64 + 0.36 * rotZ))
    const left = width / 2 + radiusX * rotX
    const top = height / 2 + radiusY * rotY
    const w = cardWidth(size, item.count)
    const h = cardHeight(size)
    const box: Box = [left - w / 2, top - h / 2 - 2, left + w / 2, top + h / 2]
    if (box[0] < 5 || box[1] < 6 || box[2] > width - 5 || box[3] > height - 6) continue
    if (occupied.some(([x1, y1, x2, y2]) => box[0] < x2 && box[2] > x1 && box[1] < y2 && box[3] > y1))
      continue
    occupied.push(box)
    visible.push({ item, size, left, top, width: w, depth: rotZ })
  }
  return visible
}
