import type { RefObject } from 'react'
import { rouletteSegmentColors } from '../../constants/roulette'
import type { IWheelSegment } from '../../utils/roulette/roulette'

const center = 144

const rim = 130

const getWheelPoint = (angle: number, radius: number) => {
  const radians = (angle * Math.PI) / 180
  return [center + radius * Math.sin(radians), center - radius * Math.cos(radians)]
}

export default function RouletteWheel({
  segments,
  disc,
}: {
  segments: IWheelSegment[]
  disc: RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[292px]" aria-hidden="true">
      <div ref={disc} data-roulette-disc className="size-full">
        <svg viewBox="0 0 288 288" className="size-full drop-shadow-lg">
          <circle
            cx={center}
            cy={center}
            r="139"
            fill="var(--theme-raised)"
            stroke="var(--theme-line)"
            strokeWidth="2"
          />
          {segments.map(({ name, start, end }, i) => {
            const width = end - start
            const middle = (start + end) / 2
            const [x, y] = getWheelPoint(middle, rim * 0.6)
            const tilt = middle > 180 ? middle + 90 : middle - 90
            const characters = Array.from(name)
            const label = characters.length > 14 ? characters.slice(0, 13).join('') + '…' : name
            const fontSize = width < 27 ? 10 : 12
            const estimatedLength = Array.from(label).reduce(
              (length, character) => length + fontSize * (character.charCodeAt(0) < 128 ? 0.55 : 1),
              0
            )
            const path =
              'M144 144L' +
              getWheelPoint(start, rim).join(' ') +
              'A130 130 0 ' +
              Number(width > 180) +
              ' 1 ' +
              getWheelPoint(end, rim).join(' ') +
              'Z'
            return (
              <g key={i}>
                <path
                  d={path}
                  fill={rouletteSegmentColors[i]}
                  stroke="var(--theme-raised)"
                  strokeWidth="1.4"
                />
                {width >= 18 && (
                  <text
                    x={x}
                    y={y}
                    transform={`rotate(${tilt} ${x} ${y})`}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#101b23"
                    fontSize={fontSize}
                    fontWeight="900"
                    textLength={estimatedLength > 90 ? 90 : undefined}
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {label}
                  </text>
                )}
              </g>
            )
          })}
          <circle cx={center} cy={center} r={rim} fill="none" stroke="var(--theme-line)" strokeWidth="3" />
          <circle
            cx={center}
            cy={center}
            r="25"
            fill="var(--theme-raised)"
            stroke="var(--theme-accent)"
            strokeWidth="2"
          />
          <circle cx={center} cy={center} r="7" fill="var(--theme-accent)" />
        </svg>
      </div>
      <svg
        viewBox="0 0 32 34"
        className="pointer-events-none absolute -top-1 left-1/2 h-9 w-8 -translate-x-1/2 drop-shadow-md"
      >
        <path
          d="M6 2h20a3 3 0 0 1 3 3v9a5 5 0 0 1-1 3L18 31a2.5 2.5 0 0 1-4 0L4 17a5 5 0 0 1-1-3V5a3 3 0 0 1 3-3Z"
          fill="var(--theme-accent)"
          stroke="var(--theme-on-accent)"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
