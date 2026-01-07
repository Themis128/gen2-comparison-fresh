# Playwright Viewport Expansion Guide

## Overview
The Playwright configuration has been enhanced to support horizontal expansion and responsive testing across multiple viewport sizes.

## Features

### 1. Configurable Default Viewport
- **Default**: 1920x1080 (Full HD)
- **Environment Variables**: Override with `VIEWPORT_WIDTH` and `VIEWPORT_HEIGHT`
- **Example**: `VIEWPORT_WIDTH=2560 VIEWPORT_HEIGHT=1440 npm run test:e2e`

### 2. Multiple Project Configurations
The config includes several viewport presets:

- **chromium** (default): 1920x1080 - Standard desktop
- **chromium-tablet**: 1024x768 - Tablet landscape
- **chromium-wide**: 2560x1440 - Wide desktop
- **chromium-ultra-wide**: 3440x1440 - Ultra-wide 34-inch monitor

### 3. Usage Examples

#### Run tests on all viewports:
```bash
npm run test:e2e
```

#### Run tests on specific viewport:
```bash
npx playwright test --project=chromium-wide
npx playwright test --project=chromium-tablet
```

#### Run tests with custom viewport:
```bash
VIEWPORT_WIDTH=3840 VIEWPORT_HEIGHT=2160 npm run test:e2e
```

#### Run specific test file on multiple viewports:
```bash
npx playwright test viewport-expansion.spec.ts
```

## Benefits

1. **Horizontal Expansion**: Tests can run on ultra-wide displays without layout issues
2. **Responsive Testing**: Ensures your application works across different screen sizes
3. **Flexible Configuration**: Easy to adjust viewport sizes via environment variables
4. **Parallel Testing**: Different viewport projects can run in parallel for faster CI/CD

## Configuration Details

The viewport configuration is located in `playwright.config.ts`:

```typescript
// Default viewport (configurable via env vars)
viewport: {
  width: process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : 1920,
  height: process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : 1080
}

// Multiple project configurations for different screen sizes
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'chromium-tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
  { name: 'chromium-wide', use: { ...devices['Desktop Chrome'], viewport: { width: 2560, height: 1440 } } },
  { name: 'chromium-ultra-wide', use: { ...devices['Desktop Chrome'], viewport: { width: 3440, height: 1440 } } }
]
```

## Testing Wide Content

The configuration ensures that:
- Content can expand horizontally when needed
- No horizontal scrolling is required for main content areas
- Layouts adapt properly to different screen widths
- Ultra-wide displays (3440px+) are supported for modern workflows
