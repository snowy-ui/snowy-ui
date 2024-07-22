import type {
  CSSCalcExpressionFunctioin,
  CSSColumnsValue,
  CSSLengthSubValue,
  CSSFontSizeSubValue,
  CSSGlobalValue,
  CSSNumericValue,
  CSSMarginValue,
  CSSPaddingValue,
  CSSRadiusValues,
} from '../common/css-values'
import type { CSSColorValue, CSSVariableProperties, CSSVariableValue } from '../common/css-variables'

type Media = `@media ${string}`
type MediaType = {
  [key in Media]?: CustomCSSProperties
}

type AndString = `&${string}`
type AndStringType = {
  [key in AndString]?: CustomCSSProperties
}

type CustomExtendProperties = {
  width?: CSSNumericValue | CSSLengthSubValue | 'auto'
  height?: CSSNumericValue | CSSLengthSubValue | 'auto'
  margin?: CSSMarginValue
  marginBottom?: CSSNumericValue | 'auto'
  marginLeft?: CSSNumericValue | 'auto'
  marginRight?: CSSNumericValue | 'auto'
  marginTop?: CSSNumericValue | 'auto'
  padding?: CSSPaddingValue
  paddingBottom?: CSSNumericValue
  paddingLeft?: CSSNumericValue
  paddingRight?: CSSNumericValue
  paddingTop?: CSSNumericValue
  fontSize?: CSSNumericValue | CSSFontSizeSubValue
  scale?: CSSNumericValue | `${number}` | 'none'
  opacity?: CSSNumericValue | `${number}`
  lineHeight?: CSSNumericValue | `${number}` | 'normal'
  letterSpacing?: CSSNumericValue | 'normal'
  wordSpacing?: CSSNumericValue | 'normal'
  borderWidth?: CSSNumericValue | 'thin' | 'medium' | 'thick'
  borderRadius?: CSSRadiusValues | number
  top?: CSSNumericValue | 'auto'
  right?: CSSNumericValue | 'auto'
  bottom?: CSSNumericValue | 'auto'
  left?: CSSNumericValue | 'auto'
  maxWidth?: CSSNumericValue | CSSLengthSubValue | 'auto'
  maxHeight?: CSSNumericValue | CSSLengthSubValue | 'auto'
  minWidth?: CSSNumericValue | CSSLengthSubValue | 'auto'
  minHeight?: CSSNumericValue | CSSLengthSubValue | 'auto'
  flexBasis?: CSSNumericValue | 'auto'
  gap?: CSSNumericValue | CSSCalcExpressionFunctioin
  rowGap?: CSSNumericValue
  columnGap?: CSSNumericValue | 'normal'
  columns?: CSSColumnsValue
  gridColumn?: string
  gridRow?: string
  color?: CSSColorValue | CSSGlobalValue
  background?: CSSColorValue | CSSGlobalValue | 'none'
  backgroundColor?: CSSColorValue | CSSGlobalValue
}

export type CustomCSSProperties =
  | (CustomExtendProperties & {
      [K in keyof React.CSSProperties]: React.CSSProperties[K] | CSSVariableValue
    })
  | CSSVariableProperties
  | MediaType
  | AndStringType
