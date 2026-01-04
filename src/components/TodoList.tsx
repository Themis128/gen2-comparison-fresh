'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/amplify-client';
import type { Schema } from '../../amplify/data/resource';

type Todo = Schema['Todo']['type'];

export function TodoList() {
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

  // Bulk operations states
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [bulkPriority, setBulkPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [bulkCategory, setBulkCategory] = useState('');

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos(items);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data } = await client.models.Todo.list();
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;

    try {
      await client.models.Todo.create({
        content: newTodoContent.trim(),
        priority,
        category: category.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setNewTodoContent('');
      setCategory('');
      setDueDate('');
      setPriority('medium');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      await client.models.Todo.update({
        id,
        isDone: !currentStatus,
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await client.models.Todo.delete({ id });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Bulk operations functions
  const toggleTodoSelection = (id: string) => {
    const newSelected = new Set(selectedTodos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTodos(newSelected);
  };

  const selectAllTodos = () => {
    const allIds = new Set(filteredTodos.map(todo => todo.id));
    setSelectedTodos(allIds);
  };

  const deselectAllTodos = () => {
    setSelectedTodos(new Set());
  };

  const bulkDeleteCompleted = async () => {
    const completedIds = filteredTodos
      .filter(todo => todo.isDone)
      .map(todo => todo.id);

    if (completedIds.length === 0) return;

    if (!confirm(`Delete ${completedIds.length} completed todo(s)?`)) return;

    try {
      await Promise.all(
        completedIds.map(id => client.models.Todo.delete({ id }))
      );
    } catch (error) {
      console.error('Error bulk deleting todos:', error);
      alert('Error deleting completed todos. Please try again.');
    }
  };

  const bulkUpdatePriority = async () => {
    if (selectedTodos.size === 0) return;

    if (!confirm(`Update priority to "${bulkPriority}" for ${selectedTodos.size} todo(s)?`)) return;

    try {
      await Promise.all(
        Array.from(selectedTodos).map(id =>
          client.models.Todo.update({
            id,
            priority: bulkPriority,
          })
        )
      );
      setSelectedTodos(new Set());
    } catch (error) {
      console.error('Error bulk updating priority:', error);
      alert('Error updating priorities. Please try again.');
    }
  };

  const bulkUpdateCategory = async () => {
    if (selectedTodos.size === 0) return;

    const categoryValue = bulkCategory.trim() || undefined;
    if (!confirm(`Update category to "${categoryValue || 'none'}" for ${selectedTodos.size} todo(s)?`)) return;

    try {
      await Promise.all(
        Array.from(selectedTodos).map(id =>
          client.models.Todo.update({
            id,
            category: categoryValue,
          })
        )
      );
      setSelectedTodos(new Set());
    } catch (error) {
      console.error('Error bulk updating category:', error);
      alert('Error updating categories. Please try again.');
    }
  };

  // Filter and search todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      searchTerm === '' ||
      (todo.content &&
        todo.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    new Set(
      todos.map((todo) => todo.category).filter((c): c is string => c != null)
    )
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
              value={categoryFilter || ''}
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

      {/* Bulk Actions Bar */}
      {selectedTodos.size > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {selectedTodos.size} todo{selectedTodos.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={deselectAllTodos}
                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-700"
              >
                Deselect All
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Bulk Priority Update */}
              <div className="flex items-center gap-2">
                <select
                  value={bulkPriority}
                  onChange={(e) => setBulkPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-blue-600 dark:text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button
                  onClick={bulkUpdatePriority}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Priority
                </button>
              </div>

              {/* Bulk Category Update */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  placeholder="New category"
                  className="px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-blue-600 dark:text-white"
                />
                <button
                  onClick={bulkUpdateCategory}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Update Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Select All / Bulk Delete Completed */}
      {filteredTodos.length > 0 && (
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedTodos.size === filteredTodos.length && filteredTodos.length > 0}
              onChange={() => {
                if (selectedTodos.size === filteredTodos.length) {
                  deselectAllTodos();
                } else {
                  selectAllTodos();
                }
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Select All ({filteredTodos.length})
            </span>
          </div>

          <button
            onClick={bulkDeleteCompleted}
            disabled={filteredTodos.filter(todo => todo.isDone).length === 0}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Completed ({filteredTodos.filter(todo => todo.isDone).length})
          </button>
        </div>
      )}

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
                selectedTodos.has(todo.id)
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : todo.isDone
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
                    {/* Selection checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedTodos.has(todo.id)}
                      onChange={() => toggleTodoSelection(todo.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {/* Completion checkbox */}
                    <input
                      type="checkbox"
                      checked={todo.isDone || false}
                      onChange={() => toggleTodo(todo.id, todo.isDone || false)}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                      {todo.priority || 'medium'}
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
