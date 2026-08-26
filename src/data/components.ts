export interface ComponentMeta {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  path: string
}

export const components: ComponentMeta[] = [
  {
    id: 'circle-buttons',
    name: '圆形按钮',
    category: '交互元素',
    description: '三种风格的圆形图标按钮，包含暗色玻璃、琥珀渐变、点阵边框效果',
    tags: ['按钮', '图标', '交互', 'CSS'],
    path: '/component/circle-buttons',
  },
]

export function getComponentById(id: string): ComponentMeta | undefined {
  return components.find((c) => c.id === id)
}

export function getComponentsByCategory(category: string): ComponentMeta[] {
  return components.filter((c) => c.category === category)
}

export function getAllCategories(): string[] {
  return [...new Set(components.map((c) => c.category))]
}
