import { ref } from "vue";

export const selectedRuleIds = ref<number[]>([]);
export const selectedTagIds = ref<number[]>([]);

export function isRuleSelected(id: number): boolean {
  return selectedRuleIds.value.includes(id);
}

export function setRuleSelected(id: number, checked: boolean): void {
  if (checked) {
    if (!selectedRuleIds.value.includes(id)) {
      selectedRuleIds.value.push(id);
    }
    return;
  }
  selectedRuleIds.value = selectedRuleIds.value.filter((item) => item !== id);
}

export function isTagSelected(id: number): boolean {
  return selectedTagIds.value.includes(id);
}

export function toggleTag(id: number): void {
  if (selectedTagIds.value.includes(id)) {
    selectedTagIds.value = selectedTagIds.value.filter((item) => item !== id);
    return;
  }
  selectedTagIds.value = [...selectedTagIds.value, id];
}
