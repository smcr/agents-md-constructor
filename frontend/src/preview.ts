import type { Rule, Section } from "./api";

function isNonEmptyChecks(value: string | null | undefined): value is string {
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
  for (const section of sections) {
    const sectionRules = rules.filter(
      (rule) => rule.section_id === section.id && selected.has(rule.id),
    );
    if (sectionRules.length === 0) {
      continue;
    }
    const lines: string[] = [`## ${section.title}`, ""];
    if (section.description) {
      lines.push(section.description, "");
    }
    for (const rule of sectionRules) {
      lines.push(rule.rule, "");
      if (rule.description) {
        lines.push(rule.description, "");
      }
    }
    const checks = sectionRules
      .map((rule) => rule.checks)
      .filter(isNonEmptyChecks)
      .map((value) => value.trim());
    if (checks.length > 0) {
      lines.push("Checks:", checks.join("\n\n"), "");
    }
    blocks.push(lines.join("\n").trimEnd());
  }
  return blocks.join("\n\n");
}
