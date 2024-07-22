import { AnchorHTMLAttributes, CSSProperties } from 'react'
import { CustomCSSProperties } from './custom-css-properties'
import { MotionType } from './motion-type'
import { LinkProps } from './next-link-props'

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
}

type ElementWithHref = 'a' | React.ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> | React.ComponentType<LinkProps>

export type SnowyProps<E extends React.ElementType> = E extends ElementWithHref
  ? CommonSnowyProps & { in: E; href: string }
  : CommonSnowyProps & { in: E; href?: never }
