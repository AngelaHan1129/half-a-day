# 小半天綠色農遊智慧平台 — Spring AI 後端技術規格書

> 版本：1.0.0 ｜ 日期：2026-04-07 ｜ 技術棧：Spring Boot 3.4 + Spring AI 1.0 + PostgreSQL + pgvector

***

## 一、專案定位

本文件說明「小半天綠色農遊智慧平台」後端系統的技術架構與實作規格，以 Spring AI 為核心 AI 框架，整合四季農遊導覽、食農知識 RAG 問答、智慧路線推薦與線上預約管理等功能。

小半天位於南投縣鹿谷鄉，涵蓋竹林村、竹豐村與和雅村，以茶（烏龍茶）、黃金竹筍、竹炭三大特色產業聞名，本平台針對其四季旅遊特性設計 AI 輔助服務模組。

***

## 二、技術棧總覽

| 層級 | 技術選型 | 版本 |
|---|---|---|
| 後端框架 | Spring Boot | 3.4.1 |
| AI 框架 | Spring AI | 1.0.0 |
| AI 模型 | OpenAI GPT-4o | — |
| 嵌入模型 | text-embedding-3-small | — |
| 向量資料庫 | PostgreSQL + pgvector | 16+ |
| 關聯式資料庫 | PostgreSQL | 16+ |
| 空間資料擴充 | PostGIS | 3.x |
| 構建工具 | Maven | 3.9+ |
| Java 版本 | Java | 21 |

***

## 三、專案結構

```
xiaobantian-platform/
├── pom.xml
└── src/main/java/com/xiaobantian/
    ├── XiaobantianApplication.java
    ├── config/
    │   └── AiConfig.java                  # ChatClient Bean 設定、System Prompt
    ├── model/
    │   ├── Place.java                     # 景點／商家實體
    │   ├── PlaceType.java                 # 景點類型枚舉
    │   ├── Route.java                     # 遊程實體
    │   ├── RouteStop.java                 # 遊程停靠點
    │   ├── Booking.java                   # 預約實體
    │   └── BookingStatus.java             # 預約狀態枚舉
    ├── dto/
    │   ├── RecommendRequest.java          # 推薦條件輸入
    │   └── ChatRequest.java               # 聊天請求
    ├── repository/
    │   ├── PlaceRepository.java           # 景點資料存取
    │   ├── RouteRepository.java           # 遊程資料存取
    │   └── BookingRepository.java         # 預約資料存取
    ├── tool/
    │   ├── RouteTool.java                 # AI Tool：查詢遊程
    │   └── PlaceTool.java                 # AI Tool：查詢景點
    ├── advisor/
    │   └── SeasonalContextAdvisor.java    # 自訂 Advisor：季節語境注入
    ├── service/
    │   ├── RecommendService.java          # 智慧路線推薦邏輯
    │   ├── RagService.java                # 食農知識庫 RAG 問答
    │   └── BookingService.java            # 預約管理邏輯
    └── controller/
        ├── ChatController.java            # 導覽聊天 API
        ├── RecommendController.java       # 智慧推薦 API
        └── BookingController.java         # 預約管理 API
```

***

