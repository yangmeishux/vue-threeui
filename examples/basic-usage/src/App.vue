<script setup lang="ts">
import { ref } from 'vue'
import { CircleButtons } from 'vue-threeui'

// 点击计数器
const clickCount = ref(0)

function handleClick() {
  clickCount.value++
  console.log(`按钮被点击了 ${clickCount.value} 次`)
}

// 主题切换
const isDarkMode = ref(true)

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <div :class="['app', { 'dark-theme': isDarkMode, 'light-theme': !isDarkMode }]">
    <header class="header">
      <h1>Vue ThreeUI 使用示例</h1>
      <button @click="toggleTheme" class="theme-toggle">
        {{ isDarkMode ? '☀️ 切换到浅色' : '🌙 切换到深色' }}
      </button>
    </header>

    <main class="main">
      <!-- 基础用法 -->
      <section class="section">
        <h2>1. 基础用法 - 三种风格</h2>
        <div class="demo-box">
          <div class="buttons">
            <CircleButtons variant="play" :mode="isDarkMode ? 'dark' : 'light'" />
            <CircleButtons variant="plus" :mode="isDarkMode ? 'dark' : 'light'" />
            <CircleButtons variant="mail" :mode="isDarkMode ? 'dark' : 'light'" />
          </div>
          <div class="code">
            <pre><code>&lt;CircleButtons variant="play" /&gt;
&lt;CircleButtons variant="plus" /&gt;
&lt;CircleButtons variant="mail" /&gt;</code></pre>
          </div>
        </div>
      </section>

      <!-- Props 配置 -->
      <section class="section">
        <h2>2. Props 配置</h2>
        <div class="demo-box">
          <div class="buttons">
            <CircleButtons 
              :size="60"
              :mode="isDarkMode ? 'dark' : 'light'"
            />
            <CircleButtons 
              :size="80"
              :mode="isDarkMode ? 'dark' : 'light'"
            />
            <CircleButtons 
              :size="100"
              :mode="isDarkMode ? 'dark' : 'light'"
            />
          </div>
          <div class="code">
            <pre><code>&lt;CircleButtons :size="60" /&gt;
&lt;CircleButtons :size="80" /&gt;
&lt;CircleButtons :size="100" /&gt;</code></pre>
          </div>
        </div>
      </section>

      <!-- 事件处理 -->
      <section class="section">
        <h2>3. 事件处理</h2>
        <div class="demo-box">
          <div class="buttons">
            <CircleButtons 
              :mode="isDarkMode ? 'dark' : 'light'"
              @click="handleClick"
            />
          </div>
          <p class="counter">点击次数: {{ clickCount }}</p>
          <div class="code">
            <pre><code>&lt;script setup&gt;
import { ref } from 'vue'
const clickCount = ref(0)

function handleClick() {
  clickCount.value++
}
&lt;/script&gt;

&lt;CircleButtons @click="handleClick" /&gt;</code></pre>
          </div>
        </div>
      </section>

      <!-- 禁用状态 -->
      <section class="section">
        <h2>4. 禁用状态</h2>
        <div class="demo-box">
          <div class="buttons">
            <CircleButtons 
              :disabled="true"
              :mode="isDarkMode ? 'dark' : 'light'"
            />
            <CircleButtons 
              :mode="isDarkMode ? 'dark' : 'light'"
            />
          </div>
          <div class="code">
            <pre><code>&lt;CircleButtons :disabled="true" /&gt;
&lt;CircleButtons /&gt;</code></pre>
          </div>
        </div>
      </section>

      <!-- 无障碍 -->
      <section class="section">
        <h2>5. 无障碍支持</h2>
        <div class="demo-box">
          <div class="buttons">
            <CircleButtons 
              aria-label="播放音乐"
              :mode="isDarkMode ? 'dark' : 'light'"
            />
          </div>
          <div class="code">
            <pre><code>&lt;CircleButtons aria-label="播放音乐" /&gt;</code></pre>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>查看完整文档: <a href="../../README.md" target="_blank">README.md</a></p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app {
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.dark-theme {
  background-color: #1a1a1a;
  color: #ffffff;
}

.light-theme {
  background-color: #f5f5f5;
  color: #333333;
}

.header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.header h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

.theme-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.dark-theme .theme-toggle {
  color: #ffffff;
}

.dark-theme .theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.light-theme .theme-toggle {
  color: #333333;
}

.light-theme .theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.demo-box {
  padding: 2rem;
  border: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 8px;
}

.dark-theme .demo-box {
  background-color: #2a2a2a;
}

.light-theme .demo-box {
  background-color: #ffffff;
}

.buttons {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.counter {
  text-align: center;
  margin: 1rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.code {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.dark-theme .code {
  background-color: #0d0d0d;
}

.light-theme .code {
  background-color: #f8f8f8;
}

.code pre {
  margin: 0;
}

.code code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.dark-theme .code code {
  color: #e0e0e0;
}

.light-theme .code code {
  color: #333333;
}

.footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

.footer a {
  color: #42b883;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .section h2 {
    font-size: 1.2rem;
  }

  .buttons {
    gap: 1rem;
  }
}
</style>
