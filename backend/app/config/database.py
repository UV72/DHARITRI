import sqlite3

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect("medical_dashboard.db")
    return conn

def init_database():
    """Initialize SQLite database with necessary tables"""
    conn = get_db_connection()
    c = conn.cursor()

    # User Reports Table
    c.execute(
        """CREATE TABLE IF NOT EXISTS user_reports
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id TEXT,
                  report_name TEXT,
                  upload_date DATETIME,
                  analysis_result TEXT,
                  doctor_notes TEXT,
                  doctor_approval INTEGER DEFAULT 0,
                  is_active INTEGER DEFAULT 1)"""
    )

    # User Table
    c.execute(
        """CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE,
                  password TEXT,
                  email TEXT,
                  role TEXT)"""
    )

    conn.commit()
    conn.close()