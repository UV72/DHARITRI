import smtplib
from email.message import EmailMessage
from app.config.settings import SENDER_EMAIL, SENDER_PASSWORD

def send_email(doctor_email, analysis_text, pdf_content, filename):
    """Send email with report analysis to doctor"""
    msg = EmailMessage()
    msg["Subject"] = "Patient Report Analysis"
    msg["From"] = SENDER_EMAIL
    msg["To"] = doctor_email
    msg.set_content(
        f"Dear Doctor,\n\nHere is the AI-generated medical report analysis:\n\n{analysis_text}\n\nBest Regards,\nAI Medical Assistant"
    )

    # Attach PDF
    msg.add_attachment(
        pdf_content, maintype="application", subtype="pdf", filename=filename
    )

    # Send email
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)