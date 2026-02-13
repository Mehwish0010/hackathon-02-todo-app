"""Test database connection to Neon PostgreSQL."""
import os
from dotenv import load_dotenv

# Load from .env.example if .env doesn't exist
if os.path.exists('.env'):
    load_dotenv('.env')
else:
    load_dotenv('.env.example')

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("[ERROR] DATABASE_URL not found in environment")
    exit(1)

print(f"[INFO] Testing connection to database...")
print(f"   URL: {DATABASE_URL[:50]}...")

try:
    import psycopg2

    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Test query
    cursor.execute("SELECT version();")
    version = cursor.fetchone()[0]

    print(f"[SUCCESS] Database connected successfully!")
    print(f"   PostgreSQL version: {version[:50]}...")

    # Check existing tables
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()

    if tables:
        print(f"\n[TABLES] Existing tables ({len(tables)}):")
        for table in tables:
            print(f"   - {table[0]}")
    else:
        print("\n[TABLES] No tables exist yet (database is empty)")

    cursor.close()
    conn.close()

except ImportError:
    print("[ERROR] psycopg2 not installed. Run: pip install psycopg2-binary")
except Exception as e:
    print(f"[ERROR] Connection failed: {e}")
