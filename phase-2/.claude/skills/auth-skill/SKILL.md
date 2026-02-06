---
name: auth-skill
description: Authentication implementation with signup, signin, password hashing, JWT tokens, and Better Auth integration. Use when user needs authentication features.
---

# Authentication Implementation

## Instructions

Build authentication systems with these features:

1. **User Registration (Signup)**
   - Email/password validation
   - Unique user checks
   - Password strength requirements
   - bcrypt password hashing (10+ rounds)

2. **User Login (Signin)**
   - Credential verification
   - Password comparison with bcrypt
   - JWT token generation
   - Secure session management

3. **JWT Token Management**
   - Access tokens (short-lived, 15min-1hr)
   - Refresh tokens (long-lived, 7-30 days)
   - Secure token storage
   - Token verification middleware

4. **Better Auth Integration**
   - OAuth providers (Google, GitHub, etc.)
   - Magic link authentication
   - Multi-factor authentication
   - Session management

## Example Code

### Password Hashing (bcrypt)
```javascript
const bcrypt = require('bcrypt');

// Signup
const hashedPassword = await bcrypt.hash(password, 12);

// Signin
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Token Generation
```javascript
const jwt = require('jsonwebtoken');

// Generate tokens
const accessToken = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

### Better Auth Setup
```javascript
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: prisma,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
```

### Protected Route Middleware
```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

## Security Best Practices

- Never store passwords in plain text
- Use HTTPS in production
- Set secure HTTP-only cookies for tokens
- Implement rate limiting on auth endpoints
- Use environment variables for secrets
- Add CSRF protection
- Implement account lockout after failed attempts