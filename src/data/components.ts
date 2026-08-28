import { componentDocs } from '@/docs/showcase/registry'
import type { ComponentDoc } from '@/docs/showcase/types'

export type ComponentMeta = ComponentDoc
export const components = componentDocs

export { getComponentDoc as getComponentById, getAllCategories } from '@/docs/showcase/registry'

export function getComponentsByCategory(category: string): ComponentMeta[] {
  return components.filter((component) => component.category === category)
}
