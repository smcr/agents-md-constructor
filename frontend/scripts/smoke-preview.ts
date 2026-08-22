import { assemblePreview } from "../src/preview.ts";

const sections = [
  { id: 1, title: "One", description: "Desc one", counter: 0, approved: true, tag_ids: [] },
  { id: 2, title: "Two", description: "Desc two", counter: 0, approved: true, tag_ids: [] },
  { id: 3, title: "Three", description: "Should be skipped", counter: 0, approved: true, tag_ids: [] },
];

const rules = [
  { id: 10, section_id: 1, rule: "Rule A", checks: "Check A", description: "Note A", counter: 0, approved: true, tag_ids: [] },
  { id: 20, section_id: 2, rule: "Rule B", checks: "Check B", description: null, counter: 0, approved: true, tag_ids: [] },
  { id: 30, section_id: 3, rule: "Rule C", checks: "Check C", description: null, counter: 0, approved: true, tag_ids: [] },
];

function checksHeadingCount(text: string): number {
  return text.split("Checks:").length - 1;
}

const empty = assemblePreview(sections, rules, []);
if (empty !== "") {
  throw new Error("empty selection must produce empty preview");
}

const preview = assemblePreview(sections, rules, [20, 10]);
if (!preview.includes("Desc one") || !preview.includes("Desc two")) {
  throw new Error("selected sections must include descriptions");
}
if (!preview.includes("Rule A") || !preview.includes("Rule B")) {
  throw new Error("selected rules from multiple sections must appear");
}
if (preview.includes("Should be skipped") || preview.includes("Rule C")) {
  throw new Error("sections without selected rules must be omitted");
}
if (preview.indexOf("Desc one") > preview.indexOf("Desc two")) {
  throw new Error("section order must follow left-pane order");
}
if (checksHeadingCount(preview) !== 2) {
  throw new Error("each section with checks must have exactly one Checks heading");
}

const aggregated = assemblePreview(
  sections,
  [
    { id: 10, section_id: 1, rule: "Rule A", checks: "Check A", description: "Note A", counter: 0, approved: true, tag_ids: [] },
    { id: 11, section_id: 1, rule: "Rule E", checks: "Check E", description: null, counter: 0, approved: true, tag_ids: [] },
  ],
  [10, 11],
);
if (checksHeadingCount(aggregated) !== 1) {
  throw new Error("one section must emit a single aggregated Checks heading");
}
if (!aggregated.includes("Check A") || !aggregated.includes("Check E")) {
  throw new Error("aggregated Checks must include every non-empty checks value");
}
if (aggregated.indexOf("Check A") > aggregated.indexOf("Check E")) {
  throw new Error("aggregated Checks must follow rule order");
}
if (aggregated.indexOf("Checks:") < aggregated.indexOf("Rule E")) {
  throw new Error("Checks block must appear after the section's selected rules");
}

const withoutChecks = assemblePreview(
  sections,
  [{ id: 40, section_id: 1, rule: "Rule D", checks: null, description: null, counter: 0, approved: true, tag_ids: [] }],
  [40],
);
if (withoutChecks.includes("Checks:")) {
  throw new Error("empty checks must be omitted from preview");
}

const whitespaceChecks = assemblePreview(
  sections,
  [{ id: 41, section_id: 1, rule: "Rule F", checks: "   ", description: null, counter: 0, approved: true, tag_ids: [] }],
  [41],
);
if (whitespaceChecks.includes("Checks:")) {
  throw new Error("whitespace-only checks must be omitted from preview");
}

console.log("preview smoke ok");
