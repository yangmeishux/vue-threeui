<template>
  <div class="home-page">
    <header class="hero">
      <h1>Vue ThreeUI</h1>
      <p class="tagline">基于 Vue 3 和 Three.js 的现代组件库</p>
      <div class="hero-actions">
        <router-link to="/browse" class="btn btn-primary">浏览组件</router-link>
        <a href="https://github.com/yourusername/vue-threeui" class="btn btn-secondary">GitHub</a>
      </div>
    </header>

    <section class="features">
      <div class="feature">
        <div class="feature-icon">🎨</div>
        <h3>精美设计</h3>
        <p>每个组件都经过精心设计，提供流畅的交互体验和视觉效果</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Vue 3 驱动</h3>
        <p>基于 Vue 3 Composition API，完美支持 TypeScript</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🚀</div>
        <h3>Three.js 集成</h3>
        <p>集成 Three.js 3D 效果，让你的界面更加生动</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📦</div>
        <h3>按需引入</h3>
        <p>支持 Tree Shaking，只打包你使用的组件</p>
      </div>
    </section>

    <section class="quick-start">
      <h2>快速开始</h2>
      <div class="code-block">
        <pre><code>npm install vue-threeui</code></pre>
      </div>
      <div class="code-block">
        <pre><code>&lt;script setup lang="ts"&gt;
import { CircleButtons } from 'vue-threeui'
&lt;/script&gt;

&lt;template&gt;
  &lt;CircleButtons variant="play" mode="dark" /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 4rem;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

.quick-start {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-start h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>
