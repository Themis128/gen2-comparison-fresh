import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the app and show login form', async ({ page }) => {
    // Check if the main heading is visible
    await expect(page.locator('h1').filter({ hasText: 'Fresh Gen2 Amplify App' })).toBeVisible();

    // Check if Authenticator is present (login/signup form)
    await expect(page.locator('form')).toBeVisible();
  });

  test('should create and display todos with different priorities', async ({ page }) => {
    // This test assumes user is already logged in
    // In a real scenario, you'd need to handle authentication first

    // Wait for todo form to be visible
    const todoForm = page.locator('form').first();
    await expect(todoForm).toBeVisible();

    // Fill out the todo form with high priority
    await page.fill('input[placeholder="What needs to be done?"]', 'Test high priority task');
    await page.fill('input[placeholder="Category (optional)"]', 'Work');
    await page.selectOption('select', 'high');
    await page.fill('input[type="datetime-local"]', '2024-12-31T23:59');

    // Submit the form
    await page.click('button:has-text("Add Todo")');

    // Check if the todo appears in the list
    await expect(page.locator('text=Test high priority task')).toBeVisible();
    await expect(page.locator('text=Work')).toBeVisible();
    await expect(page.locator('text=high')).toBeVisible();
  });

  test('should toggle todo completion status', async ({ page }) => {
    // Find a todo item and toggle its completion
    const todoItem = page.locator('[class*="p-4 rounded-md border-l-4"]').first();
    const checkbox = todoItem.locator('input[type="checkbox"]').first();

    // Check the initial state
    const isChecked = await checkbox.isChecked();

    // Toggle the checkbox
    await checkbox.click();

    // Verify the visual changes (line-through for completed)
    if (!isChecked) {
      // If it was unchecked, it should now be checked and have line-through
      await expect(checkbox).toBeChecked();
      await expect(todoItem.locator('span').filter({ hasText: /./ })).toHaveClass(/line-through/);
    } else {
      // If it was checked, it should now be unchecked and not have line-through
      await expect(checkbox).not.toBeChecked();
      await expect(todoItem.locator('span').filter({ hasText: /./ })).not.toHaveClass(/line-through/);
    }
  });

  test('should filter todos by status', async ({ page }) => {
    // Test the status filter dropdown
    const statusFilter = page.locator('select').filter({ hasText: /All Tasks/ });
    await statusFilter.selectOption('completed');

    // Check that only completed todos are visible
    const visibleTodos = page.locator('[class*="p-4 rounded-md border-l-4"]:visible');
    const todoCount = await visibleTodos.count();

    // Verify all visible todos are completed (green background/border)
    for (let i = 0; i < todoCount; i++) {
      await expect(visibleTodos.nth(i)).toHaveClass(/bg-green-50.*border-green-500|border-green-500/);
    }
  });

  test('should filter todos by priority', async ({ page }) => {
    // Test the priority filter
    const priorityFilter = page.locator('select').filter({ hasText: /All Priorities/ });
    await priorityFilter.selectOption('high');

    // Check that only high priority todos are visible
    const visibleTodos = page.locator('[class*="p-4 rounded-md border-l-4"]:visible');
    const todoCount = await visibleTodos.count();

    // Verify all visible todos have high priority styling (red background/border)
    for (let i = 0; i < todoCount; i++) {
      await expect(visibleTodos.nth(i)).toHaveClass(/bg-red-50.*border-red-500|border-red-500/);
    }
  });

  test('should search todos by content', async ({ page }) => {
    // Test the search functionality
    const searchInput = page.locator('input[placeholder="Search todos..."]');
    await searchInput.fill('meeting');

    // Check that only todos containing "meeting" are visible
    const visibleTodos = page.locator('[class*="p-4 rounded-md border-l-4"]:visible');
    const todoCount = await visibleTodos.count();

    // Verify each visible todo contains the search term
    for (let i = 0; i < todoCount; i++) {
      const todoText = await visibleTodos.nth(i).textContent();
      expect(todoText?.toLowerCase()).toContain('meeting');
    }
  });

  test('should clear all filters', async ({ page }) => {
    // Apply multiple filters
    await page.locator('input[placeholder="Search todos..."]').fill('test');
    await page.locator('select').filter({ hasText: /All Tasks/ }).selectOption('active');
    await page.locator('select').filter({ hasText: /All Priorities/ }).selectOption('high');

    // Check that filter summary is visible
    await expect(page.locator('text=Filters:')).toBeVisible();

    // Click clear all button
    await page.click('button:has-text("Clear All")');

    // Verify filters are cleared
    await expect(page.locator('input[placeholder="Search todos..."]')).toHaveValue('');
    await expect(page.locator('select').filter({ hasText: /All Tasks/ })).toHaveValue('all');
    await expect(page.locator('select').filter({ hasText: /All Priorities/ })).toHaveValue('all');
  });

  test('should delete todos', async ({ page }) => {
    // Get initial count of todos
    const initialCount = await page.locator('[class*="p-4 rounded-md border-l-4"]').count();

    // Click delete button on first todo
    await page.locator('button:has-text("Delete")').first().click();

    // Verify todo count decreased (if there were todos)
    if (initialCount > 0) {
      const newCount = await page.locator('[class*="p-4 rounded-md border-l-4"]').count();
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('should handle empty state', async ({ page }) => {
    // Clear all todos or ensure no todos exist
    // This test assumes we can clear todos, or tests the initial empty state

    const todos = page.locator('[class*="p-4 rounded-md border-l-4"]');
    const todoCount = await todos.count();

    if (todoCount === 0) {
      // Verify empty state message
      await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
    }
  });

  test('should maintain responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify the layout adapts
    const filterGrid = page.locator('[class*="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"]');
    await expect(filterGrid).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(filterGrid).toBeVisible();
  });
});
