import { AnchorHTMLAttributes, CSSProperties } from 'react'
import { CustomCSSProperties } from './custom-css-properties'
import { MotionType } from './motion-type'
import { LinkProps } from './next-link-props'
import { ReactLinkProps } from './react-link-props'

type CommonSnowyProps = {
  melts?: {
    exit?: MotionType
    entry?: MotionType
  }
  in: React.ElementType
  sx?: CustomCSSProperties
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
  href?: string
  to?: string
}

type ElementWithHref = 'a' | React.ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> | LinkProps

type ElementWithTo = ReactLinkProps

export type SnowyProps<E extends React.ElementType> = E extends ElementWithHref
  ? CommonSnowyProps & { in: E; href: string; to?: never }
  : E extends ElementWithTo
  ? CommonSnowyProps & { in: E; to: string; href?: never }
  : CommonSnowyProps & { in: E; href?: never; to?: never }
