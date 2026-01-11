# Pelaris.id Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-346%20passing-brightgreen)](/)

Web Dashboard untuk Pelaris.id - Omnichannel POS System.

## Features

- Point of Sale dengan smart search
- Multi-cabang stock management
- Real-time updates (Socket.io)
- Excel import/export produk
- Stock alerts per variant
- Split payment support
- Thermal printer integration
- Dark/Light theme
- Skeleton loading states
- Error boundaries
- Dynamic chart loading

## Quick Start

```bash
npm install
npm run dev
```

Server: http://localhost:3100

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework (App Router + Turbopack) |
| React | 19.2.1 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Zustand | 5.x | State management |
| Socket.io | 4.7 | Real-time updates |
| Recharts | 3.5 | Charts (lazy loaded) |
| Vitest | 4.x | Unit testing |
| Axios | - | HTTP client |

## Project Structure

```
app/
├── login/              # Authentication
├── pos/                # Point of Sale
└── dashboard/
    ├── products/       # Product management
    ├── stock/          # Stock & alerts
    ├── transactions/   # Transaction history
    ├── reports/        # Sales analytics
    └── settings/       # System settings

components/
├── ui/                 # Base UI (Skeleton, Toast, etc)
├── charts/             # Dynamic chart components
├── ErrorBoundary.tsx   # Error handling
└── ProtectedRoute.tsx  # Auth guard

stores/                 # Zustand stores (8 stores)
hooks/                  # Custom hooks (memoization, socket)
lib/                    # API client, utils, validations
contexts/               # React contexts (Theme)
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- --run stores/useCartStore.test.ts
```

**Test Coverage:** 346 tests across 31 test files

| Category | Tests |
|----------|-------|
| Stores (Zustand) | 186 |
| Components | 51 |
| Hooks | 42 |
| Libraries | 67 |

## Performance Optimizations

### Skeleton Loading
- 20+ skeleton components for loading states
- 23 route-level `loading.tsx` files
- Instant feedback during navigation

### Dynamic Imports
- Charts lazy loaded (reduces bundle ~400KB)
- Route-level code splitting (automatic)

### Memoization Hooks
- `useDebounceCallback` / `useDebounceValue`
- `useThrottleCallback`
- `useMemoFilter` / `useMemoSort`
- `useIntersectionObserver`

### Image Optimization
- `OptimizedImage` - next/image wrapper with fallback
- `ProductImage` - product-specific sizing
- `AvatarImage` - user avatars with initials fallback

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Authentication |
| `/pos` | All | Point of Sale |
| `/dashboard` | All | Overview |
| `/dashboard/products` | Manager+ | Products |
| `/dashboard/stock` | All | Stock & alerts |
| `/dashboard/transactions` | All | Transactions |
| `/dashboard/reports` | Manager+ | Reports |
| `/dashboard/settings` | Manager+ | Settings |

## Build & Deploy

```bash
# Build
npm run build

# Vercel
vercel --prod
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

## Changelog

### 2026-01-09
- Fixed export data download (triggers actual file download instead of API call)
- Connected backup export handlers to UI buttons
- Export now properly downloads products, categories, and transactions as JSON files

### 2026-01-07
- Added skeleton loading components (20+ components, 18 tests)
- Added route-level loading.tsx files (23 routes)
- Added dynamic chart imports (reduces bundle size)
- Added memoization hooks (10+ hooks, 13 tests)
- Added image optimization components (13 tests)
- Added error boundaries to dashboard layout
- Added utility library (cn, formatRupiah, debounce, etc)
- Total tests: 346 passing

### 2026-01-06
- Refactored all pages to use Zustand stores
- Added 100+ new store tests
- Created storeUtils for common patterns

### 2026-01-05
- Fixed login error handling
- Improved POS search with multi-word AND logic
- Updated receipt printing format
