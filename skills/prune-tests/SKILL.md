---
name: prune-tests
description: Review an existing test suite for redundant or brittle tests and prune it when asked. Use for targeted test cleanup or to decide which tests can be removed without losing regression protection.
---

# Prune tests

For each candidate, ask **what regression would we miss if this test disappeared?** Work within the requested scope. If the user asks for a review, report findings without editing.

- **Merge** tests that exercise the same operation with equivalent inputs and setup. Run the operation once and assert each relevant aspect of the result in one complete test. For example, when two tests place the same order, place it once and check both the charged total and the inventory change. Preserve any distinct regression each test caught.
- **Keep separate** cases that require meaningfully different inputs, setup, entry points, or execution environments to expose their failures. A negative assertion can enforce a deliberate requirement, such as rejecting an obsolete authentication method.
- **Rewrite** a brittle test if it protects behavior the suite would otherwise lose. Assert an observable result or a required interaction, and choose the expected result independently of the implementation.
- **Remove** a test when you can point to surviving coverage that catches the same failure under the relevant conditions, or explain why the assertion protects no current requirement. Look for tests that exercise only their own mocks, check incidental implementation details, or preserve a historical fact with no standing requirement. Keep the test if its contract or replacement coverage is unclear.

Trace fixtures, mocks, entry points, and suite configuration as needed to establish what actually runs. A green suite after deletion checks that the remaining tests still run. When redundancy is unclear and a small temporary change can settle it, introduce the suspected regression locally and see whether the proposed surviving test fails. Revert the temporary change before finishing.

When editing, remove fixtures and helpers made unused by the change after checking their callers. Stay within the test suite and its support code unless the user also asked for production cleanup. Run the affected test targets and report what you merged, rewrote, or removed, the evidence for each removal, and any checks you could not run.

Inspired by [Caldo's prune-tests skill](https://github.com/caldoai/skills/blob/main/skills/prune-tests/SKILL.md).
