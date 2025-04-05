from datetime import datetime
from typing import Dict, Any

class User:
    def __init__(self, id: int, username: str, password: str, email: str, role: str):
        self.id = id
        self.username = username
        self.password = password
        self.email = email
        self.role = role
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        return cls(
            id=data["id"],
            username=data["username"],
            password=data["password"],
            email=data["email"],
            role=data["role"]
        )

class Report:
    def __init__(
        self, 
        id: int, 
        user_id: str, 
        report_name: str, 
        upload_date: datetime, 
        analysis_result: str, 
        doctor_notes: str = None, 
        doctor_approval: bool = False
    ):
        self.id = id
        self.user_id = user_id
        self.report_name = report_name
        self.upload_date = upload_date
        self.analysis_result = analysis_result
        self.doctor_notes = doctor_notes
        self.doctor_approval = doctor_approval
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        return cls(
            id=data["id"],
            user_id=data["user_id"],
            report_name=data["report_name"],
            upload_date=datetime.strptime(data["upload_date"], "%Y-%m-%d %H:%M:%S.%f") if isinstance(data["upload_date"], str) else data["upload_date"],
            analysis_result=data["analysis_result"],
            doctor_notes=data["doctor_notes"],
            doctor_approval=bool(data["doctor_approval"])
        )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "report_name": self.report_name,
            "upload_date": str(self.upload_date),
            "analysis_result": self.analysis_result,
            "doctor_notes": self.doctor_notes,
            "doctor_approval": self.doctor_approval
        }