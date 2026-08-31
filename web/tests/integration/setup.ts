import { vi } from 'vitest'
import { mockAuth } from './mocks/auth'

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}))

vi.mock('better-auth/next-js', () => ({
  nextCookies: () => ({})
}))

vi.mock('@/auth', () => ({
  auth: mockAuth
}))