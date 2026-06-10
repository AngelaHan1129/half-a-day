# Half A Day + USR

智慧導覽、在地知識、RAG 檢索與 AR 體驗整合平台。後端目前同時支援依 `detectedClass` 與 `region` 查詢物件知識的 `GET /api/knowledge`，也可透過 `POST /api/knowledge` 接收前端提交的知識文本，這與 Spring 對 `@RequestBody` DTO 與同一路徑不同 HTTP method 的控制器設計相符。 [docs.spring](https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-methods/requestbody.html)

## 專案特色

- 物件辨識知識卡：前端依模型輸出的 class key 呼叫 `/api/knowledge`，後端回傳標題、簡介、標籤、相關項目與 AR 模型路徑。 [baeldung](https://www.baeldung.com/spring-request-response-body)
- 地方知識庫管理：後台可新增文本知識，並延伸接入 embedding、chunking 與向量檢索流程。 [docs.spring](https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-methods/requestbody.html)
- RAG 檢索體驗：可用自然語言查詢摘要結果與原始文件片段，作為地方導覽與教育應用的知識底座。 [baeldung](https://www.baeldung.com/spring-request-response-body)
- Docker 化部署：應用、embedding 服務與 PostgreSQL/pgvector 可用 Compose 統一管理，適合本機開發與展示環境。 [stackoverflow](https://stackoverflow.com/questions/30175166/spring-boot-multiple-controllers-with-same-mapping)

## 系統架構

```text
Frontend (React / Vite)
   ├─ KnowledgeCard
   ├─ AdminKnowledge
   └─ knowledgeApi.ts
          │
          ▼
Backend (Spring Boot)
   ├─ GET  /api/knowledge
   ├─ POST /api/knowledge
   ├─ GET  /api/knowledge/search
   └─ GET  /api/knowledge/documents
          │
          ├─ PostgreSQL / pgvector
          └─ Embedding Service (FastAPI / Uvicorn)
```

目前專案的核心分成兩條主線：一條是面向前台辨識結果的知識查詢 API，另一條是面向後台維護的 RAG 知識庫寫入與檢索 API；兩者共用 Spring Boot 作為整合層。 [stackoverflow](https://stackoverflow.com/questions/59936902/multiple-endpoints-for-rest-api-in-spring-boot)

## 目錄建議

```text
backend/
├─ halfaday/
│  ├─ src/main/java/com/xiaobantian/
│  │  ├─ controller/
│  │  ├─ service/
│  │  ├─ repository/
│  │  ├─ model/
│  │  └─ dto/
│  ├─ docker-compose.yml
│  └─ Dockerfile
└─ emedding-model/
   ├─ embedding_service.py
   ├─ requirements.txt
   └─ Dockerfile

frontend/
├─ src/components/
├─ src/services/api/
└─ ...
```

## API 概覽

| Method | Path | 用途 |
|---|---|---|
| GET | `/api/knowledge` | 依 `detectedClass` 與 `region` 查詢知識卡資料。 [baeldung](https://www.baeldung.com/spring-request-response-body) |
| POST | `/api/knowledge` | 新增知識文本，供後續 chunk / embedding / vector store 使用。 [docs.spring](https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-methods/requestbody.html) |
| GET | `/api/knowledge/search` | 以自然語言查詢 RAG 摘要結果。 |
| GET | `/api/knowledge/documents` | 取得相似文件片段與 metadata。 |

### GET `/api/knowledge`

```http
GET /api/knowledge?detectedClass=bamboo_grove&region=小半天
```

範例回應：

```json
{
  "found": true,
  "title": "孟宗竹林",
  "shortIntro": "小半天最具代表性的竹林景觀之一，與步道、生態與山村地景密切相關。",
  "arGlbPath": "/models/free_bamboo_set.glb",
  "arUsdzPath": "/models/Free_Bamboo_Set.usdz",
  "tags": ["自然景觀", "在地特色"],
  "relatedItems": [
    { "className": "bamboo_shoot", "title": "小半天鮮甜冬筍" }
  ]
}
```

### POST `/api/knowledge`

```http
POST /api/knowledge
Content-Type: application/json
```

```json
{
  "content": "長源圳生態步道位於南投小半天，建於日治時期。",
  "source": "manual"
}
```

範例回應：

```json
{
  "message": "知識已成功寫入知識庫",
  "source": "manual"
}
```

## 前端串接重點

`KnowledgeCard` 應傳入的是模型輸出的 class key，例如 `bamboo_shoot`、`bamboo_grove`、`tea_field`，而不是中文標題或地區名稱；因為後端 repository 目前採用精確欄位查詢，送錯 key 只會回 unknown 或走 fallback。 [docs.spring](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)

建議將 React 元件中的 `className` props 改名為 `detectedClass`，避免與樣式用的 `className` 混淆，也能讓語意更貼近 API 契約。

```ts
getKnowledge({
  detectedClass: "bamboo_grove",
  region: "小半天",
});
```

## 後端查詢邏輯

`KnowledgeService` 的推薦流程如下：先用 `detectedClass + region` 查詢，找不到時再 fallback 成只用 `detectedClass` 查詢，最後再依 `relatedClasses` 組出 `relatedItems`；這種設計符合 Spring Data JPA 以 method name 推導查詢的常見模式。 [docs.spring](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)

查詢流程：

1. 檢查 `detectedClass` 是否為空。
2. `region` 空白時預設為 `小半天`。
3. 先查 `findByDetectedClassAndRegion(...)`。
4. 找不到再查 `findByDetectedClass(...)`。
5. 解析 `relatedClasses` JSON 並查出相關項目。
6. 組裝 `KnowledgeResponse` 回前端。

## Docker 啟動

```bash
docker compose up --build
```

若 embedding 服務需要等待啟動完成，建議在 Compose 中為該服務加入 `healthcheck`，並讓主應用改依賴 `service_healthy`，這樣會比僅使用 `service_started` 更可靠。 [stackoverflow](https://stackoverflow.com/questions/30175166/spring-boot-multiple-controllers-with-same-mapping)

## 開發建議

- 將辨識知識查詢與 RAG 後台維護視為同一產品中的兩條功能線，避免在資料設計上混用中文顯示名稱與模型 key。
- 對 `POST /api/knowledge` 建立明確的 request/response DTO，不直接暴露 entity，這是 Spring API 設計中常見且穩定的做法。 [medium](https://medium.com/javarevisited/spring-boot-best-practices-use-dtos-instead-of-entities-in-api-responses-e23fc69e45a4)
- 若未來要支援中文別名查詢，可額外增加 `title` 或 alias 搜尋，而不要破壞目前 `detectedClass` 的主鍵語意。 [docs.spring](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)
- 若要正式接入 RAG，`addKnowledge` 後續應串接 chunking、embedding 與 pgvector 寫入，而不只停留在 mock service。

## 常見問題

### 為什麼 Swagger 查得到，但前端有時查不到？

最常見原因是前端送出的 `detectedClass` 不是資料庫中的 class key，而是中文名稱或其他顯示字串；後端若查不到就會回 `unknown`。 [docs.spring](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)

### 為什麼後台新增知識出現 `HttpRequestMethodNotSupportedException`？

因為前端送的是 `POST /api/knowledge`，但後端當時只保留了 `GET /api/knowledge`；補回 `@PostMapping` 後即可恢復正常。 [docs.spring](https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-methods/requestbody.html)

### 為什麼 region 填錯仍然可能查到資料？

因為 service 有 fallback：先查 `detectedClass + region`，若失敗再查 `detectedClass`，所以 region 不正確時仍有機會命中同 class 的資料。 [docs.spring](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)