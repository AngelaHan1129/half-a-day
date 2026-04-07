package com.xiaobantian.controller;

import com.xiaobantian.advisor.SeasonalContextAdvisor;
import com.xiaobantian.dto.ChatRequest;
import com.xiaobantian.service.RagService;
import com.xiaobantian.tool.PlaceTool;
import com.xiaobantian.tool.RouteTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;   // ← 新 API
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
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

        // Spring AI 1.0.0 正式 API
        ChatMemory chatMemory = MessageWindowChatMemory.builder().build();
        MessageChatMemoryAdvisor memoryAdvisor = MessageChatMemoryAdvisor
                .builder(chatMemory)
                .build();

        this.chatClient = chatClientBuilder
                .defaultTools(placeTool, routeTool)
                .defaultAdvisors(memoryAdvisor)
                .build();
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(
            @RequestParam String sessionId,
            @RequestParam String message) {

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

    @PostMapping
    public String chat(@RequestBody ChatRequest request) {
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