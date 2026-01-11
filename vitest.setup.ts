import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Set environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5100/api';
// NODE_ENV is automatically set to 'test' by vitest

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: '' },
});
