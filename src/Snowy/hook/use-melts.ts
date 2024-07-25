import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { MotionType, UseMeltsProps } from '../types'

let anchor: HTMLAnchorElement | null
let clicked: boolean
const useCapture = true

export function useMelts({ melts }: UseMeltsProps) {
  const [hasDelay, setHasDelay] = useState(false)
  const { exit, entry } = melts || {}

  const exitTime = exit?.transition?.duration ?? 0.3
  const entryTime = entry?.transition?.duration ?? 0.3

  const getClientElement = useCallback(() => {
    const element = document.getElementById('#snowy-ui')
    if (element instanceof HTMLElement) return element
    else return null
  }, [])

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
    if (typeof ease === 'string') return ease
    return `cubic-bezier(${ease})`
  }, [])

  const motion = useCallback(
    (m: MotionType, time: number | undefined, ease: string | undefined) => {
      const dom = getClientElement() as HTMLElement

      const transformStyle = transformString(m)
      if (!m) return
      if (m.opacity !== undefined) dom.style.opacity = String(m.opacity)
      if (m.blur !== undefined) dom.style.filter = `blur(${m.blur}px)`
      if (transformStyle !== '') dom.style.transform = transformStyle
      dom.style.transition = ease ? `all ${time}s ${ease}` : `all ${time}s`
    },
    [getClientElement]
  )

  const motionInitialize = useCallback(
    (m: MotionType) => {
      const dom = getClientElement() as HTMLElement

      const transformStyle = transformString(m)
      if (!m) return
      if (m?.opacity !== undefined) dom.style.opacity = String(m.opacity)
      if (m?.blur !== undefined) dom.style.filter = `blur(${m.blur}px)`
      if (transformStyle !== '') dom.style.transform = transformStyle
      dom.style.transition = 'none'
    },
    [getClientElement]
  )

  const init: MotionType = useMemo(
    () => ({
      opacity: 1,
      blur: 0,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      rotateX: 0,
      rotateY: 0,
      rotate3d: [0, 0, 1, '0deg'],
    }),
    []
  )

  const eventTargetHTMLElement = (e: MouseEvent) => {
    const clickTarget = e.target
    if (clickTarget instanceof HTMLElement) return clickTarget
    else return null
  }

  const isExternalLink = (href: string) => {
    const url = new URL(href, window.location.origin)
    return url.origin !== window.location.origin
  }

  const clickHandler = useCallback(
    (e: MouseEvent) => {
      clicked = true
      const target = eventTargetHTMLElement(e)
      if (target == null) return

      const anchorElement = target.closest('a')
      if (anchorElement == null) return
      if (isExternalLink(anchorElement.href)) return
      if (window.location.href === anchorElement.href) return

      const exitEase = easeString(exit)
      // To the exit animation.
      if (exit) motion(exit, exitTime, exitEase)
      e.preventDefault()
      setTimeout(() => {
        setHasDelay(true)
      }, (exit ? exitTime : 0) * 1000)
      anchor = anchorElement
    },
    [easeString, exit, exitTime, motion]
  )

  const innerEffect = useCallback(() => {
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    if (!hasDelay) return
    if (anchor == null) return

    anchor.dispatchEvent(clickEvent)
    anchor = null
  }, [hasDelay])

  // ---------- Exit effect - //
  useLayoutEffect(() => {
    if (!melts) return
    innerEffect()
    document.body.addEventListener('click', clickHandler, useCapture)

    return () => {
      document.body.removeEventListener('click', clickHandler, useCapture)
      clicked && motionInitialize(exit)
      clicked = false
    }
  }, [clickHandler, exit, innerEffect, melts, motionInitialize])

  // ---------- Entry effect - //
  useLayoutEffect(() => {
    if (!melts) return
    const entryEase = easeString(entry)

    motionInitialize(entry)
    const initialMotion = () => {
      if (entry) motion(init, entryTime, entryEase)
    }
    const animateId = requestAnimationFrame(initialMotion)

    return () => {
      cancelAnimationFrame(animateId)
    }
  }, [easeString, entry, entryTime, init, melts, motion, motionInitialize])

  return
}
