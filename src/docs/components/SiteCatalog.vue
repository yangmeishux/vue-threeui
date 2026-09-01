<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleButtons, FireworksBackdrop } from '@/components'
import { components, getAllCategories } from '@/data/components'
import type { ComponentMeta } from '@/data/components'

const searchQuery = ref('')
const selectedFilter = ref('')
const sortMode = ref<'popular' | 'recent'>('popular')

const categories = getAllCategories()
const allTags = computed(() => [...new Set(components.flatMap((item) => item.tags))])
const pills = computed(() => ['', ...new Set([...categories, ...allTags.value])])

const filteredComponents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const list = components.filter((component) => {
    const hay = [component.name, component.title, component.description, component.category, ...component.tags]
      .join(' ')
      .toLowerCase()
    const matchesSearch = !query || hay.includes(query)
    const filter = selectedFilter.value
    const matchesFilter =
      !filter ||
      component.category === filter ||
      component.tags.includes(filter)
    return matchesSearch && matchesFilter
  })
  if (sortMode.value === 'recent') {
    return [...list].reverse()
  }
  return list
})

function pillLabel(value: string) {
  return value === '' ? '全部' : value
}

function previewVariants(component: ComponentMeta) {
  if (component.id === 'circle-buttons') {
    return [
      { variant: 'play' as const, label: 'Play' },
      { variant: 'plus' as const, label: 'Plus' },
      { variant: 'mail' as const, label: 'Mail' },
    ]
  }
  return []
}
</script>

<template>
  <div class="catalog">
    <header class="catalog-hero">
      <h1>Vue 3 组件、模板与交互着色器</h1>
      <p>
        可复制的 Vue 组件、WebGL 背景、首屏区块与界面动效。每个组件都带实时预览、调用示例和 Skill.md。
      </p>
    </header>

    <div class="catalog-toolbar">
      <div class="pills" role="list">
        <button
          v-for="pill in pills"
          :key="pill || 'all'"
          type="button"
          class="pill"
          :class="{ 'is-active': selectedFilter === pill }"
          @click="selectedFilter = pill"
        >
          {{ pillLabel(pill) }}
        </button>
      </div>

      <div class="toolbar-row">
        <label class="search">
          <span class="search__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.6" stroke="currentColor" stroke-width="1.2" />
              <path d="M10.4 10.4 14 14" stroke="currentColor" stroke-width="1.2" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="`搜索 ${components.length} 个组件`"
          />
        </label>

        <div class="segment" role="group" aria-label="排序">
          <button type="button" :class="{ 'is-active': sortMode === 'popular' }" @click="sortMode = 'popular'">
            热门
          </button>
          <button type="button" :class="{ 'is-active': sortMode === 'recent' }" @click="sortMode = 'recent'">
            最新
          </button>
        </div>
      </div>
    </div>

    <div class="grid">
      <article v-for="component in filteredComponents" :key="component.id" class="card">
        <router-link :to="component.path" class="card__link">
          <div class="card__preview" aria-hidden="true" inert>
            <div v-if="previewVariants(component).length" class="card__stage">
              <CircleButtons
                v-for="item in previewVariants(component)"
                :key="item.variant"
                :variant="item.variant"
                mode="dark"
              />
            </div>
            <div v-else-if="component.id === 'fireworks-backdrop'" class="card__stage card__stage--fill">
              <FireworksBackdrop palette="night" :intensity="0.85" />
            </div>
            <div v-else class="card__empty">暂无预览</div>
          </div>
          <div class="card__meta">
            <div class="card__title-row">
              <h2>
                {{ component.name }}
                <span class="card__en">{{ component.title }}</span>
              </h2>
            </div>
            <p>{{ component.description }}</p>
            <div class="card__tags">
              <span v-for="tag in component.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </router-link>
      </article>
    </div>

    <p v-if="filteredComponents.length === 0" class="empty">没有找到匹配的组件</p>
  </div>
</template>

<style scoped>
.catalog {
  max-width: 1280px;
  margin: 0 auto;
  padding: 36px 20px 80px;
}

.catalog-hero {
  max-width: 720px;
  margin-bottom: 28px;
}

.catalog-hero h1 {
  font-size: clamp(22px, 2.4vw, 28px);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.catalog-hero p {
  margin-top: 12px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.pill {
  padding: 6px 12px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.pill:hover,
.pill.is-active {
  color: var(--text);
  border-color: var(--text);
  background: var(--chip);
}

.toolbar-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 28px;
}

.search {
  position: relative;
  flex: 1;
}

.search__icon {
  position: absolute;
  top: 50%;
  left: 12px;
  width: 14px;
  height: 14px;
  color: var(--faint);
  transform: translateY(-50%);
}

.search__icon svg {
  display: block;
  width: 14px;
  height: 14px;
}

.search input {
  width: 100%;
  height: 40px;
  padding: 0 14px 0 34px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--bg-raised);
  color: var(--text);
  font-size: 12px;
  outline: none;
}

.search input::placeholder {
  color: var(--faint);
}

.search input:focus {
  border-color: var(--text);
}

.segment {
  display: flex;
  flex-shrink: 0;
  padding: 3px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--bg-raised);
}

.segment button {
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.segment button.is-active {
  background: var(--text);
  color: var(--bg);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px 20px;
}

.card__link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card__preview {
  height: 280px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #07080a;
}

.card__stage {
  display: flex;
  height: 100%;
}

.card__stage :deep(.circle-buttons) {
  flex: 1;
  width: auto;
  min-width: 0;
  height: 100%;
  min-height: 100%;
}

.card__stage :deep(.circle-button) {
  pointer-events: none;
}

.card__stage--fill :deep(.fireworks-backdrop) {
  width: 100%;
  height: 100%;
  min-height: 100%;
}

.card__empty {
  display: grid;
  height: 100%;
  place-items: center;
  color: var(--faint);
  font-size: 12px;
}

.card__meta {
  padding: 14px 2px 0;
}

.card__title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.card__meta h2 {
  font-size: 14px;
  font-weight: 500;
}

.card__en {
  margin-left: 8px;
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
}

.card__id {
  color: var(--faint);
  font-size: 11px;
}

.card__meta p {
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.55;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.card__tags span {
  padding: 3px 8px;
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  color: var(--muted);
  font-size: 11px;
}

.card:hover .card__preview {
  border-color: var(--line-strong);
}

.empty {
  padding: 48px 0;
  color: var(--faint);
  font-size: 13px;
}

@media (max-width: 720px) {
  .toolbar-row {
    flex-direction: column;
    align-items: stretch;
  }

  .segment {
    align-self: flex-start;
  }

  .card__preview {
    height: 220px;
  }
}
</style>
