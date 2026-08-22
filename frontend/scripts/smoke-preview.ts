import { assemblePreview } from "../src/preview.ts";

const CHECKLIST = "## Чек-лист для проверки";

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

function headingCount(text: string, heading: string): number {
  return text.split(heading).length - 1;
}

const empty = assemblePreview(sections, rules, []);
if (empty !== "") {
  throw new Error("empty selection must produce empty preview");
}

const preview = assemblePreview(sections, rules, [20, 10]);
if (preview.startsWith("\n")) {
  throw new Error("first section must not be preceded by blank lines");
}
if (!preview.includes("Desc one") || !preview.includes("Desc two")) {
  throw new Error("selected sections must include descriptions");
}
if (!preview.includes(" - Rule A") || !preview.includes(" - Rule B")) {
  throw new Error("selected rules from multiple sections must appear with prefix");
}
if (preview.includes("Should be skipped") || preview.includes("Rule C")) {
  throw new Error("sections without selected rules must be omitted");
}
if (preview.indexOf("Desc one") > preview.indexOf("Desc two")) {
  throw new Error("section order must follow left-pane order");
}
if (preview.includes("## One\n\nDesc one") || preview.includes(" - Rule A\n\nNote A")) {
  throw new Error("title and description must not be separated by a blank line");
}
if (!preview.includes("## One\nDesc one") || !preview.includes(" - Rule A\nNote A")) {
  throw new Error("title must be followed immediately by description");
}
if (!preview.includes("Desc one\n\n - Rule A")) {
  throw new Error("section description must be followed by one blank line");
}
if (!preview.includes("Note A\n\n\n## Two")) {
  throw new Error("consecutive sections must be separated by exactly two blank lines");
}
if (headingCount(preview, CHECKLIST) !== 1) {
  throw new Error("preview must contain exactly one shared checklist heading");
}
if (preview.includes("Checks:")) {
  throw new Error("preview must not contain Checks:");
}
if (!preview.includes(" - Rule B\n\n\n## Чек-лист для проверки\nCheck A\nCheck B")) {
  throw new Error("shared checklist must follow the last rule by two blank lines and join checks without blanks");
}

const aggregated = assemblePreview(
  sections,
  [
    { id: 10, section_id: 1, rule: "Rule A", checks: "Check A", description: "Note A", counter: 0, approved: true, tag_ids: [] },
    { id: 11, section_id: 1, rule: "Rule E", checks: "Check E", description: null, counter: 0, approved: true, tag_ids: [] },
  ],
  [10, 11],
);
if (headingCount(aggregated, CHECKLIST) !== 1) {
  throw new Error("one preview must emit a single shared checklist heading");
}
if (!aggregated.includes(" - Rule A\nNote A\n\n - Rule E")) {
  throw new Error("rules in one section must be separated by exactly one blank line");
}
if (!aggregated.includes("Check A") || !aggregated.includes("Check E")) {
  throw new Error("aggregated checklist must include every non-empty checks value");
}
if (aggregated.indexOf("Check A") > aggregated.indexOf("Check E")) {
  throw new Error("aggregated checks must follow rule order");
}
if (aggregated.includes("Check A\n\nCheck E")) {
  throw new Error("checks must not be separated by a blank line");
}
if (aggregated.indexOf(CHECKLIST) < aggregated.indexOf(" - Rule E")) {
  throw new Error("checklist must appear after the last rule");
}

const withoutChecks = assemblePreview(
  sections,
  [{ id: 40, section_id: 1, rule: "Rule D", checks: null, description: null, counter: 0, approved: true, tag_ids: [] }],
  [40],
);
if (withoutChecks.includes(CHECKLIST) || withoutChecks.includes("Checks:")) {
  throw new Error("empty checks must omit the checklist heading");
}

const whitespaceChecks = assemblePreview(
  sections,
  [{ id: 41, section_id: 1, rule: "Rule F", checks: "   ", description: null, counter: 0, approved: true, tag_ids: [] }],
  [41],
);
if (whitespaceChecks.includes(CHECKLIST) || whitespaceChecks.includes("Checks:")) {
  throw new Error("whitespace-only checks must omit the checklist heading");
}

const emptyDescriptions = assemblePreview(
  [{ ...sections[0], description: "   " }],
  [{ id: 42, section_id: 1, rule: "Rule G", checks: null, description: "", counter: 0, approved: true, tag_ids: [] }],
  [42],
);
if (emptyDescriptions.includes("Desc one")) {
  throw new Error("empty section description must be omitted");
}
if (!emptyDescriptions.includes("## One\n\n - Rule G")) {
  throw new Error("title without description must be followed by one blank line then the first rule");
}

console.log("preview smoke ok");
