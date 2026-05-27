# ============================================================
# backend/emedding-model/main.py
# ============================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.related import router as related_router
from routes.embed   import router as embed_router

app = FastAPI(
    title="小半天 Embedding Service",
    description="提供小半天知識的向量語意搜尋與相關特色推薦",
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── 路由 ────────────────────────────────────────────────────
app.include_router(related_router, prefix="/api/embedding", tags=["Related"])
app.include_router(embed_router,   prefix="/api/embedding", tags=["Embed"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)