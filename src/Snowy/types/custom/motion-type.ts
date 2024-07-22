type MotionProperties = {
  opacity?: number
  blur?: number
  scale?: number
  x?: number
  y?: number
  rotate?: number
  rotateX?: number
  rotateY?: number
  rotate3d?: [x: number, y: number, z: number, a: string]
  transition?: {
    duration: number
    ease?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | [x1: number, y1: number, x2: number, y2: number]
  }
}

export type MotionType = MotionProperties | undefined

export type UseMeltsProps = {
  melts?: {
    exit?: MotionType
    entry?: MotionType
  }
}