## 四、Maven 依賴（pom.xml）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
           https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.1</version>
  </parent>

  <groupId>com.xiaobantian</groupId>
  <artifactId>xiaobantian-platform</artifactId>
  <version>1.0.0</version>
  <name>小半天綠色農遊智慧平台</name>

  <properties>
    <java.version>21</java.version>
    <spring-ai.version>1.0.0</spring-ai.version>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-bom</artifactId>
        <version>${spring-ai.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.ai</groupId>
      <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.ai</groupId>
      <artifactId>spring-ai-pgvector-store-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.ai</groupId>
      <artifactId>spring-ai-pdf-document-reader</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
  </dependencies>
</project>
```

***

## 五、應用程式設定（application.yml）

```yaml
spring:
  application:
    name: xiaobantian-platform

  datasource:
    url: jdbc:postgresql://localhost:5432/xiaobantian
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4o
          temperature: 0.7
      embedding:
        options:
          model: text-embedding-3-small

    vectorstore:
      pgvector:
        index-type: HNSW
        distance-type: COSINE_DISTANCE
        dimensions: 1536
        initialize-schema: true

server:
  port: 8080
```

***

## 六、資料模型

### 6.1 Place（景點 / 商家）

```java
package com.xiaobantian.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "places")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Place {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private PlaceType type; // ATTRACTION / FARM / HOMESTAY / RESTAURANT / WORKSHOP / TRAIL

    private String village;          // 竹林村 / 竹豐村 / 和雅村
    private Double lat;
    private Double lng;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer familyFriendlyLevel;   // 1–5
    private Integer elderlyFriendlyLevel;  // 1–5
    private Integer carbonFriendlyScore;   // 1–5
    private Integer stayDurationMin;
    private String  openHours;
    private String  bookingUrl;

    // 適合季節（逗號分隔）：SPRING,SUMMER,AUTUMN,WINTER
    private String  seasonAvailability;
    private String  tags;
    private Boolean active;
}
```

### 6.2 Route（遊程）

```java
package com.xiaobantian.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "routes")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Route {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String season;          // SPRING / SUMMER / AUTUMN / WINTER
    private String targetGroup;     // FAMILY / ELDERLY / GENERAL
    private Integer durationHours;
    private String difficulty;      // EASY / MODERATE
    private String highlights;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    @OrderBy("stopOrder ASC")
    private List<RouteStop> stops;

    private Boolean active;
}
```

### 6.3 RouteStop（遊程停靠點）

```java
package com.xiaobantian.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "route_stops")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RouteStop {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne @JoinColumn(name = "place_id")
    private Place place;

    private Integer stopOrder;
    private Integer stayMinutes;
    private String  note;
}
```

### 6.4 Booking（預約）

```java
package com.xiaobantian.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Booking {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String    guestName;
    private String    guestPhone;
    private String    guestEmail;
    private Integer   headCount;
    private LocalDate visitDate;

    @ManyToOne @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne @JoinColumn(name = "route_id")
    private Route route;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING / CONFIRMED / CANCELLED

    private LocalDateTime createdAt;
}
```

***

## 七、Spring AI 核心元件

### 7.1 AiConfig — ChatClient 設定

```java
package com.xiaobantian.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    private static final String SYSTEM_PROMPT = """
            你是「小半天綠色農遊智慧平台」的 AI 導覽助理。
            小半天位於南投縣鹿谷鄉，涵蓋竹林村、竹豐村與和雅村，
            以茶（烏龍茶）、黃金竹筍、竹炭三大特色產業聞名。

            你的任務：
            1. 依遊客需求推薦適合的四季遊程與景點
            2. 介紹在地農業體驗（挖筍、採茶、竹藝 DIY）
            3. 回答食農知識與文化問題（茶文化、竹文化、竹炭製程）
            4. 提供低碳旅遊與交通建議

            回答時請使用繁體中文，語氣親切專業。
            若問題超出小半天旅遊範圍，請引導使用者回到旅遊規劃主題。
            """;

    @Bean
    public ChatClient tourismChatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(SYSTEM_PROMPT)
                .defaultAdvisors(
                        new MessageChatMemoryAdvisor(new InMemoryChatMemory()),
                        new SimpleLoggerAdvisor()
                )
                .build();
    }
}
```

### 7.2 RouteTool — AI Tool Calling：查詢遊程

```java
package com.xiaobantian.tool;

import com.xiaobantian.model.Route;
import com.xiaobantian.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RouteTool {

    private final RouteRepository routeRepository;

    @Tool(description = "根據季節查詢推薦遊程，season 請傳入 SPRING/SUMMER/AUTUMN/WINTER")
    public List<Route> getRoutesBySeason(String season) {
        return routeRepository.findBySeasonAndActiveTrue(season.toUpperCase());
    }

    @Tool(description = "根據適合族群查詢遊程，targetGroup 請傳入 FAMILY/ELDERLY/GENERAL")
    public List<Route> getRoutesByGroup(String targetGroup) {
        return routeRepository.findByTargetGroupAndActiveTrue(targetGroup.toUpperCase());
    }

    @Tool(description = "根據可用時數查詢合適遊程，hours 為整數，如 2、4、8")
    public List<Route> getRoutesByDuration(Integer hours) {
        return routeRepository.findByDurationHoursLessThanEqualAndActiveTrue(hours);
    }
}
```

### 7.3 PlaceTool — AI Tool Calling：查詢景點

```java
package com.xiaobantian.tool;

