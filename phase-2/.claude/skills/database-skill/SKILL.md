---
name: database-skill
description: Design database schemas, create tables, and write migrations. Use when user needs help with database structure, SQL table definitions, migrations, or schema design patterns.
---

# Database Schema Design & Migrations

## Instructions

### 1. Schema Design Principles
- **Normalization**: Follow 3NF (Third Normal Form) unless denormalization is justified
- **Naming conventions**: Use snake_case for tables/columns, plural for table names
- **Primary keys**: Always use `id` as primary key (bigint/UUID)
- **Timestamps**: Include `created_at` and `updated_at` on all tables
- **Foreign keys**: Name as `{referenced_table}_id` with proper constraints
- **Indexes**: Add indexes on foreign keys and frequently queried columns

### 2. Table Creation Best Practices

**PostgreSQL Example:**
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

**MySQL Example:**
```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Migration Patterns

**Up/Down Migration Structure:**
```sql
-- Migration: 001_create_users_table.sql
-- Up
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Down
DROP TABLE IF EXISTS users;
```

**Adding Columns:**
```sql
-- Up
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN country_code VARCHAR(2);

-- Down
ALTER TABLE users 
DROP COLUMN phone,
DROP COLUMN country_code;
```

**Adding Indexes:**
```sql
-- Up
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_country_code ON users(country_code);

-- Down
DROP INDEX IF EXISTS idx_users_created_at;
DROP INDEX IF EXISTS idx_users_country_code;
```

### 4. Relationship Patterns

**One-to-Many:**
```sql
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
```

**Many-to-Many:**
```sql
CREATE TABLE users_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_roles_user_id ON users_roles(user_id);
CREATE INDEX idx_users_roles_role_id ON users_roles(role_id);
```

**One-to-One:**
```sql
CREATE TABLE user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url VARCHAR(500),
  date_of_birth DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

### 5. Common Data Types Guide

**PostgreSQL:**
- Text: `VARCHAR(n)`, `TEXT`, `CHAR(n)`
- Numbers: `INTEGER`, `BIGINT`, `DECIMAL(p,s)`, `NUMERIC`
- Boolean: `BOOLEAN`
- Dates: `DATE`, `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`
- JSON: `JSON`, `JSONB` (prefer JSONB)
- Arrays: `INTEGER[]`, `TEXT[]`
- UUID: `UUID`

**MySQL:**
- Text: `VARCHAR(n)`, `TEXT`, `CHAR(n)`
- Numbers: `INT`, `BIGINT`, `DECIMAL(p,s)`, `FLOAT`, `DOUBLE`
- Boolean: `BOOLEAN` (alias for `TINYINT(1)`)
- Dates: `DATE`, `DATETIME`, `TIMESTAMP`
- JSON: `JSON`

### 6. Constraint Patterns

```sql
-- NOT NULL constraint
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- UNIQUE constraint
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

-- CHECK constraint
ALTER TABLE products 
ADD CONSTRAINT chk_products_price CHECK (price >= 0);

-- DEFAULT constraint
ALTER TABLE users ALTER COLUMN is_active SET DEFAULT true;

-- Composite unique constraint
ALTER TABLE order_items 
ADD CONSTRAINT uq_order_items_order_product UNIQUE (order_id, product_id);
```

### 7. Soft Delete Pattern

```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Query active records
SELECT * FROM users WHERE deleted_at IS NULL;

-- Soft delete
UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = 123;
```

### 8. Enum/Lookup Tables

**Using ENUM (PostgreSQL):**
```sql
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'banned');

ALTER TABLE users ADD COLUMN status user_status DEFAULT 'active';
```

**Using Lookup Table (Recommended):**
```sql
CREATE TABLE user_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

INSERT INTO user_statuses (name, description) VALUES
  ('active', 'User account is active'),
  ('inactive', 'User account is inactive'),
  ('suspended', 'User account is temporarily suspended'),
  ('banned', 'User account is permanently banned');

ALTER TABLE users ADD COLUMN status_id INTEGER REFERENCES user_statuses(id);
```

### 9. Audit Trail Pattern

```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id BIGINT NOT NULL,
  action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  user_id BIGINT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);
```

### 10. Performance Optimization

**Partial Indexes:**
```sql
-- Index only active users
CREATE INDEX idx_users_active ON users(email) WHERE is_active = true;
```

**Composite Indexes:**
```sql
-- For queries filtering by user_id and created_at
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
```

**Full-Text Search (PostgreSQL):**
```sql
ALTER TABLE posts ADD COLUMN search_vector tsvector;

CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Update trigger for search vector
CREATE TRIGGER posts_search_update 
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', title, content);
```

## Framework-Specific Migration Examples

### Django (Python)
```python
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [('app', '0001_initial')]
    
    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('user', models.ForeignKey('User', on_delete=models.CASCADE)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddIndex(
            model_name='post',
            index=models.Index(fields=['user', '-created_at'], name='idx_post_user_created'),
        ),
    ]
```

### Rails (Ruby)
```ruby
class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :content
      t.timestamps
    end
    
    add_index :posts, [:user_id, :created_at]
  end
end
```

### Prisma (Node.js)
```prisma
model Post {
  id        BigInt   @id @default(autoincrement())
  title     String   @db.VarChar(255)
  content   String?  @db.Text
  userId    BigInt   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@index([userId, createdAt(sort: Desc)])
  @@map("posts")
}
```

## Checklist for Schema Design
- [ ] All tables have primary keys
- [ ] Foreign key constraints are defined with appropriate ON DELETE/UPDATE actions
- [ ] Indexes added on foreign keys and frequently queried columns
- [ ] NOT NULL constraints on required fields
- [ ] UNIQUE constraints on fields that should be unique
- [ ] Default values specified where appropriate
- [ ] Timestamps (created_at, updated_at) included
- [ ] Data types are appropriate for the data
- [ ] Column names follow naming conventions
- [ ] Migration has both UP and DOWN scripts
- [ ] Consider partitioning for large tables (>10M rows)
- [ ] Consider archiving strategy for historical data