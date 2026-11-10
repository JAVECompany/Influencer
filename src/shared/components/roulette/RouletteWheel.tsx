import type { RefObject } from 'react'
import { wheelSegments } from '../../utils/roulette'

const colors = ['#66e8c4', '#6189b4', '#d7ae73', '#8b8fc4', '#62a497', '#b88495', '#7aa1bb', '#96b179']

const center = 144

const rim = 130

const at = (angle: number, radius: number) => {
  const radians = (angle * Math.PI) / 180
  return [center + radius * Math.sin(radians), center - radius * Math.cos(radians)]
}

export default function RouletteWheel({
  segments,
  disc,
}: {
  segments: ReturnType<typeof wheelSegments>
  disc: RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[292px]" aria-hidden="true">
      <div ref={disc} data-roulette-disc className="size-full">
        <svg viewBox="0 0 288 288" className="size-full drop-shadow-[0_10px_16px_#03090c99]">
          <circle cx={center} cy={center} r="139" fill="#0a1119" stroke="#53716f" strokeWidth="2" />
          {segments.map(({ start, end, center: middle }, i) => {
            const [x, y] = at(middle, rim * 0.75)
            const path =
              'M144 144L' +
              at(start, rim).join(' ') +
              'A130 130 0 ' +
              Number(end - start > 180) +
              ' 1 ' +
              at(end, rim).join(' ') +
              'Z'
            return (
              <g key={i}>
                <path d={path} fill={colors[i]} stroke="#182630" strokeWidth="1.4" />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#101b23"
                  fontSize={end - start < 14 ? '9' : '17'}
                  fontWeight="900"
                >
                  {i + 1}
                </text>
              </g>
            )
          })}
          <circle cx={center} cy={center} r={rim} fill="none" stroke="#d6fff01a" strokeWidth="3" />
          <circle cx={center} cy={center} r="25" fill="#13272e" stroke="#a6f2dd" strokeWidth="2" />
          <circle cx={center} cy={center} r="7" fill="#62e8c4" />
        </svg>
      </div>
      <svg
        viewBox="0 0 32 34"
        className="pointer-events-none absolute -top-1 left-1/2 h-9 w-8 -translate-x-1/2 drop-shadow-md"
      >
        <path
          d="M6 2h20a3 3 0 0 1 3 3v9a5 5 0 0 1-1 3L18 31a2.5 2.5 0 0 1-4 0L4 17a5 5 0 0 1-1-3V5a3 3 0 0 1 3-3Z"
          fill="#e1fff6"
          stroke="#203a38"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
