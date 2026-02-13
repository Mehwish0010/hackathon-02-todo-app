/**
 * Task entity types matching backend API schema
 * @see specs/003-frontend-api-integration/data-model.md
 */

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface TaskFormState {
  title: string;
  description: string;
  errors: {
    title?: string;
    description?: string;
    submit?: string;
  };
  submitting: boolean;
}
