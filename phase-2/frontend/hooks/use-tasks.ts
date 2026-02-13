"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { Task, TaskCreate, TaskUpdate, TasksState } from "@/types/task";

interface UseTasksReturn extends TasksState {
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<Task | null>;
  updateTask: (taskId: string, data: TaskUpdate) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleComplete: (taskId: string) => Promise<Task | null>;
  optimisticToggle: (taskId: string) => void;
  revertToggle: (taskId: string, previousState: boolean) => void;
}

export function useTasks(userId: string | undefined, token: string | undefined): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

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
  }, [userId, token]);

  const createTask = useCallback(async (data: TaskCreate): Promise<Task | null> => {
    if (!userId || !token) return null;

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
      return response.data;
    }

    return null;
  }, [userId, token]);

  const updateTask = useCallback(async (taskId: string, data: TaskUpdate): Promise<Task | null> => {
    if (!userId || !token) return null;

    const response = await api.put<Task>(
      `/api/v1/users/${userId}/tasks/${taskId}`,
      data,
      token
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.data! : task))
      );
      return response.data;
    }

    return null;
  }, [userId, token]);

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    if (!userId || !token) return false;

    const response = await api.delete<void>(
      `/api/v1/users/${userId}/tasks/${taskId}`,
      token
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.status === 204 || response.status === 200) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      return true;
    }

    return false;
  }, [userId, token]);

  const toggleComplete = useCallback(async (taskId: string): Promise<Task | null> => {
    if (!userId || !token) return null;

    const response = await api.patch<Task>(
      `/api/v1/users/${userId}/tasks/${taskId}/complete`,
      {},
      token
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data) {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.data! : task))
      );
      return response.data;
    }

    return null;
  }, [userId, token]);

  const optimisticToggle = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const revertToggle = useCallback((taskId: string, previousState: boolean) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: previousState } : task
      )
    );
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    optimisticToggle,
    revertToggle,
  };
}
