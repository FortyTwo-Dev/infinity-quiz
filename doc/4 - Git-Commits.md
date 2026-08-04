# Git Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages to maintain a clean and readable git history.

---

## Commit Message Format

```
type(scope?): description

[optional body]

[optional footer]
```

- **type**: Required. The type of change being made.
- **scope**: Optional. The part of the codebase affected (in parentheses).
- **description**: Required. A brief, imperative description of the change.
- **body**: Optional. More detailed explanation.
- **footer**: Optional. References to issues, breaking changes, etc.

---

## Commit Types

| Type | Description | When to Use |
|------|-------------|-------------|
| `feat` | A new feature | Adding new functionality to the application |
| `fix` | A bug fix | Patching a bug in the codebase |
| `docs` | Documentation only changes | Updating documentation files |
| `style` | Code style changes | Formatting, missing semicolons, etc. (no functional changes) |
| `refactor` | Code refactoring | Restructuring code without changing functionality |
| `perf` | Performance improvements | Optimizing code for better performance |
| `test` | Adding or modifying tests | Adding new tests, updating existing tests |
| `build` | Build system or external dependencies | Changes to build configuration, dependencies |
| `ci` | CI/CD configuration | Changes to CI pipeline, workflows |
| `chore` | Maintenance tasks | Repository maintenance, configuration changes |
| `revert` | Revert a previous commit | When rolling back a commit |

---

## Scope

The scope should describe the part of the codebase affected by the change. Use lowercase and hyphen-separated names.

| Scope | Description |
|-------|-------------|
| `quiz` | Quiz-related functionality |
| `question` | Question-related functionality |
| `store` | Pinia stores |
| `router` | Vue Router configuration |
| `ui` | User interface components |
| `api` | API-related changes (future) |
| `types` | TypeScript type definitions |
| `utils` | Utility functions |
| `components` | Vue components |
| `composables` | Vue composables |
| `style` | Styling/CSS changes |
| `test` | Test-related changes |
| `docs` | Documentation |
| `config` | Configuration files |

---

## Examples

### Simple commit
```
feat: add quiz selection screen
```

### Commit with scope
```
feat(quiz): implement question shuffling
```

```
fix(store): correct score calculation in quiz store
```

```
refactor(components): extract QuestionCard component
```

```
docs: update README with project description
```

### Commit with body
```
feat(timer): add countdown timer for quizzes

- Add useTimer composable
- Integrate timer in QuizView
- Display remaining time to user
```

### Commit with footer
```
fix(question): prevent duplicate answer selection

Fixes issue where user could select multiple answers

Closes #123
```

### Breaking change
```
refactor(store): migrate quiz state structure

BREAKING CHANGE: Quiz state now uses new format with nested questions
```

---

## Rules

1. **Use imperative mood**: "add feature" not "added feature" or "adding feature"
2. **First letter lowercase**: `feat: add...` not `Feat: Add...`
3. **No period at the end**: `feat: add quiz` not `feat: add quiz.`
4. **Keep subject line under 50 characters** (50-72 for scope + type)
5. **Wrap body at 72 characters**
6. **Separate subject from body with a blank line**
7. **Use the body to explain what and why, not how**

---

## Why Conventional Commits?

- **Readability**: Clear history of what changes were made
- **Automation**: Enables automatic changelog generation
- **Semantic Versioning**: Can be used for automated version bumps
- **Tooling**: Better integration with CI/CD pipelines
- **Collaboration**: Team members understand the purpose of each commit

---

## Tools

You can use [commitizen](https://commitizen.github.io/cz-cli/) for interactive commit message creation:

```bash
# Install globally
npm install -g commitizen

# Or use npx
npx commitizen
```

Or use [Commit Message Editor](https://marketplace.visualstudio.com/items?itemName=adam-barr.vscode-commitizen) VS Code extension.

---

## Checking Commit Messages

You can validate your commit messages against Conventional Commits using [commitlint](https://commitlint.js.org/):

```bash
npx commitlint --edit
```

---

## Common Patterns

| Change | Commit Message |
|--------|----------------|
| Add new quiz feature | `feat(quiz): add new quiz creation form` |
| Fix scoring bug | `fix(store): correct final score calculation` |
| Update docs | `docs: add architecture documentation` |
| Refactor component | `refactor(components): split QuestionItem into smaller components` |
| Update dependencies | `chore: update Vue to 3.5.40` |
| Add tests | `test(quiz): add unit tests for quiz store` |
| Format code | `style: apply Prettier formatting` |
| Update build config | `build: configure Vite for production` |
