// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
    isLoaded: true,
    isSignedIn: true,
  }),
  useAuth: () => ({
    userId: 'test-user-id',
    isLoaded: true,
    isSignedIn: true,
  }),
  SignIn: () => <div>Mock SignIn</div>,
  SignUp: () => <div>Mock SignUp</div>,
  auth: () => ({
    userId: 'test-user-id',
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.location
delete window.location
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
}

// Mock crypto for Hedera tests
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      importKey: jest.fn(),
      deriveKey: jest.fn(),
      encrypt: jest.fn(),
      decrypt: jest.fn(),
    },
    getRandomValues: jest.fn(() => new Uint8Array(16)),
  },
})

// Polyfill TextEncoder and TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
