import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  getItem: (key: string): string | null => {
    return localStorageMock.store[key] || null
  },
  setItem: (key: string, value: string): void => {
    localStorageMock.store[key] = value
  },
  removeItem: (key: string): void => {
    delete localStorageMock.store[key]
  },
  clear: (): void => {
    localStorageMock.store = {}
  },
  store: {} as Record<string, string>
}

global.localStorage = localStorageMock as Storage

export { expect }
