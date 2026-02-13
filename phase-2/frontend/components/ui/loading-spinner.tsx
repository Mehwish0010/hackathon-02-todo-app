"use client";

/**
 * Loading Spinner Component with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 *
 * An animated loading spinner with multiple size variants
 * and optional label text.
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  label,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-2",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          border-border-glass
          border-t-accent
          animate-spin
        `}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && (
        <span className={`${textSizeClasses[size]} text-text-secondary`}>
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Full-page loading overlay with glassmorphism backdrop
 */
interface LoadingOverlayProps {
  label?: string;
}

export function LoadingOverlay({ label = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-bg-glass border border-border-glass shadow-glass-lg">
        <LoadingSpinner size="lg" />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
    </div>
  );
}

/**
 * Inline loading indicator for buttons or small areas
 */
interface InlineLoaderProps {
  className?: string;
}

export function InlineLoader({ className = "" }: InlineLoaderProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
    </div>
  );
}

/**
 * Skeleton loading placeholder with shimmer effect
 */
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        bg-gradient-to-r from-bg-glass via-bg-glass-hover to-bg-glass
        bg-[length:200%_100%]
        animate-shimmer
        ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
