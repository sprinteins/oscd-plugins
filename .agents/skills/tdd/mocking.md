# Mock at agreed boundaries

[Vitest boundary mocking](../vitest-test/mocking.md) is the canonical fixture/mock setup reference. Prefer real package code, in-memory DOM/XML, and existing fixtures. Use typed dependency injection and SDK-style external operations when a meaningful boundary needs isolation.

Keep tests at user-confirmed public seams; mocks must not replace the behavior the test claims to prove.
