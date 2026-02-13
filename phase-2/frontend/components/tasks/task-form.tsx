"use client";

/**
 * Task Form Component with Glassmorphism and GSAP Animations
 * Feature: 004-frontend-ui-redesign
 */

import { useState, useEffect, useRef } from "react";
import { Task, TaskCreate, TaskUpdate } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useGSAP, gsap } from "@/lib/gsap";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TaskForm({ task, onSubmit, onCancel, submitLabel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [errors, setErrors] = useState<{ title?: string; description?: string; submit?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!task;

  // Entrance animation
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !formRef.current) return;

      gsap.from(".form-field", {
        opacity: 0,
        y: 15,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: formRef }
  );

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }

    if (description && description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (!isEditMode) {
        setTitle("");
        setDescription("");
        titleInputRef.current?.focus();
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to save task",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="form-field">
        <Input
          ref={titleInputRef}
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          error={errors.title}
          disabled={submitting}
          maxLength={200}
        />
        <div className="mt-1.5 text-xs text-text-muted text-right">
          {title.length}/200
        </div>
      </div>

      <div className="form-field">
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
          error={errors.description}
          disabled={submitting}
          maxLength={1000}
          rows={3}
        />
        <div className="mt-1.5 text-xs text-text-muted text-right">
          {description.length}/1000
        </div>
      </div>

      {errors.submit && (
        <div className="form-field rounded-xl bg-error/10 border border-error/20 p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-error flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-error">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="form-field flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={submitting} loading={submitting}>
          {submitLabel || (isEditMode ? "Save Changes" : "Add Task")}
        </Button>
      </div>
    </form>
  );
}
