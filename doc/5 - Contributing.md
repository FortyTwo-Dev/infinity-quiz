# Contributing

## 🌿 Branch Strategy

### Main Branches

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code | ✅ Protected |
| `develop` | Integration branch for features | ✅ Protected |

### Feature Branches

- **Prefix:** `feat/`
- **Origin:** `develop`
- **Merge:** Into `develop` via PR
- **Example:** `feat/theme-system`, `feat/quiz-timer`

### Fix Branches

- **Prefix:** `fix/`
- **Origin:** `develop` ⚠️ **IMPORTANT**
- **Merge:** Into `develop` (then into `main` via release)
- **Example:** `fix/sonarqube`

### Release Branches

- **Prefix:** `release/`
- **Origin:** `develop`
- **Merge:** Into `main` and `develop`

### Hotfix Branches

- **Prefix:** `hotfix/`
- **Origin:** `main`
- **Merge:** Into `main` and `develop`

---

## 📋 Rules

### ✅ DO

- **Always create `fix/*` branches from `develop`**
- Use [Conventional Commits](4%20-%20Git-Commits.md) for commit messages
- Create a PR for every feature/fix
- Run tests before pushing
- Update documentation when changing behavior

### ❌ DON'T

- Create `fix/*` branches from `main` or feature branches
- Push directly to `main` or `develop`
- Merge without code review
- Forget to update CHANGELOG/version

---

## 🔧 Workflow Examples

### Adding a new feature

```bash
# Start from develop
git switch develop
git pull origin develop

# Create feature branch
git switch -c feat/my-feature

# Make changes, commit with conventional commits
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feat/my-feature
```

### Fixing a bug

```bash
# ⚠️ ALWAYS start from develop
git switch develop
git pull origin develop

# Create fix branch
git switch -c fix/my-fix

# Make changes, commit
git add .
git commit -m "fix: resolve issue"

# Push and create PR
git push origin fix/my-fix
```

### Merging a PR

1. Ensure all tests pass
2. Check SonarQube results
3. Get at least 1 approval
4. Merge using **Squash and Merge** or **Rebase and Merge**

---

## 🤖 Code Quality

- **Linting:** Run `bun run lint` before committing
- **Testing:** All tests must pass
- **SonarQube:** Fix all critical issues before merging
- **Type Safety:** No `any` types in new code
