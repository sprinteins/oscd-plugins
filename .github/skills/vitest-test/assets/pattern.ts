// Example pattern: shared GIVEN → multiple WHEN/THEN
// Copy and adapt this structure for your spec file.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('GIVEN a user is authenticated', () => {
  let token: string
  let userId: string

  beforeEach(() => {
    token = 'valid-token'
    userId = 'user-123'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('WHEN requesting the profile THEN it returns the user data', () => {
    // WHEN
    const result = { id: userId }

    // THEN
    expect(result.id).toBe(userId)
  })

  it('WHEN requesting settings THEN it returns default settings', () => {
    // WHEN
    const settings = { theme: 'light' }

    // THEN
    expect(settings.theme).toBe('light')
  })
})

// Edge-case pattern: empty / missing input
describe('GIVEN no input is provided', () => {
  it('WHEN the function is called with undefined THEN it throws an error', () => {
    // WHEN / THEN
    expect(() => JSON.parse(undefined as unknown as string)).toThrow()
  })
})
