---
name: backend-skill
description: Generate REST API routes, handle requests/responses, and connect to databases. Use when user needs backend server implementation.
---

# Backend Development

## Instructions

Build backend servers with these features:

1. **Route Generation**
   - RESTful API endpoints
   - Route organization and grouping
   - Middleware integration
   - Error handling

2. **Request/Response Handling**
   - Parse request body, params, query
   - Validation and sanitization
   - JSON responses
   - Status codes
   - Error responses

3. **Database Connection**
   - Connection pooling
   - ORM integration (Prisma, Drizzle)
   - Query optimization
   - Transaction support

## Example Code

### Express Server Setup
```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Route Examples
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await db.user.findMany();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.params.id }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create user
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await db.user.create({
      data: { name, email }
    });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const user = await db.user.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await db.user.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### Database Connection (Prisma)
```javascript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}
```

```javascript
// db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
```

### Request Validation Middleware
```javascript
const validateUser = (req, res, next) => {
  const { email, name } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  
  next();
};

router.post('/', validateUser, async (req, res) => {
  // Create user
});
```

## Best Practices

- Use async/await for DB operations
- Implement proper error handling
- Validate all inputs
- Use environment variables for config
- Close DB connections properly
- Use connection pooling
- Implement rate limiting
- Add logging and monitoring
- Use HTTP status codes correctly
- Keep routes RESTful and organized