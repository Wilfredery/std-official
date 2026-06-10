# SDD Session: CTA Icon Centering Fix

## Date: 2026-06-09
## Status: ✅ Implemented & Verified

## Problem

CTA buttons with hover text animation (icon + text that expands on hover) had icons visually off-center when the text was collapsed. The icon appeared shifted to the left because of the `gap-2` (8px) flex gap persisting even when the text span had zero width.

## Root Cause Analysis

### Previous Failed Attempts

**Attempt 1**: Added `justify-center` to the Link container.
- **Why it failed**: `inline-flex` shrink-wraps to content. When `container-width == content-width`, `justify-center` has no free space to distribute. The icon remained off-center.

**Attempt 2**: Changed `max-w-0` to `w-0` with `inline-block`.
- **Why it failed**: The span collapsed to 0px, but `gap-2` (8px) between flex items persisted regardless of item width. The icon was still offset by `gap/2` (4px).

**Attempt 3**: Reverted everything.
- **Result**: Back to original state, problem unresolved.

### Real Root Cause

CSS `gap` renders between flex items **regardless of their size**. Even when the text span has `max-w-0` (0px width), the 8px gap between icon and span still exists, pushing the icon left of center.

## Solution

**Replace `gap-2` (container-level, always active) with conditional `margin-left` on the text span (element-level, toggleable per state).**

### CSS Strategy

| Screen | State | Margin | Effect | Icon Position |
|--------|-------|--------|--------|-----------------|
| < 640px | Always visible | `ml-2` (8px) | Present | Normal layout |
| ≥ 640px | No hover | `sm:ml-0` (0px) | **Removed** | **CENTERED** |
| ≥ 640px | Hover | `sm:group-hover:ml-2` (8px) | Re-added | Normal layout |

### Why margin works

`margin-left` is an **animatable CSS property** — it transitions numerically (0 → 8px) over 300ms, synchronized with the `max-width` expansion on the **same element**. Both transitions share `transition-all duration-300` → unified timing.

## Files Changed

### 1. `components/home/cta/CtaButton.tsx`
- Removed `gap-2` from `<Link>`
- Added `ml-2 sm:ml-0 sm:group-hover:ml-2` to `<span>`

### 2. `components/home/hero/CtaLinks.tsx`
- Same change applied to both primary and secondary links

### 3. `components/services/detail/ctaLink/CtaLink.tsx`
- Same change applied to back-to-services link

## Code Diff Example

```diff
- className="group inline-flex items-center justify-center gap-2 bg-primary ..."
+ className="group inline-flex items-center justify-center bg-primary ..."

- className="sm:inline-block sm:max-w-0 ... sm:group-hover:max-w-xs transition-all duration-300"
+ className="ml-2 sm:ml-0 sm:inline-block sm:max-w-0 ... sm:group-hover:max-w-xs sm:group-hover:ml-2 transition-all duration-300"
```

## Test Impact

**Zero tests broken.** No existing tests assert `gap-2` presence. All 22 CTA-related tests pass without modification.

## Verification

- **Tests**: 22/22 passed (0 failed)
- **Visual**: Icon centered when text collapsed, smooth animation on hover
- **Breakpoints**: Works correctly on mobile (`ml-2` always visible) and desktop (`sm:ml-0` collapsed, `sm:group-hover:ml-2` expanded)

## Key Learnings

1. **CSS `gap` is inflexible**: It always applies between flex items, even when items have zero width. For conditional spacing, use `margin` on individual items.

2. **`inline-flex` + `justify-center` trap**: When a flex container shrink-wraps to its content, `justify-content` properties become no-ops because there's no free space.

3. **Transition synchronization**: Adding `margin-left` to the same element that has `max-width` transition ensures both properties animate together with the same timing.

4. **Test safety**: Changing CSS utility classes that aren't asserted in tests is safe. Always verify test coverage before refactoring.

## Related Commits

- `ef3b9c3`: fix(ui): center icons in CTA buttons with hover text animation

## Notes

- This pattern applies to any flex container with a hover-expand text animation where the icon should be centered when text is hidden.
- The `ml-2` without breakpoint ensures spacing on mobile viewports where text is always visible.
- No DOM structure changes — purely CSS utility class adjustment.
