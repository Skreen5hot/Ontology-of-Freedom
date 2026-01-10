# Stubs - Planned Features

**Purpose**: Placeholder files for planned but not yet implemented features

---

## Status

All files in this directory are **stubs** - they represent planned functionality that has not been implemented yet.

---

## Planned Features

These features are part of the roadmap but not yet built:

### Judgment Service
**Status**: Planned
**Purpose**: Integrate 12-worldview judgment system
**Roadmap**: See [../../docs/04-planning/integrated-roadmap-v2.md](../../docs/04-planning/integrated-roadmap-v2.md) Phase 1

### Violation Detector
**Status**: Planned
**Purpose**: Detect moral principle violations
**Roadmap**: See [../../docs/04-planning/integrated-roadmap-v2.md](../../docs/04-planning/integrated-roadmap-v2.md) Phase 2

---

## For Developers

**Do not import from this directory** - these are not functional modules.

When implementing these features:
1. Move to appropriate directory ([../core/](../core/), [../builders/](../builders/), etc.)
2. Remove from [stubs/](stubs/)
3. Update this README

---

## For LLMs

**Context**: Files in this directory are intentionally empty stubs marking future work.

**Do not suggest using these modules** - they are not implemented.

**To implement a stub**:
1. Check roadmap for implementation phase
2. Review specifications in [../../docs/02-architecture/](../../docs/02-architecture/)
3. Write tests first (in [../../tests/unit/](../../tests/unit/))
4. Implement and move to appropriate [../](../) subdirectory
