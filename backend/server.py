from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import re
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ---------- DB ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---------- Auth helpers ----------
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        if payload.get("type") != "access" or payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Token invalido")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalido")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text[:80] or str(uuid.uuid4())[:8]


# ---------- Models ----------
CATEGORIES = ["ia", "sap", "figuras"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ArticleIn(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    cover_image: str
    author: str = "Redaccion Stratotos"
    featured: bool = False
    published: bool = True


class Article(ArticleIn):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    views: int = 0


class CourseIn(BaseModel):
    title: str
    description: str
    level: str  # Basico / Intermedio / Avanzado
    duration: str  # e.g. "24 horas"
    price: float
    cover_image: str
    category: str = "sap"  # sap | ia | otros
    instructor: str = "Instructor Stratotos"
    published: bool = True


class Course(CourseIn):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SubscribeIn(BaseModel):
    email: EmailStr


class LeadIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    interest: str = "consulting"  # consulting | academy | general


# ---------- App ----------
app = FastAPI(title="Stratotos System API")
api = APIRouter(prefix="/api")


@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.articles.create_index("slug", unique=True)
    await db.articles.create_index("category")
    await db.articles.create_index("created_at")
    await db.subscribers.create_index("email", unique=True)

    # Seed admin
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin Stratotos",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    else:
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}}
            )

    # Seed sample articles + courses if collections empty
    if await db.articles.count_documents({}) == 0:
        await db.articles.insert_many(_seed_articles())
    if await db.courses.count_documents({}) == 0:
        await db.courses.insert_many(_seed_courses())


def _seed_articles():
    now = datetime.now(timezone.utc)
    items = [
        {
            "title": "OpenAI presenta GPT-5.6 Terra: razonamiento multimodal a otro nivel",
            "excerpt": "El nuevo modelo insignia de OpenAI redefine la interaccion humano-maquina con capacidades de razonamiento visual y contextual sin precedentes.",
            "content": "OpenAI ha revelado GPT-5.6 Terra, su modelo mas ambicioso hasta la fecha. Con una arquitectura multimodal completamente rediseñada, Terra procesa texto, imagen, audio y video de forma nativa en un unico contexto extendido de hasta 2 millones de tokens.\n\nLa compania asegura que el modelo supera a sus competidores en 47 de 50 benchmarks industriales, con avances particulares en tareas de razonamiento matematico y programacion de sistemas complejos.\n\nLa comunidad SAP ha recibido la noticia con entusiasmo, dado que Terra promete acelerar drasticamente la generacion de codigo ABAP y la documentacion tecnica en implementaciones S/4HANA.",
            "category": "ia",
            "cover_image": "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Maria Rendon",
            "featured": True,
        },
        {
            "title": "Elon Musk anuncia el chip Neuralink v3 con interfaz cerebral inalambrica",
            "excerpt": "El nuevo dispositivo promete restaurar la vision y el movimiento en pacientes paralizados sin cables externos.",
            "content": "Neuralink ha revelado la tercera generacion de su chip cerebral, con transmision de datos completamente inalambrica y una densidad de electrodos tres veces mayor.\n\nMusk afirmo durante la presentacion que ya hay siete pacientes utilizando la version anterior sin efectos adversos reportados. La FDA aun evalua la aprobacion masiva del dispositivo.",
            "category": "figuras",
            "cover_image": "https://images.unsplash.com/photo-1745273079710-a87d91592074?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Carlos Ibañez",
            "featured": True,
        },
        {
            "title": "SAP libera Business AI Copilot Joule para todos los modulos S/4HANA",
            "excerpt": "El asistente inteligente ahora acompaña procesos de finanzas, compras y RRHH en tiempo real dentro del ERP.",
            "content": "SAP ha anunciado la disponibilidad general de Joule, su copiloto empresarial impulsado por IA generativa. La herramienta se integra nativamente en Fiori y acompaña al usuario en tareas como la creacion de ordenes de compra, el cierre contable mensual y el analisis de nomina.\n\nSegun SAP, las empresas beta han reducido en un 34% el tiempo dedicado a tareas administrativas repetitivas.",
            "category": "sap",
            "cover_image": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Andrea Solis",
            "featured": True,
        },
        {
            "title": "Jeff Bezos invierte 2 mil millones en startup de computo cuantico",
            "excerpt": "Blue Origin y Amazon apuntan a liderar la proxima era del procesamiento post-silicio.",
            "content": "Bezos Expeditions confirmo una inyeccion de capital de 2 mil millones de dolares en Rigetti Computing, con el objetivo de acelerar la comercializacion de procesadores cuanticos de 336 qubits.",
            "category": "figuras",
            "cover_image": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Julian Perez",
            "featured": False,
        },
        {
            "title": "Google DeepMind AlphaCode 3 supera a programadores expertos",
            "excerpt": "La nueva version obtiene medalla de oro en la Olimpiada Internacional de Programacion 2026.",
            "content": "AlphaCode 3 se convirtio en el primer sistema de IA en ganar oro en la ICPC World Finals, resolviendo 9 de 11 problemas en menos de 3 horas.",
            "category": "ia",
            "cover_image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Sofia Delgado",
            "featured": False,
        },
        {
            "title": "SAP S/4HANA Cloud 2026: 200 nuevas funcionalidades para el CFO",
            "excerpt": "Automatizacion contable, cierre continuo y forecasting inteligente encabezan el release.",
            "content": "SAP ha detallado el roadmap de su release 2026 con foco en el modulo FI/CO. Destacan el cierre continuo automatizado, la conciliacion inteligente y nuevos dashboards de tesoreria en tiempo real.",
            "category": "sap",
            "cover_image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Ricardo Muñoz",
            "featured": False,
        },
        {
            "title": "Anthropic Claude Sonnet 5 supera a GPT en tareas de codigo empresarial",
            "excerpt": "El modelo de Anthropic domina los benchmarks de generacion de codigo Python y Java en produccion.",
            "content": "Claude Sonnet 5 alcanzo un 94% de precision en SWE-Bench Verified, superando a GPT-5 en tareas de refactor y depuracion de codigo empresarial.",
            "category": "ia",
            "cover_image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Elena Ramos",
            "featured": False,
        },
        {
            "title": "Mark Zuckerberg presenta gafas AR Orion 2 con display holografico",
            "excerpt": "Meta apuesta por reemplazar el smartphone en los proximos 5 años.",
            "content": "Meta ha mostrado Orion 2, la segunda generacion de sus gafas de realidad aumentada. El dispositivo, del tamaño de unas gafas normales, proyecta hologramas 3D con un campo de vision de 90 grados.",
            "category": "figuras",
            "cover_image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
            "author": "Diego Vargas",
            "featured": False,
        },
    ]
    docs = []
    for idx, it in enumerate(items):
        art = Article(**it, slug=slugify(it["title"]))
        d = art.model_dump()
        d["created_at"] = (now - timedelta(hours=idx * 6)).isoformat()
        docs.append(d)
    return docs


