"use client";

/**
 * Task List Component with Glassmorphism and GSAP Animations
 * Feature: 004-frontend-ui-redesign
 */

import { useRef } from "react";
import { Task } from "@/types/task";
import { TaskItem } from "./task-item";
import { EmptyState } from "./empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGSAP, gsap } from "@/lib/gsap";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onToggleComplete: (taskId: string, previousState: boolean) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreateClick?: () => void;
}

export function TaskList({
  tasks,
  loading,
  error,
  onRetry,
  onToggleComplete,
  onEdit,
  onDelete,
  onCreateClick,
}: TaskListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Stagger animation for task list items
  useGSAP(
    () => {
      if (loading || error || tasks.length === 0) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      // The TaskItem components handle their own entrance animations
      // This hook is for container-level effects if needed
    },
    { scope: containerRef, dependencies: [tasks.length, loading, error] }
  );

  // Loading state
  if (loading) {
    return (
      <Card className="mt-6">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-border-glass border-t-accent animate-spin" />
            </div>
            <span className="text-text-secondary text-sm">Loading tasks...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="mt-6">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Failed to load tasks
          </h3>
          <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">{error}</p>
          <Button variant="secondary" onClick={onRetry}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <Card className="mt-6">
        <EmptyState onCreateClick={onCreateClick} />
      </Card>
    );
  }

  // Task list
  return (
    <div ref={containerRef} className="mt-6 space-y-3">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