import com.xiaobantian.model.Place;
import com.xiaobantian.model.PlaceType;
import com.xiaobantian.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PlaceTool {

    private final PlaceRepository placeRepository;

    @Tool(description = "查詢指定季節的景點，season 請傳入 SPRING/SUMMER/AUTUMN/WINTER")
    public List<Place> getPlacesBySeason(String season) {
        return placeRepository.findBySeasonAndActiveTrue(season.toUpperCase());
    }

    @Tool(description = "查詢親子友善景點，minLevel 為友善等級下限（1~5）")
    public List<Place> getFamilyFriendlyPlaces(Integer minLevel) {
        return placeRepository.findFamilyFriendly(minLevel);
    }

    @Tool(description = "依景點類型查詢，type 可傳 FARM/HOMESTAY/RESTAURANT/WORKSHOP/TRAIL")
    public List<Place> getPlacesByType(String type) {
        return placeRepository.findByTypeAndActiveTrue(PlaceType.valueOf(type.toUpperCase()));
    }
}
```

### 7.4 SeasonalContextAdvisor — 季節語境自動注入

每個 AI 請求進入前，自動附加當月小半天季節特色資訊，讓 AI 回覆更貼近當下旅遊情境。

```java
package com.xiaobantian.advisor;

import org.springframework.ai.chat.client.advisor.api.*;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import java.util.Map;

@Component
public class SeasonalContextAdvisor implements CallAroundAdvisor, StreamAroundAdvisor {

    private static final Map<String, String> SEASON_CONTEXT = Map.of(
        "SPRING", "現在是春季（3–5月），正值春筍（孟宗竹筍）盛產與春茶採收季，適合挖筍與茶園體驗。",
        "SUMMER", "現在是夏季（6–8月），氣候涼爽，適合竹林步道避暑，螢火蟲季節活動豐富。",
        "AUTUMN", "現在是秋季（9–10月），銀杏森林進入最佳觀賞期，秋茶採收，茶席體驗尤其推薦。",
        "WINTER", "現在是冬季（11–2月），冬筍（桂竹筍）盛產，竹炭窯體驗為冬季限定，1–2月河津櫻盛開。"
    );

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest request, CallAroundAdvisorChain chain) {
        return chain.nextAroundCall(injectSeasonContext(request));
    }

    @Override
    public Flux<AdvisedResponse> aroundStream(AdvisedRequest request, StreamAroundAdvisorChain chain) {
        return chain.nextAroundStream(injectSeasonContext(request));
    }

    private AdvisedRequest injectSeasonContext(AdvisedRequest request) {
        String context = SEASON_CONTEXT.get(getCurrentSeason());
        String enrichedSystem = request.systemText() + "\n\n[目前季節資訊] " + context;
        return AdvisedRequest.from(request).systemText(enrichedSystem).build();
    }

    private String getCurrentSeason() {
        int month = java.time.LocalDate.now().getMonthValue();
        if (month >= 3 && month <= 5)  return "SPRING";
        if (month >= 6 && month <= 8)  return "SUMMER";
        if (month >= 9 && month <= 10) return "AUTUMN";
        return "WINTER";
    }

    @Override public String getName()  { return "SeasonalContextAdvisor"; }
    @Override public int    getOrder() { return 10; }
}
```

***

## 八、Service 層

### 8.1 RagService — 食農知識庫 RAG 問答

```java
package com.xiaobantian.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RagService {

    private final ChatClient tourismChatClient;
    private final VectorStore vectorStore;

    /**
     * 使用 RAG 回答食農知識問題
     * 例如：「竹炭是怎麼製作的？」、「幾月適合採茶？」
     */
    public String askKnowledge(String question) {
        RetrievalAugmentationAdvisor ragAdvisor = RetrievalAugmentationAdvisor.builder()
                .documentRetriever(
                    VectorStoreDocumentRetriever.builder()
                        .vectorStore(vectorStore)
                        .similarityThreshold(0.72)
                        .topK(4)
                        .build()
                )
                .build();

        return tourismChatClient.prompt()
                .user(question)
                .advisors(ragAdvisor)
                .call()
                .content();
    }
}
```

### 8.2 RecommendService — 智慧路線推薦

```java
package com.xiaobantian.service;

