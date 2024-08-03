import { AnchorHTMLAttributes, CSSProperties } from 'react'
import { MotionType, SXCSSProperties } from './motion-type'
import { LinkProps } from './next-link-props'
import { ReactLinkProps } from './react-link-props'

type CommonSnowyProps = {
  melts?: {
    exit?: MotionType
    entry?: MotionType
  }
  in: React.ElementType
  sx?: SXCSSProperties
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
  href?: string
  to?: string
}

type ElementWithHref = 'a' | React.ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> | React.ComponentType<LinkProps>

type ElementWithTo = ReactLinkProps

export type SnowyProps<E extends React.ElementType> = E extends ElementWithHref
  ? CommonSnowyProps & { in: E; href: string; to?: never }
  : E extends ElementWithTo
  ? CommonSnowyProps & { in: E; to: string; href?: never }
  : CommonSnowyProps & { in: E; href?: never; to?: never }
