<template>
  <div id="app">
    <nav class="main-nav">
      <div class="nav-content">
        <router-link to="/" class="logo">Vue ThreeUI</router-link>
        <div class="nav-links">
          <router-link to="/browse">组件</router-link>
          <a href="https://github.com/yourusername/vue-threeui" target="_blank">GitHub</a>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App 根组件
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

.main-nav {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #42b883;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #42b883;
}

.main-content {
  min-height: calc(100vh - 80px);
}
</style>
