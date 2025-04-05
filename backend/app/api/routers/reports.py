from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from typing import List, Dict, Any, Optional
from datetime import datetime
import io
from app.api.dependencies import get_current_user, get_current_doctor
from app.schemas.reports import UpdateReportRequest
from app.db.crud import (
    save_report_analysis,
    get_user_reports,
    doctor_update_report,
    get_pending_reports,
    get_all_patient_reports
)
from app.services.pdf_processor import get_pdf_text, get_text_chunks
from app.services.vector_store import get_vector_store
from app.services.ai_service import get_medical_analysis
from app.core.email import send_email
from app.config.settings import DOCTOR_EMAIL

router = APIRouter(tags=["reports"])

@router.post("/reports/analyze")
async def analyze_report(
    files: List[UploadFile] = File(...), current_user: dict = Depends(get_current_user)
):
    """Endpoint to analyze medical reports"""
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    # Process first PDF file
    pdf_file = files[0]
    pdf_content = await pdf_file.read()
    pdf_io = io.BytesIO(pdf_content)

    # Extract text from PDF
    raw_text = get_pdf_text(pdf_io)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)

    # Generate analysis
    analysis_result = get_medical_analysis(text_chunks)

    # Save analysis to database
    report_id = save_report_analysis(
        current_user["username"], pdf_file.filename, analysis_result
    )

    # Send email to doctor
    send_email(DOCTOR_EMAIL, analysis_result, pdf_content, pdf_file.filename)

    return {
        "report_id": report_id,
        "analysis": analysis_result,
        "message": f"Report sent to {DOCTOR_EMAIL}",
    }

@router.get("/reports", response_model=List[Dict[str, Any]])
async def get_reports(current_user: dict = Depends(get_current_user)):
    """Endpoint to get all reports for the current user"""
    reports = get_user_reports(current_user["username"])
    return reports

@router.get("/reports/pending", response_model=List[Dict[str, Any]])
async def get_pending_reports_endpoint(
    current_user: dict = Depends(get_current_doctor),
):
    """Endpoint to get all reports pending approval"""
    reports = get_pending_reports()
    return reports

@router.put("/reports/{report_id}")
async def update_report(
    report_id: int,
    request: UpdateReportRequest,
    current_user: dict = Depends(get_current_doctor),
):
    """Endpoint to update report with doctor notes and approval"""
    doctor_update_report(report_id, request.notes, request.approval)
    return {"message": "Report updated successfully"}

@router.get("/reports/all", response_model=List[Dict[str, Any]])
async def get_all_reports(
    current_user: dict = Depends(get_current_doctor),
    name_filter: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
):
    """Endpoint to get all patient reports with filtering options"""
    reports = get_all_patient_reports()

    # Apply filters if provided
    filtered_reports = reports

    if name_filter:
        filtered_reports = [
            report
            for report in filtered_reports
            if name_filter.lower() in report["username"].lower()
        ]

    if start_date:
        start_datetime = datetime.fromisoformat(start_date)
        filtered_reports = [
            report
            for report in filtered_reports
            if datetime.strptime(report["upload_date"], "%Y-%m-%d %H:%M:%S.%f")
            >= start_datetime
        ]

    if end_date:
        end_datetime = datetime.fromisoformat(end_date)
        filtered_reports = [
            report
            for report in filtered_reports
            if datetime.strptime(report["upload_date"], "%Y-%m-%d %H:%M:%S.%f")
            <= end_datetime
        ]

    return filtered_reports