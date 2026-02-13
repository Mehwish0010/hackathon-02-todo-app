# Quickstart: Frontend Task Management Testing

**Feature**: 003-frontend-api-integration
**Date**: 2026-02-09

## Prerequisites

1. Backend server running at `http://localhost:8000` (from Spec 002)
2. Frontend dependencies installed
3. Environment variables configured

## Environment Setup

### Backend (.env)

```bash
cd backend
# Ensure .env exists with:
# JWT_SECRET=your-jwt-secret-minimum-32-characters-long
# DATABASE_URL=your-neon-connection-string
# CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)

```bash
cd frontend
# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret
DATABASE_URL=your-neon-connection-string
```

## Running the Application

### Terminal 1: Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Verify: `curl http://localhost:8000/health`

### Terminal 2: Frontend

```bash
cd frontend
npm install  # if not already done
npm run dev
```

Verify: Open `http://localhost:3000` in browser

## Testing Checklist

### Authentication Flow

- [ ] **Signup**: Navigate to `/signup`, create new account
  - Enter email: `test@example.com`
  - Enter password: `Password123` (min 8 chars)
  - Click Sign Up
  - Expected: Redirected to dashboard

- [ ] **Signin**: Navigate to `/signin`, login
  - Enter registered email and password
  - Click Sign In
  - Expected: Redirected to dashboard

- [ ] **Signout**: Click Sign Out button
  - Expected: Redirected to signin page

- [ ] **Protected Route**: Try accessing `/dashboard` while logged out
  - Expected: Redirected to signin page

### Task List View

- [ ] **Empty State**: Login with new user (no tasks)
  - Expected: Empty state message with "Create your first task" call-to-action

- [ ] **Task List Display**: After creating tasks
  - Expected: List shows all user's tasks
  - Each task shows: title, description (if present), completion checkbox
  - Tasks ordered by most recent first

### Task Creation

- [ ] **Create Task (Title Only)**:
  - Click "Add Task" or equivalent
  - Enter title: "My first task"
  - Submit
  - Expected: Task appears in list

- [ ] **Create Task (Title + Description)**:
  - Click "Add Task"
  - Enter title: "Task with description"
  - Enter description: "This is a detailed description"
  - Submit
  - Expected: Task appears in list with description visible

- [ ] **Validation - Empty Title**:
  - Try to submit form with empty title
  - Expected: Error message "Title is required"

- [ ] **Validation - Title Too Long**:
  - Enter title > 200 characters
  - Expected: Error message about character limit

### Task Completion Toggle

- [ ] **Mark Complete**:
  - Click checkbox on incomplete task
  - Expected: Visual indication (checkbox checked, strikethrough)
  - Refresh page: Status persists

- [ ] **Mark Incomplete**:
  - Click checkbox on completed task
  - Expected: Visual indication reversed
  - Refresh page: Status persists

### Task Editing

- [ ] **Edit Title**:
  - Click edit button on existing task
  - Change title to "Updated title"
  - Save
  - Expected: Title updated in list

- [ ] **Edit Description**:
  - Click edit button on existing task
  - Add/change description
  - Save
  - Expected: Description updated in list

- [ ] **Cancel Edit**:
  - Click edit button
  - Make changes
  - Click Cancel
  - Expected: No changes saved

- [ ] **Validation on Edit**:
  - Click edit button
  - Clear title field
  - Try to save
  - Expected: Error message, changes not saved

### Task Deletion

- [ ] **Delete with Confirmation**:
  - Click delete button on a task
  - Expected: Confirmation dialog appears
  - Click Confirm
  - Expected: Task removed from list

- [ ] **Cancel Delete**:
  - Click delete button
  - Click Cancel on confirmation
  - Expected: Task remains in list

- [ ] **Verify Deletion Persists**:
  - Delete a task
  - Refresh page
  - Expected: Deleted task does not reappear

### Error Handling

- [ ] **Network Error**:
  - Stop backend server
  - Try to create/update task
  - Expected: Friendly error message, retry option

- [ ] **Session Expiry**:
  - Clear browser storage/cookies while on dashboard
  - Try any action
  - Expected: Redirect to signin

### Responsive Design

- [ ] **Mobile (320px - 480px)**:
  - Resize browser or use dev tools
  - All elements visible and usable
  - No horizontal scroll
  - Touch targets adequate size

- [ ] **Tablet (481px - 1024px)**:
  - Resize browser
  - Layout adjusts appropriately
  - Forms are usable

- [ ] **Desktop (1025px+)**:
  - Full layout displayed
  - Good use of available space

## End-to-End Flow

Complete this sequence to verify full integration:

1. **Start fresh**: Clear browser data, ensure no existing session
2. **Signup**: Create account at `/signup`
3. **Verify dashboard**: See empty state
4. **Create 3 tasks**:
   - "Buy groceries"
   - "Finish report" with description "Due by Friday"
   - "Call mom"
5. **Toggle completion**: Mark "Buy groceries" complete
6. **Edit task**: Change "Call mom" to "Call family"
7. **Delete task**: Remove "Finish report"
8. **Signout**: Click sign out
9. **Signin**: Login again
10. **Verify state**: Should see 2 tasks, "Buy groceries" completed, "Call family" exists

## Troubleshooting

### "Unauthorized" Errors

- Check backend is running
- Verify JWT_SECRET matches in both frontend and backend
- Clear browser cookies and re-login

### Tasks Not Loading

- Check browser console for errors
- Verify API URL is correct in .env.local
- Check network tab for API responses

### CORS Errors

- Verify backend CORS_ORIGINS includes `http://localhost:3000`
- Restart backend after changing .env

### Session Not Persisting

- Check BETTER_AUTH_SECRET is set
- Verify DATABASE_URL is correct (Better Auth stores sessions)
- Check browser allows cookies

## Success Criteria Verification

| Criteria | How to Verify |
|----------|---------------|
| SC-001: Flow under 3 min | Time yourself doing signup-signin-create-signout |
| SC-002: Load under 2s | Check network tab for list load time |
| SC-003: CRUD accuracy | Create→Read→Update→Delete, verify each step |
| SC-004: Responsive | Test at 320px, 768px, 1920px widths |
| SC-005: Auth redirect | Access /dashboard logged out, should redirect |
| SC-006: UI updates < 1s | Observe responsiveness of create/update/delete |
| SC-007: Signin works | Login with valid credentials first try |
| SC-008: Validation works | Try empty title, short password |
