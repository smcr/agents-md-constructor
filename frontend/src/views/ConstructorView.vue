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
        <span class="rule-body">
          <span class="rule-title">{{ item.rule }}</span>
          <span v-if="ruleDescription(item)" class="rule-desc">{{ ruleDescription(item) }}</span>
        </span>
      </label>
      <p v-if="selectedSectionId && visibleRules.length === 0" class="muted">
        Нет approved Rule
      </p>
    </section>
    <div class="float-bar">
      <button class="primary float-show" type="button" @click="openPreview">Показать</button>
      <div class="propose-wrap">
        <button class="primary propose-plus" type="button" @click="proposeMenuOpen = !proposeMenuOpen">
          +
        </button>
        <div v-if="proposeMenuOpen" class="propose-menu">
          <button class="ghost" type="button" @click="openSectionPropose">предложить раздел</button>
          <button class="ghost" type="button" @click="openRulePropose">предложить правило</button>
        </div>
      </div>
    </div>
    <div v-if="showPreview" class="popup-backdrop" @click.self="showPreview = false">
      <div class="popup">
        <div class="row">
          <strong>AGENTS.md</strong>
          <button class="ghost" type="button" @click="showPreview = false">Закрыть</button>
        </div>
        <textarea :value="previewText" readonly />
      </div>
    </div>
    <div v-if="showSectionPropose" class="popup-backdrop" @click.self="closeSectionPropose">
      <div class="popup form-popup" @click.stop>
        <div class="row">
          <strong>Предложить раздел</strong>
          <button class="ghost" type="button" @click="closeSectionPropose">Закрыть</button>
        </div>
        <p v-if="proposeError" class="error">{{ proposeError }}</p>
        <form class="form" @submit.prevent="saveSectionPropose">
          <label>Title <input v-model="sectionForm.title" required /></label>
          <label>Description <textarea v-model="sectionForm.description" rows="4" /></label>
          <div class="tags">
            <label v-for="tag in approvedTags" :key="tag.id" class="checkbox">
              <input
                type="checkbox"
                :checked="sectionForm.tag_ids.includes(tag.id)"
                @change="toggleProposeTag(sectionForm.tag_ids, tag.id, ($event.target as HTMLInputElement).checked)"
              />
              {{ tag.title }}
            </label>
            <p v-if="approvedTags.length === 0" class="muted">Нет approved Tag</p>
          </div>
          <button class="primary" type="submit">Сохранить</button>
        </form>
      </div>
    </div>
    <div v-if="showRulePropose" class="popup-backdrop" @click.self="closeRulePropose">
      <div class="popup form-popup" @click.stop>
        <div class="row">
          <strong>Предложить правило</strong>
          <button class="ghost" type="button" @click="closeRulePropose">Закрыть</button>
        </div>
        <p v-if="proposeError" class="error">{{ proposeError }}</p>
        <form class="form" @submit.prevent="saveRulePropose">
          <label>
            Section
            <select v-model.number="ruleForm.section_id" required>
              <option disabled :value="0">Выберите Section</option>
              <option v-for="section in allApprovedSections" :key="section.id" :value="section.id">
                {{ section.title }}
              </option>
            </select>
          </label>
          <label>Rule <textarea v-model="ruleForm.rule" rows="3" required /></label>
          <label>Checks <textarea v-model="ruleForm.checks" rows="3" /></label>
          <label>Description <textarea v-model="ruleForm.description" rows="3" /></label>
          <div class="tags">
            <label v-for="tag in approvedTags" :key="tag.id" class="checkbox">
              <input
                type="checkbox"
                :checked="ruleForm.tag_ids.includes(tag.id)"
                @change="toggleProposeTag(ruleForm.tag_ids, tag.id, ($event.target as HTMLInputElement).checked)"
              />
              {{ tag.title }}
            </label>
            <p v-if="approvedTags.length === 0" class="muted">Нет approved Tag</p>
          </div>
          <button class="primary" type="submit">Сохранить</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
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
const proposeMenuOpen = ref(false);
const showSectionPropose = ref(false);
const showRulePropose = ref(false);
const proposeError = ref("");
const error = ref("");
const sectionForm = reactive({ title: "", description: "", tag_ids: [] as number[] });
const ruleForm = reactive({
  section_id: 0,
  rule: "",
  checks: "",
  description: "",
  tag_ids: [] as number[],
});

function isApproved(value: unknown): boolean {
  return value === true || value === 1 || value === "true";
}

function ruleDescription(item: Rule): string {
  return (item.description ?? "").trim();
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

function toggleProposeTag(tagIds: number[], tagId: number, checked: boolean) {
  const index = tagIds.indexOf(tagId);
  if (checked && index < 0) {
    tagIds.push(tagId);
  } else if (!checked && index >= 0) {
    tagIds.splice(index, 1);
  }
}

function openSectionPropose() {
  proposeMenuOpen.value = false;
  proposeError.value = "";
  sectionForm.title = "";
  sectionForm.description = "";
  sectionForm.tag_ids = [];
  showSectionPropose.value = true;
}

function closeSectionPropose() {
  showSectionPropose.value = false;
  proposeError.value = "";
}

function openRulePropose() {
  proposeMenuOpen.value = false;
  proposeError.value = "";
  ruleForm.section_id = selectedSectionId.value ?? allApprovedSections.value[0]?.id ?? 0;
  ruleForm.rule = "";
  ruleForm.checks = "";
  ruleForm.description = "";
  ruleForm.tag_ids = [];
  showRulePropose.value = true;
}

function closeRulePropose() {
  showRulePropose.value = false;
  proposeError.value = "";
}

async function saveSectionPropose() {
  proposeError.value = "";
  try {
    await api.sections.propose({
      title: sectionForm.title,
      description: sectionForm.description || null,
      tag_ids: sectionForm.tag_ids,
    });
    closeSectionPropose();
  } catch (err) {
    proposeError.value = err instanceof Error ? err.message : String(err);
  }
}

async function saveRulePropose() {
  proposeError.value = "";
  try {
    await api.rules.propose({
      section_id: ruleForm.section_id,
      rule: ruleForm.rule,
      checks: ruleForm.checks || null,
      description: ruleForm.description || null,
      tag_ids: ruleForm.tag_ids,
    });
    closeRulePropose();
  } catch (err) {
    proposeError.value = err instanceof Error ? err.message : String(err);
  }
}

watch(visibleSections, syncSelectedSection);

onMounted(load);
</script>
