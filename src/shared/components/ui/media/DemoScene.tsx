import { useId } from 'react'

export default function DemoScene({ art = 0, className = '' }) {
  const gradient = useId()
  const glow = useId()
  const water = useId()
  const sky = [
    ['#101d3d', '#e47d71', '#0a1829', '#ffc18a'],
    ['#291936', '#b56f71', '#1c1f39', '#f9cb92'],
    ['#143b53', '#88b2ad', '#152d3c', '#f2db9e'],
    ['#2b264b', '#db9a7f', '#1f213e', '#ffd3a4'],
    ['#202a46', '#9b859e', '#192639', '#f3b8a3'],
  ][art % 5]
  const buildings = [
    48, 38, 76, 56, 69, 101, 49, 42, 67, 52, 92, 64, 44, 82, 50, 36, 62, 41, 75, 34, 47, 55, 37, 67, 45,
  ]
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gradient} x2="0" y2="1">
          <stop stopColor={sky[0]} />
          <stop offset=".8" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[3]} />
        </linearGradient>
        <radialGradient id={glow}>
          <stop stopColor={sky[3]} stopOpacity=".6" />
          <stop offset="1" stopColor={sky[3]} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={water} x2="0" y2="1">
          <stop stopColor={sky[1]} />
          <stop offset=".45" stopColor={sky[2]} />
          <stop offset="1" stopColor="#08111e" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${gradient})`} />
      <ellipse cx="526" cy="233" rx="210" ry="153" fill={`url(#${glow})`} />
      <circle cx="526" cy="180" r="28" fill={sky[3]} />
      {Array.from({ length: 24 }, (_, i) => (
        <circle
          key={i}
          cx={(i * 127 + 17) % 800}
          cy={(i * 19 + 31) % 142}
          r={i % 3 ? '.65' : '1.2'}
          opacity={i % 3 ? '.35' : '.75'}
          fill="#f0ded0"
        />
      ))}
      <path
        d="M0 192Q137 157 264 182T488 178Q352 207 170 203T0 221ZM365 103Q506 105 615 129Q718 145 800 119V150Q702 166 590 141Z"
        fill={sky[0]}
        opacity=".25"
      />
      <path
        d="M0 269 69 230 98 244 153 217 208 254 273 239 367 283 447 259 515 275 579 248 650 261 724 219 800 242V333H0Z"
        fill={sky[0]}
        opacity=".72"
      />
      <rect y="313" width="800" height="137" fill={`url(#${water})`} />
      {Array.from({ length: 31 }, (_, i) => (
        <path
          key={i}
          d={`M${(i * 103 + 13) % 800} ${322 + ((i * 37) % 121)}h${17 + ((i * 17) % 83)}`}
          stroke={sky[i % 2 ? 1 : 3]}
          opacity={0.11 + (i % 5) * 0.04}
          strokeWidth={i % 4 ? 1 : 2}
        />
      ))}
      {buildings.map((height, i) => {
        const x = i * 33 - 11
        const y = 316 - height * (i > 12 ? 0.61 : 0.96)
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d={`M0 ${316 - y}V0h${27 + (i % 5)}v${316 - y}Z`} fill={i % 3 === 0 ? '#111a2d' : sky[2]} />
            {Array.from({ length: Math.floor((316 - y) / 11) * 3 }, (_, j) => (
              <rect
                key={j}
                x={5 + (j % 3) * 8}
                y={5 + Math.floor(j / 3) * 11}
                width="3.5"
                height="2.5"
                rx=".6"
                fill={sky[3]}
                opacity={(j * 7 + i) % 5 < 2 ? '.78' : '.14'}
              />
            ))}
          </g>
        )
      })}
      <path d="M0 316H800" stroke={sky[3]} strokeWidth="1" opacity=".65" />
      <path d="M0 410Q138 387 237 409T441 430Q614 414 800 396V450H0Z" fill="#090f1a" opacity=".53" />
    </svg>
  )
}
