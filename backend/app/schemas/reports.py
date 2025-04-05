from pydantic import BaseModel
from typing import Optional

class ReportAnalysisRequest(BaseModel):
    user_id: str

class DietConsultationRequest(BaseModel):
    question: str
    report_text: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    user_id: str
    report_name: str
    upload_date: str
    analysis_result: str
    doctor_notes: Optional[str]
    doctor_approval: bool

class UpdateReportRequest(BaseModel):
    notes: str
    approval: bool