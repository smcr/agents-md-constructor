<template>
  <div class="page">
    <aside class="left-pane">
      <button
        v-for="section in visibleSections"
        :key="section.id"
        class="section-btn"
        :class="{ active: section.id === selectedSectionId }"
        type="button"
        @click="selectSection(section.id)"
      >
        {{ section.title }}
      </button>
      <p v-if="visibleSections.length === 0" class="muted">Нет approved Section</p>
    </aside>
    <section class="pane">
      <p v-if="error" class="error">{{ error }}</p>
      <div class="tag-bar">
        <button
          v-for="tag in approvedTags"
          :key="tag.id"
          class="tag-chip"
          :class="{ active: isTagSelected(tag.id) }"
          type="button"
          @click="toggleTag(tag.id)"
        >
          {{ tag.title }}
        </button>
        <p v-if="approvedTags.length === 0" class="muted">Нет approved Tag</p>
      </div>
      <p v-if="selectedTagIds.length > 0" class="muted tag-hint">
        Показаны только Section со всеми выбранными Tag; их Rule без этих Tag скрыты.
      </p>
      <p v-if="!selectedSectionId" class="muted">Выберите Section слева</p>
      <label v-for="item in visibleRules" :key="item.id" class="rule-item">
        <input
          type="checkbox"
          :checked="isRuleSelected(item.id)"
          @change="setRuleSelected(item.id, ($event.target as HTMLInputElement).checked)"
        />
        <span>{{ item.rule }}</span>
      </label>
      <p v-if="selectedSectionId && visibleRules.length === 0" class="muted">
        Нет approved Rule
      </p>
    </section>
    <button class="primary float-show" type="button" @click="openPreview">Показать</button>
    <div v-if="showPreview" class="popup-backdrop" @click.self="showPreview = false">
      <div class="popup">
        <div class="row">
          <strong>AGENTS.md</strong>
          <button class="ghost" type="button" @click="showPreview = false">Закрыть</button>
        </div>
        <textarea :value="previewText" readonly />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { api, type Rule, type Section, type Tag } from "../api";
import {
  isRuleSelected,
  isTagSelected,
  selectedRuleIds,
  selectedTagIds,
  setRuleSelected,
  toggleTag,
} from "../constructorState";
import { assemblePreview } from "../preview";

const sections = ref<Section[]>([]);
const rules = ref<Rule[]>([]);
const tags = ref<Tag[]>([]);
const selectedSectionId = ref<number | null>(null);
const showPreview = ref(false);
const error = ref("");

function isApproved(value: unknown): boolean {
  return value === true || value === 1 || value === "true";
}

function hasAllSelectedTags(tagIds: number[] | undefined): boolean {
  const selected = selectedTagIds.value;
  if (selected.length === 0) {
    return true;
  }
  const owned = new Set(tagIds ?? []);
  return selected.every((id) => owned.has(id));
}

const approvedTags = computed(() => tags.value.filter((tag) => isApproved(tag.approved)));

const allApprovedSections = computed(() =>
  sections.value.filter((section) => isApproved(section.approved)),
);

const visibleSections = computed(() =>
  allApprovedSections.value.filter((section) => hasAllSelectedTags(section.tag_ids)),
);

const visibleRules = computed(() => {
  if (selectedSectionId.value == null) {
    return [];
  }
  const sectionVisible = visibleSections.value.some(
    (section) => section.id === selectedSectionId.value,
  );
  if (!sectionVisible) {
    return [];
  }
  return rules.value.filter(
    (item) =>
      Number(item.section_id) === Number(selectedSectionId.value) &&
      isApproved(item.approved) &&
      hasAllSelectedTags(item.tag_ids),
  );
});

const previewText = computed(() =>
  assemblePreview(allApprovedSections.value, rules.value, selectedRuleIds.value),
);

function syncSelectedSection() {
  if (visibleSections.value.some((section) => section.id === selectedSectionId.value)) {
    return;
  }
  selectedSectionId.value = visibleSections.value[0]?.id ?? null;
}

async function load() {
  error.value = "";
  try {
    const [sectionRows, ruleRows, tagRows] = await Promise.all([
      api.sections.list(),
      api.rules.list(),
      api.tags.list(),
    ]);
    sections.value = Array.isArray(sectionRows) ? sectionRows : [];
    rules.value = Array.isArray(ruleRows) ? ruleRows : [];
    tags.value = Array.isArray(tagRows) ? tagRows : [];
    syncSelectedSection();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

function selectSection(id: number) {
  selectedSectionId.value = id;
}

async function openPreview() {
  error.value = "";
  const ids = [...selectedRuleIds.value];
  if (ids.length > 0) {
    const results = await Promise.allSettled(ids.map((id) => api.rules.increment(id)));
    const failures: string[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        const updated = result.value;
        const index = rules.value.findIndex((item) => item.id === updated.id);
        if (index >= 0) {
          rules.value[index] = updated;
        } else {
          rules.value.push(updated);
        }
      } else {
        failures.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
      }
    }
    if (failures.length > 0) {
      error.value = failures.join("; ");
    }
  }
  showPreview.value = true;
}

watch(visibleSections, syncSelectedSection);

onMounted(load);
</script>
