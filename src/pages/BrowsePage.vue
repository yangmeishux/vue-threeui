<script setup lang="ts">
import { ref, computed } from 'vue'
import { components, getAllCategories } from '../data/components'
import type { ComponentMeta } from '../data/components'

const searchQuery = ref('')
const selectedCategory = ref<string>('')

const categories = getAllCategories()

const filteredComponents = computed(() => {
  return components.filter((component) => {
    const matchesSearch =
      searchQuery.value === '' ||
      component.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      component.tags.some((tag) => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesCategory = selectedCategory.value === '' || component.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <div class="browse-page">
    <header class="page-header">
      <h1>组件库</h1>
      <p class="subtitle">基于 Vue 3 和 Three.js 的组件集合</p>
    </header>

    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索组件..."
          class="search-input"
        />
      </div>
      <div class="category-filter">
        <select v-model="selectedCategory" class="category-select">
          <option value="">全部分类</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <div class="components-grid">
      <div v-for="component in filteredComponents" :key="component.id" class="component-card">
        <router-link :to="component.path" class="card-link">
          <div class="card-preview">
            <div class="preview-placeholder">预览</div>
          </div>
          <div class="card-content">
            <h3>{{ component.name }}</h3>
            <p>{{ component.description }}</p>
            <div class="card-tags">
              <span v-for="tag in component.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="filteredComponents.length === 0" class="empty-state">
      <p>没有找到匹配的组件</p>
    </div>
  </div>
</template>

<style scoped>
.browse-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #42b883;
}

.category-filter {
  min-width: 200px;
}

.category-select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.component-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.component-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card-preview {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  color: white;
  font-size: 1.5rem;
  opacity: 0.8;
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card-content p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #555;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
  font-size: 1.2rem;
}
</style>
