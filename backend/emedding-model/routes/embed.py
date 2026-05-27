# ============================================================
# backend/emedding-model/routes/embed.py
# ============================================================
from __future__ import annotations

from typing import List

from fastapi import APIRouter
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

router = APIRouter()

class EmbedRequest(BaseModel):
    texts: List[str]

class EmbedResponse(BaseModel):
    embeddings: List[List[float]]
    model:      str

@router.post("/embed", response_model=EmbedResponse)
async def embed_texts(req: EmbedRequest) -> EmbedResponse:
    """
    將任意文字清單轉為 embedding 向量
    （供 Spring Boot 或外部服務呼叫，建立向量索引用）
    """
    model_name = "paraphrase-multilingual-MiniLM-L12-v2"
    model      = SentenceTransformer(model_name)
    vecs       = model.encode(req.texts, normalize_embeddings=True)
    return EmbedResponse(
        embeddings=[v.tolist() for v in vecs],
        model=model_name,
    )