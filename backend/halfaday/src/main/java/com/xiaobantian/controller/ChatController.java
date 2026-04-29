package com.xiaobantian.controller;

import com.xiaobantian.advisor.SeasonalContextAdvisor;
import com.xiaobantian.dto.ChatRequest;
import com.xiaobantian.service.RagService;
import com.xiaobantian.tool.PlaceTool;
import com.xiaobantian.tool.RouteTool;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat Controller", description = "AI 旅遊聊天、RAG 查詢與即時串流回應 API")
public class ChatController {

    private final ChatClient chatClient;
    private final RagService ragService;
    private final SeasonalContextAdvisor seasonalContextAdvisor;

    private static final String CONVERSATION_ID_KEY = "chat_memory_conversation_id";

    private static final String BASE_SYSTEM_PROMPT = """
            你是「小半天平台」的 AI 旅遊顧問，能夠回答關於台灣旅遊的所有問題。
            你可以查詢景點、餐廳、住宿資訊，也可以推薦行程路線。
            請以繁體中文回答，語氣親切、專業。
            """;

    public ChatController(ChatClient.Builder chatClientBuilder,
                          RagService ragService,
                          SeasonalContextAdvisor seasonalContextAdvisor,
                          PlaceTool placeTool,
                          RouteTool routeTool) {
        this.ragService = ragService;
        this.seasonalContextAdvisor = seasonalContextAdvisor;

        ChatMemory chatMemory = MessageWindowChatMemory.builder().build();
        MessageChatMemoryAdvisor memoryAdvisor = MessageChatMemoryAdvisor
                .builder(chatMemory)
                .build();

        this.chatClient = chatClientBuilder
                .defaultTools(placeTool, routeTool)
                .defaultAdvisors(memoryAdvisor)
                .build();
    }

    @Operation(
            summary = "串流聊天",
            description = "以 Server-Sent Events (SSE) 方式串流回傳 AI 回應內容，適合前端即時顯示逐字生成結果。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功建立串流回應",
                    content = @Content(
                            mediaType = "text/event-stream",
                            schema = @Schema(type = "string", example = "推薦您先前往石馬公園，再安排竹藝工坊體驗。")
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求參數錯誤", content = @Content)
    })
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(
            @Parameter(description = "對話 Session ID，用來維持聊天記憶", required = true, example = "session-001")
            @RequestParam("sessionId") String sessionId,
            @Parameter(description = "使用者輸入訊息", required = true, example = "請推薦小半天一日遊行程")
            @RequestParam("message") String message) {

        String systemPrompt = seasonalContextAdvisor.getSeasonalSystemPrompt() + BASE_SYSTEM_PROMPT;
        String ragContext = ragService.retrieveContext(message, 3);
        String userMessage = ragContext.isEmpty() ? message : ragContext + "\n\n" + message;

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userMessage)
                .advisors(a -> a.param(CONVERSATION_ID_KEY, sessionId))
                .stream()
                .content();
    }

    @Operation(
            summary = "一般聊天",
            description = "送出單次聊天請求，系統會結合季節提示、RAG 檢索內容與工具能力回傳完整 AI 回答。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得 AI 回答",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string", example = "推薦您從小半天高架橋開始，接著到德興瀑布。")
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或欄位缺漏", content = @Content)
    })
    @PostMapping
    public String chat(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "聊天請求資料，需包含 sessionId 與 message",
                    required = true
            )
            @RequestBody ChatRequest request) {

        String systemPrompt = seasonalContextAdvisor.getSeasonalSystemPrompt() + BASE_SYSTEM_PROMPT;
        String ragContext = ragService.retrieveContext(request.getMessage(), 3);
        String userMessage = ragContext.isEmpty()
                ? request.getMessage()
                : ragContext + "\n\n" + request.getMessage();

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userMessage)
                .advisors(a -> a.param(CONVERSATION_ID_KEY, request.getSessionId()))
                .call()
                .content();
    }
}