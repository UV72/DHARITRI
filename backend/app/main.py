from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth, reports, diet
from app.config.database import init_database

app = FastAPI(title="DHARITRI - Digital Health Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://192.168.1.7:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(diet.router)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()

# Basic health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}