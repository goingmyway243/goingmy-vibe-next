# Testing Guide

## Overview

This project uses **Jest** and **React Testing Library** for unit and integration testing.

## Test Structure

```
app/
├── components/
│   ├── auth/
│   │   └── __tests__/
│   │       ├── LoginForm.test.tsx
│   │       └── SignupForm.test.tsx
│   ├── feed/
│   │   └── __tests__/
│   │       ├── CreatePost.test.tsx
│   │       └── PostCard.test.tsx
│   └── shared/
│       └── __tests__/
│           ├── Avatar.test.tsx
│           ├── Button.test.tsx
│           ├── Input.test.tsx
│           └── Navbar.test.tsx
└── context/
    └── __tests__/
        └── AuthContext.test.tsx
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (recommended for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- Button.test.tsx
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="renders"
```

## Test Coverage

Current test coverage includes:

### Shared Components (100%)
- ✅ **Button** - Variants, sizes, click handlers, disabled states
- ✅ **Input** - User input, labels, error messages, validation
- ✅ **Avatar** - Size variations, image display, initials

### Auth Components (100%)
- ✅ **LoginForm** - Form submission, validation, error handling
- ✅ **SignupForm** - Password matching, user creation, validation
- ✅ **AuthContext** - Login, logout, signup, localStorage persistence

### Feed Components (100%)
- ✅ **PostCard** - Like/unlike, comment actions, author display
- ✅ **CreatePost** - Post creation, character limit, submission

### Navigation (100%)
- ✅ **Navbar** - Navigation links, logout, user display

## Writing New Tests

### Basic Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(/* assertion */);
  });
});
```

### Testing with Auth Context

```typescript
import { AuthProvider } from '@/app/context/AuthContext';

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

// Use in tests
renderWithAuth(<YourComponent />);
```

### Mocking Next.js Router

```typescript
import { useRouter } from 'next/navigation';

jest.mock('next/navigation');

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
  replace: jest.fn(),
});
```

## Best Practices

1. **Test user behavior, not implementation details**
   ```typescript
   // ✅ Good - tests what user sees
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
   
   // ❌ Bad - tests implementation
   expect(component.state.isSubmitting).toBe(false);
   ```

2. **Use `userEvent` over `fireEvent`**
   ```typescript
   // ✅ Good - simulates real user interaction
   const user = userEvent.setup();
   await user.click(button);
   
   // ❌ Less ideal
   fireEvent.click(button);
   ```

3. **Wait for async updates**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

4. **Clean up between tests**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
     localStorage.clear();
   });
   ```

## Debugging Tests

### Run tests with verbose output
```bash
npm test -- --verbose
```

### Debug specific test
```bash
npm test -- --testNamePattern="your test name" --watch
```

### Use `screen.debug()` to see rendered output
```typescript
render(<Component />);
screen.debug(); // Prints current DOM
```

## CI/CD Integration

Tests automatically run on:
- Pre-commit (if using husky)
- Pull requests
- Before deployment

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

View detailed coverage report after running:
```bash
npm run test:coverage
```

Then open `coverage/lcov-report/index.html` in your browser.
