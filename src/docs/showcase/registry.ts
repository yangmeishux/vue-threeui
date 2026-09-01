import type { ComponentDoc } from './types'

export const componentDocs: ComponentDoc[] = [
  {
    id: 'circle-buttons',
    name: '圆形按钮',
    title: 'Circle Buttons',
    category: '按钮',
    description: '三种风格的圆形图标按钮，包含暗色玻璃、琥珀渐变、点阵边框效果',
    lede: '按钮 · 三款紧凑的圆形图标控件，分别使用暗色玻璃、琥珀渐变与点阵边框材质。',
    tags: ['按钮', '图标', '交互', 'CSS', 'Vue'],
    path: '/component/circle-buttons',
    importName: 'CircleButtons',
    colorTune: true,
    variants: [
      {
        id: 'play',
        label: '播放',
        description: '暗色玻璃收成圆形：炭黑表面、遮罩边缘，以及旋转的锥形光晕。',
      },
      {
        id: 'plus',
        label: '添加',
        description: '琥珀渐变、4px 底座、柔光和外凸按压态，中心为加号。',
      },
      {
        id: 'mail',
        label: '邮件',
        description: '透明底、悬停蓝填充、四角圆点与依次展开的虚线框，中心为信封。',
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
  {
    id: 'fireworks-backdrop',
    name: '烟花背景',
    title: 'Fireworks Backdrop',
    category: '背景',
    description: '门户全屏烟花：全景绽放、落到下方仰视，再急旋拉近特写直至火花消失',
    lede: '背景 · 约 24 秒电影运镜：全景缓摇、落到烟花下方仰视立体绽放，再急速旋转拉近特写到消散。',
    tags: ['背景', '烟花', 'WebGL', 'Three.js', '门户'],
    path: '/component/fireworks-backdrop',
    importName: 'FireworksBackdrop',
    colorTune: true,
    variants: [
      {
        id: 'night',
        label: '夜空',
        description: '冷暖混色火花，适合常规门户首屏。',
      },
      {
        id: 'festival',
        label: '节庆',
        description: '红金绿白撞色，适合活动与节日页。',
      },
      {
        id: 'gold',
        label: '鎏金',
        description: '琥珀与金箔色，适合品牌开场。',
      },
    ],
    props: [
      { name: 'palette', type: "'night' | 'festival' | 'gold'", default: "'night'", description: '烟花配色' },
      { name: 'variant', type: "'night' | 'festival' | 'gold'", default: '-', description: '与 palette 等价' },
      { name: 'mode', type: "'dark' | 'light'", default: "'dark'", description: '夜空 / 暮色天空' },
      { name: 'intensity', type: 'number', default: '1', description: '燃放密度，0.35 ~ 2' },
      { name: 'paused', type: 'boolean', default: 'false', description: '暂停镜头与粒子' },
      { name: 'hue', type: 'number', default: '0', description: '色相偏移（deg），-180 ~ 180' },
      { name: 'saturation', type: 'number', default: '1', description: '饱和度倍数，0 ~ 2' },
      { name: 'brightness', type: 'number', default: '1', description: '亮度倍数，0.35 ~ 1.65' },
    ],
    events: [],
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
