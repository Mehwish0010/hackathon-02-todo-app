"use client";

/**
 * Task Item Component with Glassmorphism and GSAP Animations
 * Feature: 004-frontend-ui-redesign
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Task } from "@/types/task";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, previousState: boolean) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  index?: number;
}

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  index = 0,
}: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const hasAnimatedIn = useRef(false);

  // Entrance animation on mount
  useEffect(() => {
    if (!itemRef.current || prefersReducedMotion || hasAnimatedIn.current) return;

    hasAnimatedIn.current = true;

    gsap.fromTo(
      itemRef.current,
      { opacity: 0, y: 20, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        delay: index * 0.05,
        ease: "power3.out",
      }
    );
  }, [index, prefersReducedMotion]);

  // Animate exit (called before delete)
  const animateExit = useCallback(
    (onComplete: () => void) => {
      if (!itemRef.current || prefersReducedMotion) {
        onComplete();
        return;
      }

      gsap.to(itemRef.current, {
        opacity: 0,
        x: -20,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete,
      });
    },
    [prefersReducedMotion]
  );

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);

    // Animate the toggle
    if (!prefersReducedMotion && contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: task.completed ? 1 : 0.6,
        duration: 0.2,
        ease: "power2.out",
      });
    }

    try {
      await onToggleComplete(task.id, task.completed);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = () => {
    animateExit(() => onDelete(task));
  };

  // Hover animation
  const handleMouseEnter = () => {
    if (!prefersReducedMotion && itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 1.01,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion && itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 1,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={itemRef}
      className={`
        group relative
        p-4 rounded-xl
        bg-bg-glass backdrop-blur-glass
        border border-border-glass
        transition-colors duration-normal
        hover:bg-bg-glass-hover hover:border-border-glass-hover
        ${task.completed ? "opacity-60" : ""}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={contentRef} className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isToggling}
            className={`
              w-5 h-5 rounded-md
              border-2 flex items-center justify-center
              transition-all duration-fast
              focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                task.completed
                  ? "bg-accent border-accent"
                  : "border-border-glass hover:border-accent"
              }
            `}
            aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
          >
            {task.completed && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`
              text-sm font-medium transition-all duration-normal
              ${
                task.completed
                  ? "text-text-muted line-through"
                  : "text-text-primary"
              }
            `}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`
                mt-1 text-sm line-clamp-2
                transition-colors duration-normal
                ${task.completed ? "text-text-muted" : "text-text-secondary"}
              `}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="
              p-2 rounded-lg
              text-text-muted hover:text-accent
              hover:bg-bg-glass
              transition-all duration-fast
              focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
            "
            aria-label={`Edit "${task.title}"`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="
              p-2 rounded-lg
              text-text-muted hover:text-error
              hover:bg-error/10
              transition-all duration-fast
              focus:outline-none focus-visible:ring-2 focus-visible:ring-error
            "
            aria-label={`Delete "${task.title}"`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Completed indicator line */}
      {task.completed && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-success rounded-l-xl" />
      )}
    </div>
  );
}
