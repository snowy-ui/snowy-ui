import { CustomCSSProperties, PropertyType, PropertyValue } from '../types'

const toKebabCase = (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase()

export const convertStyles = (sx: CustomCSSProperties | undefined) => {
  const kebabStyles: { [key: string]: PropertyValue } = {}
  for (const key in sx) {
    if (sx.hasOwnProperty.call(sx, key)) {
      kebabStyles[toKebabCase(key)] = (sx as PropertyType)[key].toString()
    }
  }
  return kebabStyles
}
