import uuid
import hashlib
import secrets
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from backend.db.memory_store import USERS, LOYALTY_ACCOUNTS

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)

# In-memory session store: token -> user_id
SESSIONS: dict[str, str] = {}


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> dict | None:
    """Extract current user from Bearer token. Returns None if not authenticated."""
    if not credentials:
        return None
    token = credentials.credentials
    user_id = SESSIONS.get(token)
    if not user_id:
        return None
    for u in USERS:
        if u["id"] == user_id:
            return u
    return None


def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Require authentication. Raises 401 if not authenticated."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    user_id = SESSIONS.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    for u in USERS:
        if u["id"] == user_id:
            return u
    raise HTTPException(status_code=401, detail="User not found")


class SignupRequest(BaseModel):
    email: str
    password: str
    home_airport: str = "CLT"


class LoginRequest(BaseModel):
    email: str
    password: str


class UpdateProfileRequest(BaseModel):
    home_airport: str | None = None
    pax_default: int | None = None
    budget_max: int | None = None
    max_flight_minutes: int | None = None
    interests: list[str] | None = None
    points_first: bool | None = None


@router.post("/signup")
async def signup(req: SignupRequest):
    # Check if email already exists
    for u in USERS:
        if u["email"] == req.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "id": str(uuid.uuid4()),
        "email": req.email,
        "password_hash": hash_password(req.password),
        "home_airport": req.home_airport,
        "pax_default": 1,
        "budget_max": 300,
        "max_flight_minutes": 120,
        "interests": [],
        "points_first": True,
    }
    USERS.append(user)

    # Create default loyalty accounts
    for program, balance in [("Hilton Honors", 0), ("Amex MR", 0), ("Chase UR", 0)]:
        LOYALTY_ACCOUNTS.append({
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "program": program,
            "points_balance": balance,
            "tier": None,
        })

    # Create session
    token = secrets.token_urlsafe(32)
    SESSIONS[token] = user["id"]

    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return {"user": safe_user, "token": token}


@router.post("/login")
async def login(req: LoginRequest):
    for u in USERS:
        if u["email"] == req.email and u["password_hash"] == hash_password(req.password):
            token = secrets.token_urlsafe(32)
            SESSIONS[token] = u["id"]
            safe_user = {k: v for k, v in u.items() if k != "password_hash"}
            return {"user": safe_user, "token": token}

    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/logout")
async def logout(user: dict = Depends(require_auth)):
    # Remove all sessions for this user
    to_remove = [t for t, uid in SESSIONS.items() if uid == user["id"]]
    for t in to_remove:
        del SESSIONS[t]
    return {"status": "logged out"}


@router.get("/me")
async def get_me(user: dict = Depends(require_auth)):
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return {"user": safe_user}


@router.put("/profile")
async def update_profile(req: UpdateProfileRequest, user: dict = Depends(require_auth)):
    if req.home_airport is not None:
        user["home_airport"] = req.home_airport
    if req.pax_default is not None:
        user["pax_default"] = req.pax_default
    if req.budget_max is not None:
        user["budget_max"] = req.budget_max
    if req.max_flight_minutes is not None:
        user["max_flight_minutes"] = req.max_flight_minutes
    if req.interests is not None:
        user["interests"] = req.interests
    if req.points_first is not None:
        user["points_first"] = req.points_first

    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return {"user": safe_user}
