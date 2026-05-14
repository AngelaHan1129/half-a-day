from typing import List, Union
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

MODEL_NAME = "BAAI/bge-m3"
model = SentenceTransformer(MODEL_NAME)

app = FastAPI(title="Embedding Service", version="1.0.0")

class EmbeddingRequest(BaseModel):
    input: Union[str, List[str]] = Field(..., description="單一文字或文字陣列")
    normalize: bool = True

class EmbeddingItem(BaseModel):
    index: int
    embedding: List[float]

class EmbeddingResponse(BaseModel):
    model: str
    dimension: int
    data: List[EmbeddingItem]

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": MODEL_NAME,
        "dimension": model.get_sentence_embedding_dimension()
    }

@app.post("/embeddings", response_model=EmbeddingResponse)
def embeddings(req: EmbeddingRequest):
    texts = [req.input] if isinstance(req.input, str) else req.input
    vectors = model.encode(
        texts,
        normalize_embeddings=req.normalize
    )

    return EmbeddingResponse(
        model=MODEL_NAME,
        dimension=model.get_sentence_embedding_dimension(),
        data=[
            EmbeddingItem(index=i, embedding=v.tolist())
            for i, v in enumerate(vectors)
        ]
    )