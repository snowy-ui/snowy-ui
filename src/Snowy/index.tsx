'use client'

import styled from 'styled-components'
import type { SnowyProps, CustomCSSProperties } from './types'
import { useMelts } from './hook/use-melts'
import { convertStyles } from './util/helper'

const StyledSnow = styled.div.withConfig({
  // Filter out 'sx' and 'melts'
  shouldForwardProp: (prop) => !['sx', 'melts'].includes(prop),
})<{ sx: CustomCSSProperties }>(({ sx }) => convertStyles(sx))

const Snowy = <E extends React.ElementType>({
  in: Element = 'div',
  sx,
  melts,
  children,
  className,
  style,
  href,
  ...props
}: SnowyProps<E> & React.HTMLAttributes<HTMLElement>) => {
  useMelts({ melts })

  return (
    <StyledSnow as={Element} sx={sx} melts={melts} href={href} className={className} style={style} id="#snowy-ui" {...props}>
      {children}
    </StyledSnow>
  )
}

export default Snowy
