# Comprehensive Testing Plan for Next.js App

## Current Status
- **Existing Tests**: 5 component tests + 6 E2E test files (37 tests total)
- **Coverage**: ~40% of critical paths tested
- **Test Framework**: Jest + React Testing Library + Playwright E2E

## Testable Elements Inventory

### Components (92+)
#### Critical Priority
- `AuthWrapper` ✅ (tested)
- `Navigation` variants (Navigation, ModernNavigation, OptimizedNavigation, EnhancedNavigation, CustomNavigation)
- `ContactForm`
- `UserProfile`
- `DashboardLayout`
- `AIProjectGenerator` ✅ (tested)

#### High Priority
- `ThemeSwitcher` ✅ (tested)
- `Projects`
- `Experience`
- `Contact`
- `Hero` variants (Hero, HeroEnhanced, ModernHero)
- `TodoList`

#### Medium Priority
- UI Components (Button, Input, Card, Badge, etc.)
- `InstallPrompt`
- `Terminal`
- `TodoList`

#### Low Priority
- Backup/archived components (.bak files)

### Hooks (1+)
- `useMobileMenu` (needs test)
- `useTheme` (context, needs test)
- `useAuth` (needs test)

### Utilities & Libraries (10+)
- `cn` function ✅ (tested)
- Theme utilities
- Auth utilities
- Amplify utilities
- Analytics utilities

### API Routes (1+)
- `/api/generate-project` (needs test)

### Contexts (1+)
- `ThemeContext` (needs test)

## Testing Strategy

### 1. Unit Tests (Jest + React Testing Library)
- Component rendering and interactions
- Hook logic and state management
- Utility function behavior
- Context provider functionality

### 2. Integration Tests
- Component integration with contexts
- Form submissions and validation
- API calls and error handling

### 3. E2E Tests (Playwright) ✅ (existing)
- User journeys
- Critical user flows

## Mocking Strategy

### External Dependencies
```typescript
// AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
  signOut: jest.fn(),
}));

// Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Next.js Navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));
```

### Browser APIs
```typescript
// localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

// fetch API
global.fetch = jest.fn();

// Clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
});
```

## Implementation Plan

### Phase 1: Fix Existing Tests (✅ COMPLETED)
1. Fix framer-motion prop warnings
2. Fix navigation mocking
3. Fix API mocking issues
4. Add missing mocks for clipboard, URL, etc.
5. Refactor E2E tests for protected route structure
6. Implement Test Mode for auth bypass

### Phase 2: Core Component Tests (Week 1)
1. Navigation components (Navigation, ModernNavigation)
2. Form components (ContactForm)
3. Auth-related components (UserProfile)
4. Layout components (DashboardLayout)

### Phase 3: UI Component Tests (Week 2)
1. Button, Input, Card, Badge variants
2. Dialog, Modal, Tooltip components
3. Form elements (Switch, Select, etc.)

### Phase 4: Hook & Utility Tests (Week 3)
1. useMobileMenu hook
2. Theme context and useTheme hook
3. Auth hooks and utilities
4. All utility functions

### Phase 5: Integration & API Tests (Week 4)
1. API route tests
2. Context integration tests
3. Component integration tests

## Test Organization Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── unit/          # Unit tests for individual components
│   │   ├── integration/   # Integration tests
│   │   └── e2e/          # E2E tests (Playwright)
├── hooks/
│   └── __tests__/
├── lib/
│   └── __tests__/
├── app/
│   └── api/
│       └── __tests__/
└── contexts/
    └── __tests__/
```

## Coverage Goals

### By Phase:
- **Phase 1**: Fix existing tests (100% pass rate)
- **Phase 2**: 60% component coverage
- **Phase 3**: 80% component coverage
- **Phase 4**: 90% utility/hook coverage
- **Phase 5**: 85% overall coverage

### Final Target:
- **Lines**: 80%
- **Functions**: 85%
- **Branches**: 75%
- **Statements**: 80%

## Test Patterns & Best Practices

### Component Test Template
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from '../Component';

// Mock external dependencies
jest.mock('external-lib', () => ({ ... }));

describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### Hook Test Template
```typescript
import { renderHook } from '@testing-library/react';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  it('returns expected values', () => {
    const { result } = renderHook(() => useCustomHook());

    expect(result.current.value).toBe(expectedValue);
  });

  it('handles state changes', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.setValue(newValue);
    });

    expect(result.current.value).toBe(newValue);
  });
});
```

### API Route Test Template
```typescript
import { NextRequest } from 'next/server';
import { POST } from '../route';

describe('/api/route', () => {
  it('handles valid requests', async () => {
    const request = new NextRequest('http://localhost:3001/api/route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it('handles invalid requests', async () => {
    const request = new NextRequest('http://localhost:3001/api/route', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

## CI/CD Integration

### Jest Configuration Updates
- Add coverage thresholds
- Configure test reporters
- Set up test scripts

### GitHub Actions
```yaml
- name: Run Tests
  run: pnpm test

- name: Generate Coverage Report
  run: pnpm test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Success Metrics

1. **All tests pass** without console errors
2. **Coverage meets targets** (80% lines, 85% functions)
3. **CI/CD pipeline** includes comprehensive testing
4. **Test maintainability** with clear naming and structure
5. **Fast test execution** (< 30 seconds for unit tests)

## Next Steps

1. Fix remaining test issues
2. Create test utilities and helpers
3. Implement Phase 2 components
4. Set up coverage monitoring
5. Establish testing documentation
