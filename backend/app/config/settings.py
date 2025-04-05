import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Constants
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
DOCTOR_EMAIL = os.getenv("DOCTOR_EMAIL", "202411019@daiict.ac.in")
SECRET_KEY = os.getenv("SECRET_KEY", "yoursecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

# Configure Google AI
genai.configure(api_key=GOOGLE_API_KEY)