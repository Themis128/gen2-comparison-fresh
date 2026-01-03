'use client';

import { useState, useEffect } from 'react';

type Todo = {
  id: string;
  content: string;
  isDone: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
};

// Mock TodoList component for testing that bypasses authentication
function MockTodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'completed'
  >('all');
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Mock data for testing
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTodos([
        {
          id: '1',
          content: 'Test high priority task',
          isDone: false,
          priority: 'high',
          category: 'Work',
          dueDate: '2024-12-31T23:59',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          content: 'Test medium priority task',
          isDone: false,
          priority: 'medium',
          category: 'Personal',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          content: 'Completed low priority task',
          isDone: true,
          priority: 'low',
          category: 'Home',
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      content: newTodoContent.trim(),
      isDone: false,
      priority,
      category: category.trim() || undefined,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [...prev, newTodo]);
    setNewTodoContent('');
    setCategory('');
    setDueDate('');
    setPriority('medium');
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isDone: !currentStatus } : todo
      )
    );
  };

  const deleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Filter and search todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      searchTerm === '' ||
      todo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.category &&
        todo.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && todo.isDone) ||
      (statusFilter === 'active' && !todo.isDone);

    const matchesPriority =
      priorityFilter === 'all' || todo.priority === priorityFilter;

    const matchesCategory =
      categoryFilter === '' || todo.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(todos.map((todo) => todo.category).filter(Boolean))
  );

  if (loading) {
    return <div className="text-center py-4">Loading todos...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as 'all' | 'active' | 'completed'
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value as 'all' | 'low' | 'medium' | 'high'
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchTerm ||
          statusFilter !== 'all' ||
          priorityFilter !== 'all' ||
          categoryFilter) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filters:
            </span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                Search: &ldquo;{searchTerm}&rdquo;
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm">
                Status: {statusFilter}
              </span>
            )}
            {priorityFilter !== 'all' && (
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                Priority: {priorityFilter}
              </span>
            )}
            {categoryFilter && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-sm">
                Category: {categoryFilter}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('');
              }}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Add new todo form */}
      <form
        onSubmit={createTodo}
        className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            placeholder="What needs to be done?"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as 'low' | 'medium' | 'high')
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Todo
        </button>
      </form>

      {/* Todo list */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {todos.length === 0
              ? 'No todos yet. Add one above!'
              : 'No todos match your filters.'}
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-md border-l-4 ${
                todo.isDone
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : todo.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : todo.priority === 'medium'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={todo.isDone || false}
                      onChange={() => toggleTodo(todo.id, todo.isDone || false)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span
                      className={`flex-1 ${todo.isDone ? 'line-through text-gray-500' : ''}`}
                    >
                      {todo.content}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {todo.category && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {todo.category}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded ${
                        todo.priority === 'high'
                          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          : todo.priority === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}
                    >
                      {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 ml-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Test page that uses mock data and bypasses authentication
export default function TestPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Fresh Gen2 Amplify App - Test Mode
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing environment with mock data (no authentication required)
          </p>
        </div>

        <MockTodoList />
      </div>
    </main>
  );
}
