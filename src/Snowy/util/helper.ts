import { CustomCSSProperties, PropertyType, PropertyValue } from '../types'

const toKebabCase = (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase()
const exception = ['line-height', 'font-weight', 'opacity', 'scale', 'z-index']

export const convertStyles = (sx: CustomCSSProperties | undefined) => {
  const kebabStyles: { [key: string]: PropertyValue } = {}
  for (const key in sx) {
    if (sx.hasOwnProperty.call(sx, key)) {
      const kebabKey = toKebabCase(key)
      kebabStyles[kebabKey] = exception.includes(kebabKey) ? (sx as PropertyType)[key].toString() : (sx as PropertyType)[key]
    }
  }
  return kebabStyles
}