def _seed_courses():
    items = [
        {
            "title": "SAP S/4HANA Finance para Consultores",
            "description": "Domina el modulo financiero de SAP S/4HANA desde cero hasta implementacion real. Incluye laboratorios en un tenant productivo.",
            "level": "Intermedio",
            "duration": "40 horas",
            "price": 599.0,
            "cover_image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "category": "sap",
            "instructor": "Andrea Solis",
        },
        {
            "title": "SAP ABAP moderno con Cloud Application Programming",
            "description": "Aprende a construir extensiones cloud-native para S/4HANA usando CAP, RAP y BTP.",
            "level": "Avanzado",
            "duration": "48 horas",
            "price": 749.0,
            "cover_image": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "category": "sap",
            "instructor": "Ricardo Muñoz",
        },
        {
            "title": "IA Generativa Aplicada a Negocios",
            "description": "Diseña asistentes empresariales con GPT, Claude y Gemini. Casos reales de automatizacion.",
            "level": "Basico",
            "duration": "24 horas",
            "price": 399.0,
            "cover_image": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "category": "ia",
            "instructor": "Maria Rendon",
        },
        {
            "title": "Data Science para SAP: BW, Datasphere y Python",
            "description": "Convierte datos SAP en decisiones. Integracion de Datasphere con Python y Power BI.",
            "level": "Intermedio",
            "duration": "36 horas",
            "price": 549.0,
            "cover_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "category": "sap",
            "instructor": "Julian Perez",
        },
    ]
    docs = []
    for it in items:
        c = Course(**it)
        docs.append(c.model_dump())
    return docs


# ---------- Public endpoints ----------
@api.get("/")
async def root():
    return {"service": "Stratotos System API", "status": "ok"}


@api.get("/articles")
async def list_articles(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(20, le=100),
    skip: int = 0,
):
    q = {"published": True}
    if category and category in CATEGORIES:
        q["category"] = category
    if featured is not None:
        q["featured"] = featured
    cursor = db.articles.find(q, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit)
    items = await cursor.to_list(length=limit)
    total = await db.articles.count_documents(q)
    return {"items": items, "total": total}


