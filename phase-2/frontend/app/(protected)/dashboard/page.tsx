"use client";

import { useSession, getToken } from "@/lib/auth-client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Task, TaskCreate, TaskUpdate } from "@/types/task";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskDeleteDialog } from "@/components/tasks/task-delete-dialog";
import { Modal } from "@/components/ui/modal";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Form visibility state
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Edit modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Delete dialog state
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch JWT token once session is available
  const tokenFetched = useRef(false);

  useEffect(() => {
    async function fetchTokenAsync() {
      if (session && !tokenFetched.current) {
        tokenFetched.current = true;
        try {
          const jwtToken = await getToken();
          if (jwtToken) {
            setToken(jwtToken);
          }
        } catch (err) {
          console.error("Failed to get token:", err);
        }
      }
    }
    fetchTokenAsync();
  }, [session]);

  // Fetch tasks when token is available
  const tasksFetched = useRef(false);

  useEffect(() => {
    async function fetchTasks() {
      if (userId && token && !tasksFetched.current) {
        tasksFetched.current = true;
        setLoading(true);
        setError(null);

        const response = await api.get<Task[]>(`/api/v1/users/${userId}/tasks`, token);

        if (response.error) {
          setError(response.error);
          setTasks([]);
        } else if (response.data) {
          setTasks(response.data);
        }
        setLoading(false);
      }
    }
    fetchTasks();
  }, [userId, token]);

  // Set loading to false if no session
  useEffect(() => {
    if (!isPending && !session) {
      setLoading(false);
    }
  }, [isPending, session]);

  // Handle retry
  const handleRetry = async () => {
    if (!userId || !token) return;
    tasksFetched.current = false;
    setLoading(true);
    setError(null);

    const response = await api.get<Task[]>(`/api/v1/users/${userId}/tasks`, token);

    if (response.error) {
      setError(response.error);
      setTasks([]);
    } else if (response.data) {
      setTasks(response.data);
    }
    setLoading(false);
  };

  // Handle create task
  const handleCreateTask = async (data: TaskCreate | TaskUpdate) => {
    if (!userId || !token) return;

    const response = await api.post<Task>(
      `/api/v1/users/${userId}/tasks`,
      data,
      token
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      setTasks((prev) => [response.data!, ...prev]);
    }
    setShowCreateForm(false);
  };

  // Handle toggle complete
  const handleToggleComplete = useCallback(
    async (taskId: string, previousState: boolean) => {
      if (!userId || !token) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );

      try {
        const response = await api.patch<Task>(
          `/api/v1/users/${userId}/tasks/${taskId}/complete`,
          {},
          token
        );

        if (response.error) {
          // Revert on error
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? { ...task, completed: previousState } : task
            )
          );
          console.error("Failed to toggle task:", response.error);
        } else if (response.data) {
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? response.data! : task))
          );
        }
      } catch (err) {
        // Revert on error
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, completed: previousState } : task
          )
        );
        console.error("Failed to toggle task:", err);
      }
    },
    [userId, token]
  );

  // Handle edit task
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: TaskCreate | TaskUpdate) => {
    if (!editingTask || !userId || !token) return;

    const response = await api.put<Task>(
      `/api/v1/users/${userId}/tasks/${editingTask.id}`,
      data,
      token
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? response.data! : task))
      );
    }
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  // Handle delete task
  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (taskId: string) => {
    if (!userId || !token) return;

    const response = await api.delete<void>(
      `/api/v1/users/${userId}/tasks/${taskId}`,
      token
    );

    if (response.error) {
      throw new Error(response.error);
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setShowDeleteDialog(false);
    setDeletingTask(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeletingTask(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Tasks</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your tasks below
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Task
        </Button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <Card className="animate-fade-in-up">
          <CardHeader>
            <h2 className="text-lg font-medium text-text-primary">Create New Task</h2>
          </CardHeader>
          <CardContent>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowCreateForm(false)}
              submitLabel="Create Task"
            />
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onCreateClick={() => setShowCreateForm(true)}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleEditCancel}
        title="Edit Task"
      >
        <TaskForm
          task={editingTask || undefined}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <TaskDeleteDialog
        task={deletingTask}
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
