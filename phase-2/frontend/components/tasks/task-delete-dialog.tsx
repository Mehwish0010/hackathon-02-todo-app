"use client";

/**
 * Task Delete Dialog with Glassmorphism and Animations
 * Feature: 004-frontend-ui-redesign
 */

import { useState } from "react";
import { Task } from "@/types/task";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface TaskDeleteDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void>;
}

export function TaskDeleteDialog({
  task,
  isOpen,
  onClose,
  onConfirm,
}: TaskDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!task) return;

    setDeleting(true);
    setError(null);

    try {
      await onConfirm(task.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Task"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={deleting}
            loading={deleting}
          >
            Delete
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>

        {task && (
          <div className="rounded-xl bg-bg-glass border border-border-glass p-4">
            <p className="text-sm font-medium text-text-primary">{task.title}</p>
            {task.description && (
              <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-error/10 border border-error/20 p-4 animate-fade-in">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
