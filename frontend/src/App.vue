<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">AGENTS.md constructor</div>
      <nav>
        <RouterLink to="/catalogs">Справочники</RouterLink>
        <RouterLink to="/constructor">Конструктор</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
