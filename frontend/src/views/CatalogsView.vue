<template>
  <div v-if="currentUser" class="page">
    <aside class="side-nav">
      <RouterLink to="/catalogs/sections">Section</RouterLink>
      <RouterLink to="/catalogs/rules">Rule</RouterLink>
      <RouterLink to="/catalogs/tags">Tag</RouterLink>
      <RouterLink to="/catalogs/users">Users</RouterLink>
    </aside>
    <section class="pane">
      <RouterView />
    </section>
  </div>
</template>

<script setup lang="ts">
import { currentUser } from "../authState";
</script>
