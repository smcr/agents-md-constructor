import type { Rule, Section, Tag } from "@prisma/client";

type SectionWithTags = Section & { tagSections: { tag_id: number }[] };
type RuleWithTags = Rule & { tagRules: { tag_id: number }[] };

export function sectionJson(section: SectionWithTags) {
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    counter: section.counter,
    approved: section.approved,
    tag_ids: section.tagSections.map((row) => row.tag_id),
  };
}

export function ruleJson(rule: RuleWithTags) {
  return {
    id: rule.id,
    section_id: rule.section_id,
    description: rule.description,
    rule: rule.rule,
    checks: rule.checks,
    counter: rule.counter,
    approved: rule.approved,
    tag_ids: rule.tagRules.map((row) => row.tag_id),
  };
}

export function tagJson(tag: Tag) {
  return {
    id: tag.id,
    title: tag.title,
    approved: tag.approved,
  };
}

export const sectionInclude = { tagSections: true } as const;
export const ruleInclude = { tagRules: true } as const;
