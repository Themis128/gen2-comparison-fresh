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

  // ...existing code...

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

  // ...existing code...

  if (loading) {
    return <div className="py-4 text-center">Loading todos...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={createTodo} className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Todo
        </button>
      </form>
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="py-4 text-center text-gray-500">No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`rounded-md border-l-4 p-4 ${
                todo.isDone
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : todo.priority === 'high'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : todo.priority === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-500 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.isDone || false}
                      onChange={() => toggleTodo(todo.id, todo.isDone || false)}
                      className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600"
                    />
                    <span className={`flex-1 ${todo.isDone ? 'text-gray-500 line-through' : ''}`}>
                      {todo.content}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {todo.category && (
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {todo.category}
                      </span>
                    )}
                    <span
                      className={`rounded px-2 py-1 ${
                        todo.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : todo.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {todo.priority || 'medium'}
                    </span>
                    {todo.dueDate && (
                      <span className="rounded bg-purple-100 px-2 py-1 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-4 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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
