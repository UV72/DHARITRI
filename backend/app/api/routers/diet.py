from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.schemas.reports import DietConsultationRequest
from app.services.ai_service import ask_diet_question

router = APIRouter(tags=["diet"])

@router.post("/diet/consult")
async def diet_consultation(
    request: DietConsultationRequest, current_user: dict = Depends(get_current_user)
):
    """Endpoint for diet consultation questions"""
    # Use provided report text or generic context
    report_context = request.report_text or "No specific medical report uploaded."

    # Generate response
    response = ask_diet_question(request.question, report_context)

    return {"question": request.question, "answer": response}