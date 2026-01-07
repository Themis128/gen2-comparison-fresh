'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, CheckCircle2, Circle, Trash2, Calendar, Flag } from 'lucide-react';
import React from 'react';

import { client } from '@/lib/amplify-client';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Todo {
  id: string;
  content: string | null;
  isDone: boolean | null;
  priority: string | null;
  category: string | null;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function TodoManager() {
  const queryClient = useQueryClient();
  const [newTodoContent, setNewTodoContent] = React.useState('');
  const [newTodoCategory, setNewTodoCategory] = React.useState('personal');
  const [newTodoPriority, setNewTodoPriority] = React.useState('medium');
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('all');

  // Fetch todos
  const {
    data: todos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await client.models.Todo.list({
        limit: 100,
      });
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: async (todoData: { content: string; category: string; priority: string }) => {
      const response = await client.models.Todo.create({
        content: todoData.content,
        category: todoData.category,
        priority: todoData.priority,
        isDone: false,
      });
      return response.data;
    },
    onSuccess: (newTodo) => {
      queryClient.setQueryData(['todos'], (old: any) => [newTodo, ...(old || [])]);
      setNewTodoContent('');
    },
  });

  // Update todo mutation (toggle done status)
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Todo> }) => {
      const response = await client.models.Todo.update({
        id,
        ...updates,
      });
      return response.data;
    },
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(['todos'], (old: any) =>
        old?.map((todo: Todo) => (todo.id === updatedTodo?.id ? updatedTodo : todo))
      );
    },
  });

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await client.models.Todo.delete({ id });
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['todos'], (old: any) =>
        old?.filter((todo: Todo) => todo.id !== deletedId)
      );
    },
  });

  const handleCreateTodo = () => {
    if (newTodoContent.trim()) {
      createMutation.mutate({
        content: newTodoContent,
        category: newTodoCategory,
        priority: newTodoPriority,
      });
    }
  };

  const toggleTodo = (todo: Todo) => {
    updateMutation.mutate({
      id: todo.id,
      updates: { isDone: !todo.isDone },
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'work':
        return 'bg-blue-100 text-blue-800';
      case 'personal':
        return 'bg-purple-100 text-purple-800';
      case 'shopping':
        return 'bg-green-100 text-green-800';
      case 'health':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTodos = todos?.filter((todo) => {
    switch (filter) {
      case 'pending':
        return !todo.isDone;
      case 'completed':
        return todo.isDone;
      default:
        return true;
    }
  });

  const stats = {
    total: todos?.length || 0,
    completed: todos?.filter((t) => t.isDone).length || 0,
    pending: todos?.filter((t) => !t.isDone).length || 0,
    highPriority: todos?.filter((t) => t.priority === 'high' && !t.isDone).length || 0,
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Loading tasks...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Error loading tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="mb-4 text-red-500">Error: {error?.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Manager</CardTitle>
        <CardDescription>
          Manage your tasks and stay organized ({stats.total} total tasks)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
        </div>

        {/* Add New Task */}
        <div className="mb-6 rounded-lg border bg-muted/50 p-4">
          <h4 className="mb-3 font-semibold">Add New Task</h4>
          <div className="mb-3 flex gap-2">
            <Input
              placeholder="What needs to be done?"
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
            />
          </div>
          <div className="mb-3 flex gap-2">
            <Select value={newTodoCategory} onValueChange={setNewTodoCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newTodoPriority} onValueChange={setNewTodoPriority}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleCreateTodo}
            disabled={createMutation.isPending || !newTodoContent.trim()}
            className="w-full"
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {createMutation.isPending ? 'Adding...' : 'Add Task'}
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="mb-4 flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed ({stats.completed})
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTodos?.map((todo) => (
            <div
              key={todo.id}
              className={`rounded-lg border p-4 transition-all ${
                todo.isDone ? 'bg-muted/30 opacity-75' : 'bg-background'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.isDone ?? false}
                  onCheckedChange={() => toggleTodo(todo)}
                  disabled={updateMutation.isPending}
                  className="mt-1"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className={getPriorityColor(todo.priority || 'medium')}>
                      <Flag className="mr-1 h-3 w-3" />
                      {todo.priority || 'Medium'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getCategoryColor(todo.category || 'personal')}
                    >
                      {todo.category || 'Personal'}
                    </Badge>
                    {todo.isDone && (
                      <Badge variant="secondary">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Done
                      </Badge>
                    )}
                  </div>

                  <p
                    className={`text-sm ${todo.isDone ? 'text-muted-foreground line-through' : ''}`}
                  >
                    {todo.content}
                  </p>

                  {todo.createdAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created: {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(todo.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredTodos?.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'No tasks yet. Add your first task above!'
                : `No ${filter} tasks.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