import com.xiaobantian.advisor.SeasonalContextAdvisor;
import com.xiaobantian.dto.RecommendRequest;
import com.xiaobantian.tool.PlaceTool;
import com.xiaobantian.tool.RouteTool;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final ChatClient tourismChatClient;
    private final RouteTool routeTool;
    private final PlaceTool placeTool;
    private final SeasonalContextAdvisor seasonalContextAdvisor;

    public String recommend(RecommendRequest req) {
        return tourismChatClient.prompt()
                .user(buildPrompt(req))
                .advisors(seasonalContextAdvisor)
                .tools(routeTool, placeTool)
                .call()
                .content();
    }

    public Flux<String> recommendStream(RecommendRequest req) {
        return tourismChatClient.prompt()
                .user(buildPrompt(req))
                .advisors(seasonalContextAdvisor)
                .tools(routeTool, placeTool)
                .stream()
                .content();
    }

    private String buildPrompt(RecommendRequest req) {
        return String.format("""
            請根據以下條件為旅客規劃小半天旅遊路線：
            - 季節：%s
            - 同遊對象：%s
            - 可用時間：%d 小時
            - 交通方式：%s
            - 興趣偏好：%s
            - 體力狀況：%s

            請提供路線名稱、各停靠點（含建議停留時間）、
            路線亮點、低碳交通建議，以及注意事項。
            """,
            req.getSeason(), req.getTargetGroup(), req.getDurationHours(),
            req.getTransport(), req.getInterest(), req.getDifficulty()
        );
    }

    /** 規則層：景點推薦分數計算 */
    public double calculateScore(com.xiaobantian.model.Place place, RecommendRequest req) {
        double seasonalFit   = place.getSeasonAvailability()
                                    .contains(req.getSeason()) ? 5.0 : 1.0;
        double familyScore   = "FAMILY".equals(req.getTargetGroup())
                                    ? place.getFamilyFriendlyLevel() : 3.0;
        double carbonScore   = place.getCarbonFriendlyScore();
        double accessibility = place.getElderlyFriendlyLevel();
        double popularity    = 3.0;

        return 0.30 * seasonalFit
             + 0.25 * familyScore
             + 0.20 * carbonScore
             + 0.15 * accessibility
             + 0.10 * popularity;
    }
}
```

### 8.3 BookingService — 預約管理

```java
package com.xiaobantian.service;

import com.xiaobantian.model.Booking;
import com.xiaobantian.model.BookingStatus;
import com.xiaobantian.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public Booking confirm(Long id) {
        Booking b = bookingRepository.findById(id).orElseThrow();
        b.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(b);
    }

    public Booking cancel(Long id) {
        Booking b = bookingRepository.findById(id).orElseThrow();
        b.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(b);
    }

    public List<Booking> findPending() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }
}
```

***

## 九、Controller 層

### 9.1 ChatController — 導覽聊天機器人

```java
package com.xiaobantian.controller;

import com.xiaobantian.dto.ChatRequest;
import com.xiaobantian.service.RagService;
import com.xiaobantian.tool.PlaceTool;
import com.xiaobantian.tool.RouteTool;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatClient tourismChatClient;
    private final RagService ragService;
    private final RouteTool  routeTool;
    private final PlaceTool  placeTool;

    @PostMapping
    public String chat(@RequestBody ChatRequest req) {
        return tourismChatClient.prompt()
                .user(req.getMessage())
                .tools(routeTool, placeTool)
                .call()
                .content();
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestBody ChatRequest req) {
        return tourismChatClient.prompt()
                .user(req.getMessage())
                .tools(routeTool, placeTool)
                .stream()
                .content();
    }

    @PostMapping("/knowledge")
    public String knowledge(@RequestBody ChatRequest req) {
        return ragService.askKnowledge(req.getMessage());
    }
}
```

### 9.2 RecommendController — 智慧推薦

```java
package com.xiaobantian.controller;

import com.xiaobantian.dto.RecommendRequest;
import com.xiaobantian.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @PostMapping
    public String recommend(@RequestBody RecommendRequest req) {
        return recommendService.recommend(req);
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> recommendStream(@RequestBody RecommendRequest req) {
        return recommendService.recommendStream(req);
    }
}
```

### 9.3 BookingController — 預約管理

```java
package com.xiaobantian.controller;

