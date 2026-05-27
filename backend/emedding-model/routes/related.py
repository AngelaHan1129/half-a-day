# backend/emedding-model/routes/related.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import numpy as np

router = APIRouter()

class RelatedRequest(BaseModel):
    className: str
    topK: int = 3

class RelatedItem(BaseModel):
    className: str
    title: str
    score: float

@router.post("/api/embedding/related", response_model=List[RelatedItem])
async def get_related(req: RelatedRequest):
    """
    根據偵測到的 class，用 embedding 找出最相似的小半天特色產物
    """
    query_vec = get_class_embedding(req.className)  # 你現有的 embed function
    candidates = load_halfaday_knowledge_vectors()   # 所有知識的向量

    scores = cosine_similarity(query_vec, candidates)
    top_indices = np.argsort(scores)[::-1][:req.topK]

    return [
        RelatedItem(
            className=candidates[i].class_name,
            title=candidates[i].title,
            score=float(scores[i])
        )
        for i in top_indices
        if candidates[i].class_name != req.className
    ]