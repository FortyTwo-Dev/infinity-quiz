# ADR-001 - Tailwind CSS Class Detection Strategy

## Status
Accepted

## Context

### Problem encountered
Tailwind CSS v4 scans source files to detect used utility classes and generates only the necessary CSS. This relies on **static class detection** in source files.

During the daisy-ui migration, we identified that Tailwind v4 **cannot detect** classes generated via string interpolation or concatenation:

- `card-${props.size}` → Tailwind sees `card-` but NOT `card-sm`, `card-md`, `card-lg`, `card-xl`
- Result: Used classes are **not generated** in the final CSS, breaking the UI in production

### Constraints
- Infinity Quiz uses **Tailwind CSS v4.3.3** (see package.json)
- Infinity Quiz uses **daisyUI v5.7.22** which provides component-specific classes (`btn-primary`, `card-md`, `badge-success`, etc.)
- Project already uses **`@source inline()`** in `src/css/main.css` (line 4) for some status classes
- We must follow the [Tailwind v4 class detection documentation](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- Bundle size optimization remains important

### Objectives
1. Ensure **all used Tailwind/daisyUI classes are preserved** in production
2. Maintain **code readability and maintainability**
3. Follow **Tailwind v4 best practices** for class detection
4. Keep **type safety** where applicable for all class variants

---

## Decision

### Chosen solution: Hybrid Approach - Records + @source inline()

We adopt a **hybrid approach** that leverages both strategies based on the use case:

| Approach | When to use | Advantages | Drawbacks |
|----------|-------------|-----------|----------|
| **Record-based objects** | Typed, controlled classes (custom variants) | Type-safe, autocompletion, self-documenting | More verbose |
| **`@source inline()`** | daisyUI/theme classes with fixed patterns | Centralized, simple, maintains existing patterns | Less type safety |

### Implementation

#### Strategy 1: Record-based objects (for typed, custom classes)
```typescript
// ✅ PREFERRED for custom/typed variants
const colorVariants = {
  blue: "bg-blue-600 hover:bg-blue-500",
  red: "bg-red-600 hover:bg-red-500",
} as const

function Button({ color }: { color: keyof typeof colorVariants }) {
  return <button className={colorVariants[color]}>{children}</button>
}
```

#### Strategy 2: @source inline() (for daisyUI/third-party classes)
```css
/* main.css - Centralized safelist for daisyUI classes */
@import 'tailwindcss';
@plugin "daisyui";

/* Safelist all daisyUI class patterns */
@source inline("card-{sm,md,lg,xl}");
@source inline("badge-{primary,secondary,accent,neutral,success,warning,error,info,ghost}");
@source inline("modal-{top,middle,bottom}");
@source inline("checkbox-{xs,sm,md,lg,xl}");
@source inline("progress-{primary,secondary,accent,neutral,success,warning,error,info}");
@source inline("btn-{primary,secondary,accent,neutral,success,warning,error,info,ghost,link,outline}");
@source inline("btn-{xs,sm,md,lg,xl}");
```

Then in components, **both approaches are valid**:

```vue
<!-- ✅ VALID with @source inline() - daisyUI classes are safelisted -->
<div :class="`card card-${props.size}`">
  <!-- content -->
</div>

<!-- ✅ PREFERRED for custom classes - always statically detectable -->
<div :class="['btn', btnColorClasses[props.color]]">
  <!-- content -->
</div>

<!-- ❌ AVOID - Classes not safelisted AND not static -->
<div :class="`custom-${props.dynamicValue}`">
  <!-- content -->
</div>
```

### Current project state

The project **already uses `@source inline()`** in `src/css/main.css` (line 4):
```css
@source inline("status-{success,error,warning,info,neutral,secondary}");
```

This needs to be **expanded** to cover all daisyUI classes used by components.

### Component categories and recommended approach

| Component | Current | Recommended | Rationale |
|-----------|---------|-------------|-----------|
| `DButton.vue` | ✅ Record-based | ✅ Keep | Custom logic, typed |
| `DCard.vue` | ❌ Interpolation | `@source inline()` | daisyUI classes |
| `DBadge.vue` | ❌ Interpolation | `@source inline()` | daisyUI classes |
| `DModal.vue` | ❌ Interpolation | `@source inline()` | daisyUI classes |
| `DProgress.vue` | ❌ Interpolation | `@source inline()` | daisyUI classes |
| `DCheckbox.vue` | ❌ Conditional object | `@source inline()` | daisyUI classes |
| `LContainer.vue` | ✅ Record-based | ✅ Keep | Custom padding logic |

**Note:** Custom components with business-specific logic (like LContainer) should use Record-based objects. daisyUI wrapper components should rely on `@source inline()` safelisting.

---

## Consequences

### Positive
✅ **Tailwind v4 compatibility**: All classes are either statically detectable or explicitly safelisted
✅ **Type safety**: Record-based variants are typed, preventing invalid values
✅ **Autocompletion**: IDE support for custom class variants
✅ **Maintainability**: Clear separation - Records for custom, `@source inline()` for daisyUI
✅ **Centralized configuration**: daisyUI classes managed in one place (`main.css`)
✅ **Flexibility**: Both approaches available depending on needs

### Negative
⚠️ **Slight verbosity**: Record objects require more lines of code
⚠️ **Migration effort**: Existing components need updates (either Records or safelisting)
⚠️ **Maintenance**: `@source inline()` patterns must be kept in sync with used classes

### Trade-offs
- **Type safety vs. Simplicity**: Records provide type safety, `@source inline()` is simpler
- **Centralization vs. Distribution**: `@source inline()` centralizes config, Records distribute logic
- **Explicit vs. Implicit**: Records make dependencies explicit, `@source inline()` is implicit

---

## Alternatives Considered

### 1. Record-based only (Rejected - Too rigid)
**Approach**: Require ALL dynamic classes to use Record-based objects

**Rejected because:**
- ❌ **Over-engineering**: daisyUI classes have fixed patterns, Records are unnecessary
- ❌ **Migration overhead**: Would require refactoring all daisyUI wrapper components
- ✅ **Type safety**: Would provide maximum type safety

**Verdict**: Too rigid for daisyUI components where patterns are fixed and known

### 2. @source inline() only (Rejected - Loses type safety)
**Approach**: Safelist all classes with `@source inline()` and allow string interpolation everywhere

**Rejected because:**
- ❌ **No type safety**: Loses TypeScript benefits for custom class variants
- ❌ **Hard to maintain**: Must track every class pattern manually
- ❌ **Misses benefits**: Record-based objects provide autocompletion and validation

**Verdict**: Loses important type safety benefits for custom logic

### 3. Safelist in tailwind.config.js (Rejected - Tailwind v4 syntax)
**Approach**: Use old Tailwind v3 `safelist` configuration in tailwind.config.js

```javascript
// tailwind.config.js - Tailwind v3 syntax, NOT v4
module.exports = {
  safelist: [
    'card-sm', 'card-md', 'card-lg', 'card-xl',
    // ... hundreds more
  ]
}
```

**Rejected because:**
- ❌ **Wrong version**: Tailwind v4 uses `@source` directives in CSS, not `safelist` in config
- ❌ **Deprecated**: v3 configuration doesn't work with v4

**Verdict**: Not compatible with Tailwind CSS v4.3.3 used by this project

### 4. Disable source detection entirely (Rejected)
**Approach**: Generate all possible Tailwind classes

**Rejected because:**
- ❌ **Performance impact**: Massive CSS bundle size
- ❌ **Best practice violation**: Tailwind explicitly recommends source detection
- ❌ **Not sustainable**: Defeats the purpose of utility-first CSS

**Verdict**: Not acceptable for production applications

---

## Validation Strategy

### How to verify class detection

Since the project uses **Tailwind CSS v4**, verification works differently than v3:

```bash
# Build CSS to see what classes are generated
cd /home/fortytwo-dev/Documents/projects/infinityapp/infinity-quiz
bun run dev  # Then check generated CSS

# Or check specific patterns
# Tailwind v4 doesn't have a direct dry-run, but you can:
# 1. Build the CSS file
# 2. Search for specific classes (e.g., grep "card-sm" dist/empty.css)
```

### For development testing
Check if a specific daisyUI class exists in the generated CSS:
```bash
# After building, check if classes are present
grep -o "card-sm" dist/assets/*.css | wc -l  # Should be > 0 if safelisted
```

### Automated checking (CI/CD)
```yaml
# .github/workflows/tailwind-check.yml
- name: Verify daisyUI classes are safelisted
  run: |
    # Build production CSS
    bun run build
    # Verify key classes exist
    grep -q "card-sm" dist/assets/*.css
    grep -q "badge-primary" dist/assets/*.css
    grep -q "modal-middle" dist/assets/*.css
```

---

## Migration Plan

### Phase 1: Expand @source inline() (5 minutes)
The project already has `@source inline()` in `main.css`. **Expand it to cover all daisyUI classes**:

**File: `src/css/main.css`**
```css
@import 'tailwindcss';
@plugin "daisyui";

/* ===== DAISYUI CLASSES SAFELIST ===== */

/* Card */
@source inline("card-{sm,md,lg,xl}");
@source inline("card-{border,compact,side,dash}");

/* Badge */
@source inline("badge-{primary,secondary,accent,neutral,success,warning,error,info,ghost}");
@source inline("badge-{xs,sm,md,lg}");
@source inline("badge-{outline,soft}");

/* Modal */
@source inline("modal-{top,middle,bottom}");

/* Button */
@source inline("btn-{primary,secondary,accent,neutral,success,warning,error,info,ghost,link,outline}");
@source inline("btn-{xs,sm,md,lg,xl}");
@source inline("btn-{wide,disabled,loading,soft}");

/* Checkbox */
@source inline("checkbox-{primary,secondary,accent,neutral,success,warning,info,error}");
@source inline("checkbox-{xs,sm,md,lg,xl}");

/* Progress */
@source inline("progress-{primary,secondary,accent,neutral,success,warning,error,info}");

/* Indicator */
@source inline("indicator-{start,center,end}");

/* Status (already present) */
@source inline("status-{success,error,warning,info,neutral,secondary}");
```

### Phase 2: Keep or convert existing components (Optional)

| Component | Action | Rationale |
|-----------|--------|-----------|
| `DButton.vue` | ✅ **Keep** | Already uses Record-based, provides type safety |
| `DCard.vue` | ⚠️ **Optional** | Can keep interpolation (now safelisted) or convert to Records |
| `DBadge.vue` | ⚠️ **Optional** | Can keep interpolation (now safelisted) or convert to Records |
| `DModal.vue` | ⚠️ **Optional** | Can keep interpolation (now safelisted) or convert to Records |
| `DProgress.vue` | ⚠️ **Optional** | Can keep interpolation (now safelisted) or convert to Records |
| `DCheckbox.vue` | ⚠️ **Optional** | Can keep conditional object or convert to Records |
| `LContainer.vue` | ✅ **Keep** | Already uses Record-based, custom logic |

**Note:** After Phase 1, **all daisyUI classes are safelisted**, so the current interpolation in components **will work**. Converting to Records is optional for type safety benefits.

### Phase 3: Verify
1. Run `bunx --bun vue-tsc --build` (TypeScript check)
2. Run `bun test:coverage` (Tests still pass)
3. Run `bun run build` and verify generated CSS contains daisyUI classes
4. Manual test: Verify UI renders correctly in production mode

---

## Enforcement

### Linting rule (future)
Consider adding ESLint rule to **encourage** Record-based objects for custom classes:
```javascript
// .eslintrc.js - Optional, not mandatory
rules: {
  // Warn about string interpolation in class attributes
  // (Only for custom classes, not daisyUI which is safelisted)
  'vue/prefer-record-class-variants': 'warn'
}
```

### Code review checklist
- [ ] Are daisyUI classes properly safelisted in `main.css`?
- [ ] Are custom class variants using Record-based objects?
- [ ] Are all class patterns typed where applicable?
- [ ] Have you verified with production build that classes are generated?

---

## References
- [Tailwind CSS v4 - Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Tailwind CSS v4 - @source directive](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources)
- [daisyUI v5 - Component classes](https://daisyui.com/docs/components/)
- [daisyUI - Theme configuration](https://daisyui.com/docs/themes/)

---

## See Also
- **Project file**: `src/css/main.css` (where `@source inline()` patterns are defined)
- **Related ADRs**: None yet

*Format inspired by [MADR](https://adr.github.io/madr/)*
