import { useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import type { Angles, Box, ExploreItem } from '../types/creatorDiscovery'
import { circleSize, globeCards } from '../utils/globeLayout'

const startingAngles = { yaw: 0, pitch: 0 }

const angleStep = 0.008

type DragGesture = { id: number; x: number; y: number; angles: Angles }

export function useCreatorGlobe(items: ExploreItem[], peak: number) {
  const viewport = useRef<HTMLDivElement>(null)
  const gesture = useRef<DragGesture | null>(null)
  const ignoreClick = useRef(false)
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })
  const [angles, setAngles] = useState(startingAngles)
  const [dragging, setDragging] = useState(false)
  useLayoutEffect(() => {
    const element = viewport.current
    if (!element) return
    const sync = () => setDimensions({ width: element.clientWidth, height: element.clientHeight })
    const observer = new ResizeObserver(sync)
    sync()
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const pinned = items
    .filter((item) => item.subscribed)
    .map((item) => ({
      item,
      size: circleSize(item.count, peak, width < 560),
    }))
  const reserveWidth = Math.min(
    Math.max(0, width - 32),
    Math.max(150, 20 + pinned.reduce((total, { size }) => total + Math.max(48, size + 10), 0))
  )
  const reserveHeight = 43 + Math.max(24, ...pinned.map(({ size }) => size))
  const reserved: Box = [
    width / 2 - reserveWidth / 2 - 6,
    height / 2 - reserveHeight / 2 - 3,
    width / 2 + reserveWidth / 2 + 6,
    height / 2 + reserveHeight / 2 + 3,
  ]
  const visible = globeCards(
    items.filter((item) => !item.subscribed),
    width,
    height,
    angles,
    reserved,
    peak
  )
  const move = (dx: number, dy: number, origin: Angles) => ({
    yaw: (origin.yaw + dx) % (2 * Math.PI),
    pitch: (origin.pitch + dy) % (2 * Math.PI),
  })
  const end = () => {
    gesture.current = null
    setDragging(false)
  }

  const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest('[data-pinned]')))
      return
    ignoreClick.current = false
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, angles }
  }
  const drag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = gesture.current
    if (drag?.id !== event.pointerId) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!ignoreClick.current && Math.hypot(dx, dy) < 6) return
    if (!ignoreClick.current) {
      event.currentTarget.setPointerCapture(event.pointerId)
      ignoreClick.current = true
      setDragging(true)
    }
    setAngles(move(dx * angleStep, dy * angleStep, drag.angles))
  }
  const rotateByKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Partial<Record<string, [number, number]>> = {
      ArrowLeft: [-0.32, 0],
      ArrowRight: [0.32, 0],
      ArrowUp: [0, -0.32],
      ArrowDown: [0, 0.32],
    }
    const step = steps[event.key]
    if (!step || (event.target instanceof Element && event.target.closest('[data-pinned]'))) return
    event.preventDefault()
    setAngles((old) => move(...step, old))
  }
  const leave = () => {
    if (!ignoreClick.current) end()
  }
  const reset = () => setAngles(startingAngles)
  const acceptsClick = (detail: number) => !ignoreClick.current || detail === 0

  return {
    viewport,
    dragging,
    angles,
    pinned,
    reserveWidth,
    visible,
    beginDrag,
    drag,
    end,
    leave,
    rotateByKey,
    reset,
    acceptsClick,
  }
}
