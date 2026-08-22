<template>
  <div class="page">
    <aside class="side-nav">
      <RouterLink to="/catalogs/sections">Section</RouterLink>
      <RouterLink to="/catalogs/rules">Rule</RouterLink>
      <RouterLink to="/catalogs/tags">Tag</RouterLink>
    </aside>
    <section class="pane">
      <RouterView />
    </section>
  </div>
</template>
