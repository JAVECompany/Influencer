import type { CSSProperties } from 'react'

const atlases = [
  {
    path: '/portraits/women.jpg',
    width: 1499,
    height: 1049,
    columns: 10,
    centers: [80, 241, 406, 568, 731, 890],
  },
  { path: '/portraits/women-extra.jpg', width: 1983, height: 793, columns: 5, centers: [198, 594] },
  { path: '/portraits/men.jpg', width: 1374, height: 1145, columns: 6, centers: [114, 352, 587, 805, 1030] },
]

export function getPortraitStyle(index?: number): CSSProperties | undefined {
  if (index === undefined || !Number.isInteger(index) || index < 0 || index >= 100) {
    return undefined
  }

  const atlas = atlases[index < 60 ? 0 : index < 70 ? 1 : 2]
  const tile = index < 60 ? index : index < 70 ? index - 60 : index - 70
  const cell = atlas.width / atlas.columns
  const crop = cell * 0.92
  const left = ((tile % atlas.columns) + 0.5) * cell - crop / 2
  const top = atlas.centers[Math.floor(tile / atlas.columns)] - crop / 2
  return {
    backgroundImage: 'url(' + atlas.path + ')',
    backgroundSize: (atlas.width / crop) * 100 + '% ' + (atlas.height / crop) * 100 + '%',
    backgroundPosition:
      (left / (atlas.width - crop)) * 100 + '% ' + (top / (atlas.height - crop)) * 100 + '%',
  }
}
