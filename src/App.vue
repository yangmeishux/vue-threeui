<template>
  <div id="app">
    <header class="site-header">
      <div class="site-header__inner">
        <nav class="site-nav site-nav--left" aria-label="主导航">
          <router-link to="/browse">Browse</router-link>
        </nav>

        <router-link to="/" class="brand" aria-label="vue-threeui home">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9.2" stroke="currentColor" stroke-width="1.2" />
              <circle cx="12" cy="12" r="4.4" stroke="currentColor" stroke-width="1.2" />
              <path d="M12 2.8v4.2M12 17v4.2M2.8 12h4.2M17 12h4.2" stroke="currentColor" stroke-width="1.2" />
            </svg>
          </span>
          <span class="brand__name">vue-threeui</span>
        </router-link>

        <nav class="site-nav site-nav--right" aria-label="外部链接">
          <a href="https://github.com/yourusername/vue-threeui" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
:root {
  --bg: #050608;
  --bg-raised: #0a0b0d;
  --line: rgba(247, 248, 248, 0.09);
  --line-strong: rgba(247, 248, 248, 0.16);
  --text: #f7f8f8;
  --muted: #8a8f98;
  --faint: #5c616a;
  --chip: rgba(247, 248, 248, 0.04);
  --header: 52px;
  --radius: 10px;
  --font: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  min-height: 100%;
}

html {
  scroll-padding-top: var(--header);
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a {
  color: inherit;
}

button,
input,
select {
  font-family: inherit;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  height: var(--header);
  background: rgba(5, 6, 8, 0.86);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(16px);
}

.site-header__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: center;
  text-decoration: none;
  color: var(--text);
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  color: var(--text);
}

.brand__mark svg {
  width: 18px;
  height: 18px;
}

.brand__name {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.site-nav--left {
  justify-self: start;
}

.site-nav--right {
  justify-self: end;
}

.site-nav a {
  font-size: 12px;
  color: var(--muted);
  text-decoration: none;
}

.site-nav a:hover,
.site-nav a.router-link-active {
  color: var(--text);
}

.site-main {
  min-height: calc(100vh - var(--header));
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
</style>
