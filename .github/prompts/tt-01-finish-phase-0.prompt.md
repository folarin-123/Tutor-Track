---
description: Task 1 - finish Phase 0 (one clean, credible codebase). No behaviour change.
agent: agent
---

Task 1: finish Phase 0 of the TutorTrack roadmap.

Read first: #file:docs/CURRENT_STATE.md and PRD §18 (Phase 0), §6.3 (D4, D6, D7, D9, D11), §11.5, §17.2, §19. Search the PRD by heading; do not load all of it.

Start by creating branch `task/01-phase-0`, then post your plan and wait for "go".

**No behaviour change.** Do not add features, change visuals, touch auth or the data layer, or bump major dependency versions.

## Checkpoints

**CP1: line endings and tooling baseline.**
The repo files use CRLF. Add `.gitattributes` (`* text=auto`) and `.editorconfig`. Do NOT do a repo-wide line-ending rewrite; it would bury every later diff.

**CP2: restructure with `git mv` to preserve history (PRD §11.5).**
- Move `app/`, `components/`, `lib/` into `src/` (`src/app`, `src/components`, `src/lib`, `src/styles/globals.css`), merging with the existing `src/lib`.
- Change the `@` alias to `./src` in `vite.config.mjs` and `jsconfig.json`. Rewrite imports (for example `@/src/lib/api` becomes `@/lib/api`).
- Rename `page.jsx` files to descriptive names: `src/app/routes/{Landing,SignIn,SignUp}Page.jsx` and `src/app/dashboards/{Tutor,Student,Parent}Dashboard.jsx`.
- Extract `App` from `main.jsx` into `src/app/App.jsx`. Make `App.test.jsx` import the real `App` instead of duplicating the route tree.
- Run `npm run test` and `npm run build`; both must pass before committing.

**CP3: remove Next/Vercel boilerplate.**
After grepping to prove nothing references them, delete the `public/*.svg` templates and the `.next/**` ESLint ignore. Move `favicon.ico` to `public/` and link it from `index.html`.

**CP4: a real lint setup.**
ESLint 9 flat config with `@eslint/js` recommended, `eslint-plugin-react`, `react-hooks`, `jsx-a11y`, browser and Vitest globals. Add Prettier (`format`, `format:check`; set `endOfLine: "auto"`) and Husky + lint-staged. Fix every finding, or justify it with an inline disable and a reason. Zero warnings.

**CP5: tests.**
Unit tests for `formatters` (kobo to naira, date-only strings, Lagos timezone edges). Add `@vitest/coverage-v8` and a `test:coverage` script. Target at least 80% on pure `src/lib` code.

**CP6: small correctness fix.**
`AddSessionModal` resolves the student by display name. Select by student `id` instead.

**CP7: housekeeping.**
`LICENSE` (MIT, and tell me you chose it), `.env.example` documenting every `VITE_*` variable in use (mark the Firebase ones as deprecated), `.github/dependabot.yml`.

**CP8: docs.**
- Rewrite `README.md`: accurate status, screenshot placeholder, live-demo placeholder, CI badge, current-versus-target stack table (PRD §11.2), scripts, link to `docs/`, "Known limitations" drawn from PRD §6.2.
- Create `docs/adr/0001` to `0008` (one short file per ADR in PRD §11.3) and `docs/KNOWN_LIMITATIONS.md`.
- Update `docs/CURRENT_STATE.md`.

**CP9: CI.**
Extend `.github/workflows/ci.yml` with format check, coverage, `npm audit --audit-level=high`, a gitleaks secret scan, and a bundle-size report (report-only).

## Acceptance
One canonical structure with no Next.js remnants. `npm run lint`, `format:check`, `test`, `build` all green. Give me a manual smoke checklist (every route and dashboard tab) to tick off in the browser.
