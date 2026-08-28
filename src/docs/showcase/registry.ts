import type { ComponentDoc } from './types'

export const componentDocs: ComponentDoc[] = [
  {
    id: 'circle-buttons',
    name: '圆形按钮',
    title: 'Circle Buttons',
    category: 'Buttons',
    description: '三种风格的圆形图标按钮，包含暗色玻璃、琥珀渐变、点阵边框效果',
    lede: 'Buttons • Three compact circular icon controls using Dark Glass, Launch, and Dot Border material systems.',
    tags: ['css', 'vue', 'button', 'icon button', 'circle'],
    path: '/component/circle-buttons',
    importName: 'CircleButtons',
    colorTune: true,
    variants: [
      {
        id: 'play',
        label: 'Play',
        description: 'Dark Glass reduced to a compact circle — charcoal surface, masked rim, and moving conic light.',
      },
      {
        id: 'plus',
        label: 'Plus',
        description: "Launch's amber gradient, 4px base, soft aura, and pressed state around a centered plus glyph.",
      },
      {
        id: 'mail',
        label: 'Mail',
        description: "Dot Border's transparent face, blue hover fill, corner dots, and dashed frame around a mail glyph.",
      },
    ],
    props: [
      { name: 'variant', type: "'play' | 'plus' | 'mail'", default: "'play'", description: '按钮风格' },
      { name: 'mode', type: "'dark' | 'light'", default: "'dark'", description: '主题模式' },
      { name: 'hue', type: 'number', default: '0', description: '色相偏移（deg），-180 ~ 180' },
      { name: 'saturation', type: 'number', default: '1', description: '饱和度倍数，0 ~ 2' },
      { name: 'brightness', type: 'number', default: '1', description: '亮度倍数，0.35 ~ 1.65' },
      { name: 'ariaLabel', type: 'string', default: '-', description: '无障碍标签' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用' },
    ],
    events: [{ name: 'click', params: 'MouseEvent', description: '点击事件' }],
  },
]

export function getComponentDoc(id: string): ComponentDoc | undefined {
  return componentDocs.find((item) => item.id === id)
}

export function getAdjacentDocs(id: string): { prev?: ComponentDoc; next?: ComponentDoc } {
  const index = componentDocs.findIndex((item) => item.id === id)
  if (index < 0) return {}
  return {
    prev: componentDocs[index - 1],
    next: componentDocs[index + 1],
  }
}

export function getAllCategories(): string[] {
  return [...new Set(componentDocs.map((item) => item.category))]
}
