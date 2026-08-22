## 1. Preview assembly

- [x] 1.1 Emit Section title then description with no blank line; omit empty descriptions
- [x] 1.2 Prefix each Rule with ` - `, put description on the next line with no blank line, and separate Rules with one blank line
- [x] 1.3 Join consecutive Section blocks with exactly two blank lines and no leading blanks before the first
- [x] 1.4 After the last Rule, emit one shared `## Чек-лист для проверки` (two blank lines before it), aggregate all non-empty checks with no blank lines between them, omit the block when empty, and never emit `Checks:`

## 2. Smoke coverage

- [x] 2.1 Update `frontend/scripts/smoke-preview.ts` for the new heading, prefixes, and spacing
- [x] 2.2 Run the preview smoke script and confirm it passes
