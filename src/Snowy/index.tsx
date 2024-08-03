'use client'

import styled from 'styled-components'
import type { SnowyProps, SXCSSProperties } from './types'
import { useMelts } from './hook/use-melts'
import { convertStyles } from './util/helper'

const StyledSnow = styled.div.withConfig({
  // Filter out 'sx' and 'melts' and 'to'
  shouldForwardProp: (prop) => !['sx', 'melts', 'to'].includes(prop),
})<{ sx: SXCSSProperties }>(({ sx }) => convertStyles(sx))

const Snowy = <E extends React.ElementType>({
  in: Element = 'div',
  sx,
  melts,
  children,
  className,
  style,
  href,
  to,
  ...props
}: SnowyProps<E> & React.HTMLAttributes<HTMLElement>) => {
  useMelts({ melts, sx })

  return (
    <StyledSnow as={Element} sx={sx} melts={melts} href={href} to={to} className={className} style={style} id="#snowy-ui" {...props}>
      {children}
    </StyledSnow>
  )
}

export default Snowy
