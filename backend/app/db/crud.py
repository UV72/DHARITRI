import sqlite3
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.config.database import get_db_connection
from app.core.security import hash_password
from app.db.models import User, Report

def get_user(username: str):
    """Get user from database by username"""
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=?", (username,))
    user = c.fetchone()
    conn.close()

    if user:
        return {
            "id": user[0],
            "username": user[1],
            "password": user[2],
            "email": user[3],
            "role": user[4],
        }
    return None

def authenticate_user(username: str, password: str):
    """Authenticate user with username and password"""
    user = get_user(username)
    if not user:
        return False
    if user["password"] != hash_password(password):
        return False
    return user

def register_user(username: str, password: str, email: str, role: str):
    """Register a new user"""
    conn = get_db_connection()
    c = conn.cursor()

    hashed_password = hash_password(password)
    try:
        c.execute(
            "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
            (username, hashed_password, email, role),
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def save_report_analysis(user_id: str, report_name: str, analysis_result: str):
    """Save report analysis to database"""
    conn = get_db_connection()
    c = conn.cursor()

    c.execute(
        """INSERT INTO user_reports 
                 (user_id, report_name, upload_date, analysis_result) 
                 VALUES (?, ?, ?, ?)""",
        (user_id, report_name, datetime.now(), analysis_result),
    )

    report_id = c.lastrowid
    conn.commit()
    conn.close()
    return report_id

def get_user_reports(user_id: str):
    """Get all reports for a user"""
    conn = get_db_connection()
    c = conn.cursor()

    c.execute(
        """SELECT * FROM user_reports 
                 WHERE user_id=? AND is_active=1 
                 ORDER BY upload_date DESC""",
        (user_id,),
    )
    reports = c.fetchall()
    conn.close()

    result = []
    for report in reports:
        result.append(
            {
                "id": report[0],
                "user_id": report[1],
                "report_name": report[2],
                "upload_date": report[3],
                "analysis_result": report[4],
                "doctor_notes": report[5],
                "doctor_approval": bool(report[6]),
            }
        )
    return result

def doctor_update_report(report_id: int, notes: str, approval: bool):
    """Update report with doctor notes and approval"""
    conn = get_db_connection()
    c = conn.cursor()

    c.execute(
        """UPDATE user_reports 
                 SET doctor_notes=?, doctor_approval=? 
                 WHERE id=?""",
        (notes, 1 if approval else 0, report_id),
    )

    conn.commit()
    conn.close()

def get_pending_reports():
    """Get all reports pending doctor approval"""
    conn = get_db_connection()
    c = conn.cursor()

    c.execute(
        """SELECT * FROM user_reports 
                 WHERE doctor_approval=0 
                 ORDER BY upload_date DESC"""
    )
    reports = c.fetchall()
    conn.close()

    result = []
    for report in reports:
        result.append(
            {
                "id": report[0],
                "user_id": report[1],
                "report_name": report[2],
                "upload_date": report[3],
                "analysis_result": report[4],
                "doctor_notes": report[5],
                "doctor_approval": bool(report[6]),
            }
        )
    return result

def get_all_patient_reports():
    """Get all patient reports with user information"""
    conn = get_db_connection()
    c = conn.cursor()

    c.execute(
        """SELECT 
            user_reports.id, 
            users.username, 
            users.email, 
            user_reports.report_name, 
            user_reports.upload_date, 
            user_reports.analysis_result, 
            user_reports.doctor_notes, 
            user_reports.doctor_approval 
        FROM user_reports 
        JOIN users ON user_reports.user_id = users.username 
        ORDER BY user_reports.upload_date DESC"""
    )
    reports = c.fetchall()
    conn.close()

    result = []
    for report in reports:
        result.append(
            {
                "id": report[0],
                "username": report[1],
                "email": report[2],
                "report_name": report[3],
                "upload_date": report[4],
                "analysis_result": report[5],
                "doctor_notes": report[6],
                "doctor_approval": bool(report[7]),
            }
        )
    return result