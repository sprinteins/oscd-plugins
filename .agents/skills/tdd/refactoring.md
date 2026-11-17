# Refactor Candidates

Only after GREEN, take small refactoring steps within the agreed affected scope and rerun tests after each. Larger opportunities belong in a separate proposal, not this cycle. Look for:

- **Duplication** → Extract function/class
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects
- **Affected existing code** the new code reveals as problematic
