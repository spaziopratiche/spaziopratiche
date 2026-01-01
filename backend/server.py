from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
SECRET_KEY = os.environ.get('JWT_SECRET', secrets.token_hex(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# =====================
# MODELS
# =====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Contact Form Models
class ContactRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(...)
    phone: Optional[str] = Field(None, max_length=20)
    service: str = Field(...)
    message: str = Field(..., min_length=10, max_length=2000)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = Field(default="new")

class ContactRequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str
    phone: Optional[str] = None
    service: str
    message: str = Field(..., min_length=10, max_length=2000)

class ContactResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None

# User/Agency Models
class UserCreate(BaseModel):
    # Referente
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: str
    # Agenzia
    agency_name: str = Field(..., min_length=2, max_length=100)
    agency_address: str = Field(..., min_length=5, max_length=200)
    # Fatturazione
    partita_iva: str = Field(..., min_length=11, max_length=11)
    sede_legale: str = Field(..., min_length=5, max_length=200)
    codice_univoco: str = Field(..., min_length=6, max_length=7)
    # Credenziali
    username: str = Field(..., min_length=4, max_length=30)
    password: str = Field(..., min_length=6)

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: str
    agency_name: str
    agency_address: str
    partita_iva: str
    sede_legale: str
    codice_univoco: str
    username: str
    hashed_password: str
    is_verified: bool = False
    verification_token: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    agency_name: str
    agency_address: str
    username: str
    is_verified: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Appointment Models
class AppointmentCreate(BaseModel):
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    notes: Optional[str] = None

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    agency_name: str
    date: str
    time: str
    duration_minutes: int = 45
    notes: Optional[str] = None
    status: str = "confirmed"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TimeSlot(BaseModel):
    time: str
    available: bool

class DayAvailability(BaseModel):
    date: str
    slots: List[TimeSlot]

# =====================
# AUTH HELPERS
# =====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token non valido")
        
        user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user_doc is None:
            raise HTTPException(status_code=401, detail="Utente non trovato")
        
        return User(**user_doc)
    except JWTError:
        raise HTTPException(status_code=401, detail="Token non valido")

# =====================
# EXISTING ROUTES
# =====================

@api_router.get("/")
async def root():
    return {"message": "Spaziopratiche API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(input: ContactRequestCreate):
    try:
        contact_dict = input.model_dump()
        contact_obj = ContactRequest(**contact_dict)
        doc = contact_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.contact_requests.insert_one(doc)
        return ContactResponse(
            success=True,
            message="Richiesta inviata con successo! Ti contatteremo presto.",
            id=contact_obj.id
        )
    except Exception as e:
        logging.error(f"Error submitting contact: {e}")
        raise HTTPException(status_code=500, detail="Errore nell'invio della richiesta")

@api_router.get("/contacts", response_model=List[ContactRequest])
async def get_contacts():
    contacts = await db.contact_requests.find({}, {"_id": 0}).to_list(1000)
    for contact in contacts:
        if isinstance(contact['created_at'], str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

# =====================
# AUTH ROUTES
# =====================

@api_router.post("/auth/register")
async def register(input: UserCreate):
    # Check if username exists
    existing_user = await db.users.find_one({"username": input.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username già in uso")
    
    # Check if email exists
    existing_email = await db.users.find_one({"email": input.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email già registrata")
    
    # Create user
    verification_token = secrets.token_urlsafe(32)
    user = User(
        first_name=input.first_name,
        last_name=input.last_name,
        email=input.email,
        agency_name=input.agency_name,
        agency_address=input.agency_address,
        partita_iva=input.partita_iva,
        sede_legale=input.sede_legale,
        codice_univoco=input.codice_univoco,
        username=input.username,
        hashed_password=hash_password(input.password),
        verification_token=verification_token,
        is_verified=True  # Per demo, auto-verificato
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # In produzione qui invieremmo l'email di verifica
    # Per la demo, l'utente è già verificato
    
    return {
        "success": True,
        "message": "Registrazione completata! Ora puoi accedere.",
        "verification_token": verification_token  # Solo per demo
    }

@api_router.get("/auth/verify/{token}")
async def verify_email(token: str):
    user = await db.users.find_one({"verification_token": token})
    if not user:
        raise HTTPException(status_code=400, detail="Token non valido")
    
    await db.users.update_one(
        {"verification_token": token},
        {"$set": {"is_verified": True, "verification_token": None}}
    )
    
    return {"success": True, "message": "Email verificata con successo!"}

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(input: UserLogin):
    user_doc = await db.users.find_one({"username": input.username}, {"_id": 0})
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="Credenziali non valide")
    
    if not verify_password(input.password, user_doc['hashed_password']):
        raise HTTPException(status_code=401, detail="Credenziali non valide")
    
    if not user_doc.get('is_verified', False):
        raise HTTPException(status_code=401, detail="Email non verificata. Controlla la tua casella di posta.")
    
    access_token = create_access_token({"sub": user_doc['id']})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_doc['id'],
            first_name=user_doc['first_name'],
            last_name=user_doc['last_name'],
            email=user_doc['email'],
            agency_name=user_doc['agency_name'],
            agency_address=user_doc['agency_address'],
            username=user_doc['username'],
            is_verified=user_doc['is_verified']
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        agency_name=current_user.agency_name,
        agency_address=current_user.agency_address,
        username=current_user.username,
        is_verified=current_user.is_verified
    )

# =====================
# APPOINTMENT ROUTES
# =====================

def generate_time_slots():
    """Generate all possible time slots from 09:00 to 18:00 (45 min each)"""
    slots = []
    start_hour = 9
    end_hour = 18
    
    current = datetime.strptime(f"{start_hour}:00", "%H:%M")
    end = datetime.strptime(f"{end_hour}:00", "%H:%M")
    
    while current < end:
        # Check if there's enough time for a 45 min appointment
        end_time = current + timedelta(minutes=45)
        if end_time <= end:
            slots.append(current.strftime("%H:%M"))
        current = current + timedelta(minutes=45)
    
    return slots

@api_router.get("/appointments/availability/{date}", response_model=DayAvailability)
async def get_availability(date: str, current_user: User = Depends(get_current_user)):
    """Get available time slots for a specific date"""
    # Validate date format
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato data non valido. Usa YYYY-MM-DD")
    
    # Don't allow past dates
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    if date_obj < today:
        raise HTTPException(status_code=400, detail="Non puoi prenotare date passate")
    
    # Don't allow weekends
    if date_obj.weekday() >= 5:
        return DayAvailability(date=date, slots=[])
    
    # Get all time slots
    all_slots = generate_time_slots()
    
    # Get booked appointments for this date
    booked = await db.appointments.find(
        {"date": date, "status": {"$ne": "cancelled"}},
        {"_id": 0, "time": 1}
    ).to_list(100)
    
    booked_times = {apt['time'] for apt in booked}
    
    # Build availability response
    slots = []
    for time_slot in all_slots:
        slots.append(TimeSlot(
            time=time_slot,
            available=time_slot not in booked_times
        ))
    
    return DayAvailability(date=date, slots=slots)

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(input: AppointmentCreate, current_user: User = Depends(get_current_user)):
    """Create a new appointment"""
    # Validate date
    try:
        date_obj = datetime.strptime(input.date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato data non valido")
    
    # Check if slot is available
    existing = await db.appointments.find_one({
        "date": input.date,
        "time": input.time,
        "status": {"$ne": "cancelled"}
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Questo slot è già prenotato")
    
    # Validate time slot
    valid_slots = generate_time_slots()
    if input.time not in valid_slots:
        raise HTTPException(status_code=400, detail="Orario non valido")
    
    # Create appointment
    appointment = Appointment(
        user_id=current_user.id,
        user_name=f"{current_user.first_name} {current_user.last_name}",
        agency_name=current_user.agency_name,
        date=input.date,
        time=input.time,
        notes=input.notes
    )
    
    doc = appointment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.appointments.insert_one(doc)
    
    return appointment

@api_router.get("/appointments/my", response_model=List[Appointment])
async def get_my_appointments(current_user: User = Depends(get_current_user)):
    """Get current user's appointments"""
    appointments = await db.appointments.find(
        {"user_id": current_user.id, "status": {"$ne": "cancelled"}},
        {"_id": 0}
    ).sort("date", 1).to_list(100)
    
    for apt in appointments:
        if isinstance(apt.get('created_at'), str):
            apt['created_at'] = datetime.fromisoformat(apt['created_at'])
    
    return appointments

@api_router.delete("/appointments/{appointment_id}")
async def cancel_appointment(appointment_id: str, current_user: User = Depends(get_current_user)):
    """Cancel an appointment"""
    apt = await db.appointments.find_one({"id": appointment_id, "user_id": current_user.id})
    
    if not apt:
        raise HTTPException(status_code=404, detail="Appuntamento non trovato")
    
    await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": "cancelled"}}
    )
    
    return {"success": True, "message": "Appuntamento cancellato"}

# =====================
# APP SETUP
# =====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
