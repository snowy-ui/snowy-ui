import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MotionType, UseMeltsProps } from '../types'

export function useMelts({ melts, sx }: UseMeltsProps) {
  const ref = useRef<HTMLElement>(null)
  const [hasClickDelay, setHasClickDelay] = useState(false)
  const [anchor, setAnchor] = useState<HTMLAnchorElement | undefined>(undefined)
  const { exit, entry } = melts || {}

  const exitTime = exit?.transition?.duration ?? 0.3
  const entryTime = entry?.transition?.duration ?? 0.3

  useEffect(() => {
    let timerId: NodeJS.Timeout
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const targetAnchor = target.closest('a') as HTMLAnchorElement
      if (isExternalLink(targetAnchor.href) || targetAnchor.target === '_blank' || window.location.href === targetAnchor.href) return
      setAnchor(targetAnchor)
      e.preventDefault()
      timerId = setTimeout(() => {
        setHasClickDelay(true)
      }, exitTime * 1000)
    }

    const clickHandler = (e: MouseEvent) => {
      if (hasClickDelay) return
      handleClick(e)
    }

    const anchors = document.querySelectorAll('a')
    anchors.forEach((a) => a.addEventListener('click', clickHandler))

    return () => {
      clearTimeout(timerId)
      anchors.forEach((a) => a.removeEventListener('click', clickHandler))
    }
  }, [anchor?.href, exitTime, hasClickDelay])

  useLayoutEffect(() => {
    if (!anchor) return

    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    anchor.dispatchEvent(clickEvent)
    return () => {
      if (hasClickDelay) return
      setAnchor(undefined)
      setHasClickDelay(false)
    }
  }, [anchor, hasClickDelay])

  const transformString = (m: MotionType) => {
    if (!m) return ''
    const transforms = [] as string[]
    const [x, y, z, a] = m?.rotate3d || []
    if (m.x !== undefined) transforms.push(`translateX(${m.x}px)`)
    if (m.y !== undefined) transforms.push(`translateY(${m.y}px)`)
    if (m.scale !== undefined) transforms.push(`scale(${m.scale})`)
    if (m.rotate !== undefined) transforms.push(`rotate(${m.rotate}deg)`)
    if (m.rotateX !== undefined) transforms.push(`rotateX(${m.rotateX}deg)`)
    if (m.rotateY !== undefined) transforms.push(`rotateY(${m.rotateY}deg)`)
    if (m.rotate3d !== undefined) transforms.push(`rotate3d(${x}, ${y}, ${z}, ${a})`)
    return transforms.join(' ')
  }

  const easeString = useCallback((m: MotionType) => {
    const ease = m?.transition?.ease
    if (!ease) return ''
    return typeof ease === 'string' ? ease : `cubic-bezier(${ease})`
  }, [])

  const motion = useCallback((m: MotionType, time: number | undefined, ease: string | undefined) => {
    const dom = ref.current
    if (!dom || !m) return

    const transformStyle = transformString(m)
    if (m.opacity !== undefined) dom.style.opacity = m.opacity.toString()
    if (m.blur !== undefined) dom.style.filter = `blur(${m.blur}px)`
    if (m.scale !== undefined) dom.style.scale = m.scale.toString()
    if (transformStyle !== '') dom.style.transform = transformStyle
    dom.style.transition = ease ? `all ${time}s ${ease}` : `all ${time}s`
  }, [])

  const motionInitialize = useCallback((m: MotionType) => {
    const dom = ref.current
    if (!dom || !m) return

    const transformStyle = transformString(m)
    if (m.opacity !== undefined) dom.style.opacity = m.opacity.toString()
    if (m.blur !== undefined) dom.style.filter = `blur(${m.blur}px)`
    if (m.scale !== undefined) dom.style.scale = m.scale.toString()
    if (transformStyle !== '') dom.style.transform = transformStyle
    dom.style.transition = 'none'
  }, [])

  const parseTransform = (transform: string): Partial<MotionType> => {
    const result: Partial<MotionType> = {}
    const regex = /(\w+)\(([^)]+)\)/g
    let match
    while ((match = regex.exec(transform))) {
      const [, func, value] = match
      const [translateX, translateY] = value.split(',').map((v) => parseFloat(v.trim()))
      const [x, y, z, angle] = value.split(',').map((v) => v.trim())
      switch (func) {
        case 'translate':
          if (!isNaN(translateX)) result.x = translateX
          if (!isNaN(translateY)) result.y = translateY
          break
        case 'translateX':
          result.x = parseFloat(value)
          break
        case 'translateY':
          result.y = parseFloat(value)
          break
        case 'scale':
          result.scale = parseFloat(value)
          break
        case 'rotate':
          result.rotate = parseFloat(value)
          break
        case 'rotateX':
          result.rotateX = parseFloat(value)
          break
        case 'rotateY':
          result.rotateY = parseFloat(value)
          break
        case 'rotate3d':
          result.rotate3d = [parseFloat(x), parseFloat(y), parseFloat(z), angle]
          break
        case 'blur':
          result.blur = parseFloat(value)
          break
      }
    }
    return result
  }

  const sxState = useMemo(() => {
    const baseState: MotionType = {
      opacity: 1,
      blur: 0,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      rotateX: 0,
      rotateY: 0,
      rotate3d: [0, 0, 1, '0deg'],
    }

    if (sx) {
      const transformValues = typeof sx.transform === 'string' ? parseTransform(sx.transform) : {}
      return {
        ...baseState,
        opacity: sx.opacity !== undefined ? parseFloat(sx.opacity as string) : baseState.opacity,
        blur: sx.filter !== undefined ? parseFloat((sx.filter as string).replace('blur(', '').replace('px)', '')) : baseState.blur,
        scale:
          sx.scale !== undefined
            ? parseFloat(sx.scale as string)
            : transformValues?.scale !== undefined
            ? parseFloat(transformValues?.scale.toString())
            : baseState.scale,
        x: transformValues?.x ?? baseState.x,
        y: transformValues?.y ?? baseState.y,
        rotate: transformValues?.rotate ?? baseState.rotate,
        rotateX: transformValues?.rotateX ?? baseState.rotateX,
        rotateY: transformValues?.rotateY ?? baseState.rotateY,
        rotate3d: transformValues?.rotate3d ?? baseState.rotate3d,
      }
    }

    return baseState
  }, [sx])

  const entryStart: MotionType = useMemo(() => {
    if (!entry) return sxState
    return {
      ...sxState,
      ...entry,
      opacity: (sxState.opacity ?? 1) * (entry?.opacity ?? 1),
      blur: (sxState.blur ?? 0) + (entry?.blur ?? 0),
      scale: (sxState.scale ?? 1) * (entry?.scale ?? 1),
      x: (sxState.x ?? 0) + (entry?.x ?? 0),
      y: (sxState.y ?? 0) + (entry?.y ?? 0),
      rotate: (sxState.rotate ?? 0) + (entry?.rotate ?? 0),
      rotateX: (sxState.rotateX ?? 0) + (entry?.rotateX ?? 0),
      rotateY: (sxState.rotateY ?? 0) + (entry?.rotateY ?? 0),
    }
  }, [entry, sxState])

  const exitStart: MotionType = useMemo(() => {
    if (!exit) return sxState
    return {
      ...sxState,
      ...exit,
      opacity: (sxState.opacity ?? 1) * (exit?.opacity ?? 1),
      blur: (sxState.blur ?? 0) + (exit?.blur ?? 0),
      scale: (sxState.scale ?? 1) * (exit?.scale ?? 1),
      x: (sxState.x ?? 0) + (exit?.x ?? 0),
      y: (sxState.y ?? 0) + (exit?.y ?? 0),
      rotate: (sxState.rotate ?? 0) + (exit?.rotate ?? 0),
      rotateX: (sxState.rotateX ?? 0) + (exit?.rotateX ?? 0),
      rotateY: (sxState.rotateY ?? 0) + (exit?.rotateY ?? 0),
    }
  }, [sxState, exit])

  const isExternalLink = (href: string) => {
    const url = new URL(href, window.location.origin)
    return url.origin !== window.location.origin
  }

  // ---------- Exit effect - //
  useLayoutEffect(() => {
    if (!anchor || !melts || isExternalLink(anchor.href) || window.location.href === anchor.href || !exit) return
    const exitEase = easeString(exit)

    motion(exitStart, exitTime, exitEase)
    return () => {
      motionInitialize(exitStart)
    }
  }, [anchor, easeString, exit, exitStart, exitTime, melts, motion, motionInitialize])

  // ---------- Entry effect - //
  useLayoutEffect(() => {
    if (anchor || !melts || !entry) return
    const entryEase = easeString(entry)

    motionInitialize(entryStart)
    const initialMotion = () => {
      motion(sxState, entryTime, entryEase)
    }

    let animationFrameId: number
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(initialMotion)
    })

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [anchor, easeString, entry, entryStart, entryTime, melts, motion, motionInitialize, sxState])

  return ref
}