import com.xiaobantian.model.Booking;
import com.xiaobantian.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public Booking create(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @PutMapping("/{id}/confirm")
    public Booking confirm(@PathVariable Long id) {
        return bookingService.confirm(id);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return bookingService.cancel(id);
    }

    @GetMapping("/pending")
    public List<Booking> pending() {
        return bookingService.findPending();
    }
}
```

***

## 十、API 端點總覽

| Method | 路徑 | 說明 | 回應類型 |
|---|---|---|---|
| `POST` | `/api/chat` | 導覽聊天機器人（Tool Calling） | `String` |
| `POST` | `/api/chat/stream` | 聊天機器人 SSE Streaming | `Flux<String>` |
| `POST` | `/api/chat/knowledge` | 食農知識庫 RAG 問答 | `String` |
| `POST` | `/api/recommend` | 依條件智慧推薦遊程 | `String` |
| `POST` | `/api/recommend/stream` | 推薦結果 SSE Streaming | `Flux<String>` |
| `POST` | `/api/bookings` | 新增預約 | `Booking` |
| `PUT` | `/api/bookings/{id}/confirm` | 確認預約 | `Booking` |
| `PUT` | `/api/bookings/{id}/cancel` | 取消預約 | `Booking` |
| `GET` | `/api/bookings/pending` | 查詢待處理預約清單 | `List<Booking>` |

***

## 十一、Spring AI 功能對應模組

| 功能 | Spring AI 元件 | 對應平台模組 |
|---|---|---|
| 導覽聊天對話 | `ChatClient` + `MessageChatMemoryAdvisor` | 聊天機器人、AI 導覽助理 |
| 食農知識問答 | `RetrievalAugmentationAdvisor` + pgvector | 食農知識庫 RAG |
| 智慧路線推薦 | `@Tool` + `RouteTool` / `PlaceTool` | 智慧推薦模組 |
| 季節語境注入 | 自訂 `SeasonalContextAdvisor` | 全站季節推薦 |
| 即時串流回應 | `.stream().content()` → `Flux<String>` | 前端 SSE 即時顯示 |
| 日誌追蹤 | `SimpleLoggerAdvisor` | 開發除錯 |

***

## 十二、推薦分數公式

景點分數加權公式如下，可作為規則層排序依據：

$$RouteScore = 0.30 \times SeasonalFit + 0.25 \times FamilyFriendly + 0.20 \times LowCarbonScore + 0.15 \times Accessibility + 0.10 \times Popularity$$

各指標來源：

- **SeasonalFit**：`place.seasonAvailability` 是否包含當前季節（符合 = 5，不符合 = 1）
- **FamilyFriendly**：`place.familyFriendlyLevel`（1–5 級）
- **LowCarbonScore**：`place.carbonFriendlyScore`（1–5 級）
- **Accessibility**：`place.elderlyFriendlyLevel`（1–5 級）
- **Popularity**：預設 3.0，後期可接 `user_feedback` 統計平均值

***

## 十三、本地開發環境啟動步驟

```bash
# 1. 啟動 PostgreSQL + pgvector（Docker）
docker run -d \
  --name pgvector \
  -e POSTGRES_DB=xiaobantian \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# 2. 設定環境變數
export OPENAI_API_KEY=sk-your-key-here

# 3. 啟動 Spring Boot 專案
./mvnw spring-boot:run
```

***

## 十四、後續擴充建議

| 優先 | 功能 | 說明 |
|---|---|---|
| 高 | RAG 知識庫建置 | 將茶文化、竹文化、食農知識等 PDF / 文章寫入 pgvector |
| 高 | Spring Security JWT | 實作角色權限（遊客 / 商家 / 協會 / 系統管理員） |
| 中 | 知識庫定期重新嵌入 | 使用 `@Scheduled` 自動更新 Vector Store |
| 中 | AI 後台內容生成 | 景點介紹文、活動摘要、SEO 標題自動產出 |
| 低 | 個人化推薦 | 依使用者瀏覽與預約行為優化推薦分數 |
| 低 | 多語系支援 | 英文 / 日文旅遊導覽 System Prompt 切換 |