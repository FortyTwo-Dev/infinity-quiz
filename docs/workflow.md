# Development Workflow

---

## Branches

Always start from the `develop` branch:
```bash
git switch develop
git pull origin develop
```

Then create a working branch:
```bash
git switch -c <branch_name>
```

### Branch Standards

| Branch | Role | Description | Merge to |
|--------|------|-------------|----------|
| `main` | Production | Stable, tested, deployable code. Merge only via approved PR. | - |
| `develop` | Integration | Base branch for all features. Always functional. | - |
| `feature/*` | New features | One branch per feature, created from `develop`. | `develop` |
| `fix/*` | Bug fixes | Non-critical fixes, created from `develop`. | `develop` |
| `hotfix/*` | Production emergencies | Urgent fixes from `main`, merged into `main` AND `develop`. | `main` + `develop` |
| `release/*` | Release | Release preparation from `develop`. | `main` + `develop` |

**Rule**: Never work directly on `main` or `develop`. Always use a working branch.

---

## Commit Conventions

Format:
```bash
git commit -m "type(scope): message"
```

### Commit Types

| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature | `feat(auth): add register endpoint` |
| `fix` | Bug fix | `fix(token): handle expired JWT correctly` |
| `refactor` | Refactoring | `refactor(middleware): simplify auth chain` |
| `test` | Test addition/modification | `test(login): add unit tests for handler` |
| `docs` | Documentation | `docs(readme): update setup instructions` |
| `chore` | Technical tasks | `chore(deps): update dependency` |
| `style` | Formatting/linting | `style(handlers): fix lint issues` |
| `ci` | CI/CD pipeline | `ci: add GitHub Actions workflow` |
| `perf` | Performance optimization | `perf(quiz): optimize question rendering` |

### Common Scopes

| Scope | Corresponds to |
|-------|---------------|
| `auth` | Authentication logic (login, logout) |
| `register` | User registration |
| `token` | JWT generation, validation, refresh |
| `middleware` | Guards, interceptors |
| `user` | User model and service |
| `quiz` | Quiz business logic |
| `store` | Pinia stores |
| `router` | Router configuration |
| `db` | Database connection, migrations |
| `config` | Environment variables, configuration |
| `ui` | UI components |
| `api` | API calls |

**Rule**: 1 commit = 1 thing. Commits must be atomic and coherent.

---

## Pull Requests

### When to create a PR

A PR must meet these requirements:
- Feature/fix is complete and tested locally
- All tests pass (`bun test --coverage`)
- Code is clean (lint, type-check, formatting)
- Code is commented if necessary
- Never with "WIP" or broken code

### PR Naming

Format:
```
#<plane-id> <branch_name>
```

Example: `#123 feat/quiz-timer`

### Merge Process

1. Verify all tests pass
2. Check SonarQube results (if applicable)
3. Get at least 1 approval
4. Merge using Squash and Merge or Rebase and Merge

---

## Code Review

### Checklist

- Functionality: Does the code correctly implement the feature/fix?
- Convention compliance: Does the code follow rules in `rules/`?
- Type safety: No `any`, proper typing everywhere
- Error handling: Are errors handled properly?
- Tests: Are there tests for new code? Is coverage sufficient?
- Performance: Any obvious bottlenecks?
- Documentation: Is documentation updated if needed?
- Security: Any obvious vulnerabilities (injections, XSS, etc.)?
- Accessibility: Are UI components accessible?

### Best Practices

- Review for substance, not form (lint handles form)
- Request clarifications if code is unclear
- Propose improvements with concrete arguments
- Don't block for personal preferences (unless it violates project rules)

---

## Workflow Examples

### Adding a new feature

```bash
# Start from develop
git switch develop
git pull origin develop

# Create feature branch
git switch -c feat/my-new-feature

# Make changes, commit with conventional commits
git add .
git commit -m "feat(quiz): add timer component"
git commit -m "test(quiz): add timer unit tests"

# Push and create PR
git push origin feat/my-new-feature
```

### Fixing a bug

```bash
# Always start from develop
git switch develop
git pull origin develop

# Create fix branch
git switch -c fix/bug-timer

# Make changes, commit
git add .
git commit -m "fix(timer): handle edge case with zero duration"

# Push and create PR
git push origin fix/bug-timer
```

### Hotfix for production

```bash
# Start from main (not develop!)
git switch main
git pull origin main

# Create hotfix branch
git switch -c hotfix/critical-auth-bug

# Make minimal changes, commit
git add .
git commit -m "fix(auth): patch JWT validation vulnerability"

# Push and create PR to main
git push origin hotfix/critical-auth-bug
# After merging to main, also merge into develop
git switch develop
git merge hotfix/critical-auth-bug
git push origin develop
```

---

## Code Quality

Run before pushing:
```bash
bunx --bun oxlint . --fix && bunx --bun eslint . --fix --cache && bunx --bun vue-tsc --build && bun test --coverage
```

### Rules

- Linting: `bun run lint` must pass before commit
- Testing: All tests must pass
- SonarQube: Fix all critical issues before merge
- Type Safety: No `any` types in new code
