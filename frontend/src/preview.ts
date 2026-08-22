import type { Rule, Section } from "./api";

function isNonEmptyText(value: string | null | undefined): value is string {
  return Boolean(value && value.trim());
}

export function assemblePreview(
  sections: Section[],
  rules: Rule[],
  selectedIds: number[],
): string {
  if (selectedIds.length === 0) {
    return "";
  }
  const selected = new Set(selectedIds);
  const blocks: string[] = [];
  const checks: string[] = [];
  for (const section of sections) {
    const sectionRules = rules.filter(
      (rule) => rule.section_id === section.id && selected.has(rule.id),
    );
    if (sectionRules.length === 0) {
      continue;
    }
    const lines: string[] = [`## ${section.title}`];
    if (isNonEmptyText(section.description)) {
      lines.push(section.description.trim());
    }
    lines.push("");
    sectionRules.forEach((rule, index) => {
      if (index > 0) {
        lines.push("");
      }
      lines.push(` - ${rule.rule}`);
      if (isNonEmptyText(rule.description)) {
        lines.push(rule.description.trim());
      }
      if (isNonEmptyText(rule.checks)) {
        checks.push(rule.checks.trim());
      }
    });
    blocks.push(lines.join("\n").trimEnd());
  }
  let text = blocks.join("\n\n\n");
  if (checks.length > 0) {
    text += `\n\n\n## Чек-лист для проверки\n${checks.join("\n")}`;
  }
  return text;
}
