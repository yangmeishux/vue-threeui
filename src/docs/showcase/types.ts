export interface ComponentVariantDoc {
  id: string
  label: string
  description: string
}

export interface ComponentPropDoc {
  name: string
  type: string
  default: string
  description: string
}

export interface ComponentEventDoc {
  name: string
  params: string
  description: string
}

export interface ComponentDoc {
  id: string
  /** 目录与中文名 */
  name: string
  /** 详情页主标题，如 Circle Buttons */
  title: string
  category: string
  description: string
  /** 标题下的一句说明：Category • summary */
  lede: string
  tags: string[]
  path: string
  importName: string
  variants: ComponentVariantDoc[]
  props: ComponentPropDoc[]
  events: ComponentEventDoc[]
  colorTune?: boolean
}