@api.get("/articles/{slug}")
async def get_article(slug: str):
    doc = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Articulo no encontrado")
    await db.articles.update_one({"slug": slug}, {"$inc": {"views": 1}})
    doc["views"] = doc.get("views", 0) + 1
    # related
    related_cur = db.articles.find(
        {"category": doc["category"], "slug": {"$ne": slug}, "published": True},
        {"_id": 0}
    ).sort("created_at", -1).limit(3)
    related = await related_cur.to_list(length=3)
    return {"article": doc, "related": related}


@api.get("/courses")
async def list_courses(category: Optional[str] = None):
    q = {"published": True}
    if category:
        q["category"] = category
    cursor = db.courses.find(q, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(length=100)
    return {"items": items}


@api.post("/subscribe")
async def subscribe(payload: SubscribeIn):
    email = payload.email.lower()
    try:
        await db.subscribers.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    except Exception:
        # already subscribed
        return {"status": "already_subscribed", "email": email}
    return {"status": "subscribed", "email": email}


@api.post("/leads")
async def create_lead(payload: LeadIn):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "company": payload.company,
        "message": payload.message,
        "interest": payload.interest,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(doc)
    doc.pop("_id", None)
    return {"status": "ok", "lead": {k: v for k, v in doc.items() if k != "_id"}}


# ---------- Auth ----------
@api.post("/auth/login")
async def login(payload: LoginRequest):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales invalidas")
    token = create_access_token(user["id"], user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]},
    }


@api.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- Admin endpoints ----------
@api.post("/admin/articles")
async def admin_create_article(payload: ArticleIn, admin=Depends(get_current_admin)):
    if payload.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Categoria invalida")
    slug = slugify(payload.title)
    # ensure unique slug
    base_slug = slug
    n = 1
    while await db.articles.find_one({"slug": slug}):
        n += 1
        slug = f"{base_slug}-{n}"
    art = Article(**payload.model_dump(), slug=slug)
    await db.articles.insert_one(art.model_dump())
    return art.model_dump()


@api.get("/admin/articles")
async def admin_list_articles(admin=Depends(get_current_admin)):
    cursor = db.articles.find({}, {"_id": 0}).sort("created_at", -1)
    return {"items": await cursor.to_list(length=500)}


@api.put("/admin/articles/{article_id}")
async def admin_update_article(article_id: str, payload: ArticleIn, admin=Depends(get_current_admin)):
    if payload.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Categoria invalida")
    update = payload.model_dump()
    res = await db.articles.update_one({"id": article_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Articulo no encontrado")
    doc = await db.articles.find_one({"id": article_id}, {"_id": 0})
    return doc


@api.delete("/admin/articles/{article_id}")
async def admin_delete_article(article_id: str, admin=Depends(get_current_admin)):
    res = await db.articles.delete_one({"id": article_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Articulo no encontrado")
    return {"status": "deleted"}


@api.post("/admin/courses")
async def admin_create_course(payload: CourseIn, admin=Depends(get_current_admin)):
    c = Course(**payload.model_dump())
    await db.courses.insert_one(c.model_dump())
    return c.model_dump()


@api.get("/admin/courses")
async def admin_list_courses(admin=Depends(get_current_admin)):
    cursor = db.courses.find({}, {"_id": 0}).sort("created_at", -1)
    return {"items": await cursor.to_list(length=200)}


@api.put("/admin/courses/{course_id}")
async def admin_update_course(course_id: str, payload: CourseIn, admin=Depends(get_current_admin)):
    res = await db.courses.update_one({"id": course_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return await db.courses.find_one({"id": course_id}, {"_id": 0})


@api.delete("/admin/courses/{course_id}")
async def admin_delete_course(course_id: str, admin=Depends(get_current_admin)):
    res = await db.courses.delete_one({"id": course_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return {"status": "deleted"}


@api.get("/admin/leads")
async def admin_list_leads(admin=Depends(get_current_admin)):
    cursor = db.leads.find({}, {"_id": 0}).sort("created_at", -1)
    return {"items": await cursor.to_list(length=500)}


@api.get("/admin/subscribers")
async def admin_list_subscribers(admin=Depends(get_current_admin)):
    cursor = db.subscribers.find({}, {"_id": 0}).sort("created_at", -1)
    return {"items": await cursor.to_list(length=1000)}


@api.get("/admin/stats")
async def admin_stats(admin=Depends(get_current_admin)):
    articles = await db.articles.count_documents({})
    courses = await db.courses.count_documents({})
    subscribers = await db.subscribers.count_documents({})
    leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    total_views_agg = await db.articles.aggregate([{"$group": {"_id": None, "total": {"$sum": "$views"}}}]).to_list(1)
    total_views = total_views_agg[0]["total"] if total_views_agg else 0
    return {
        "articles": articles,
        "courses": courses,
        "subscribers": subscribers,
        "leads": leads,
        "new_leads": new_leads,
        "total_views": total_views,
    }


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
