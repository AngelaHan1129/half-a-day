package com.xiaobantian.service;

import com.xiaobantian.advisor.SeasonalContextAdvisor;
import com.xiaobantian.dto.RecommendRequest;
import com.xiaobantian.tool.PlaceTool;
import com.xiaobantian.tool.RouteTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class RecommendService {

    private final ChatClient chatClient;
    private final RagService ragService;
    private final SeasonalContextAdvisor seasonalContextAdvisor;

    private static final String BASE_SYSTEM_PROMPT = """
            你是「小半天平台」的旅遊推薦助手，專精於台灣在地旅遊行程規劃。
            請根據使用者的需求，結合目前的季節與天氣資訊，提供個性化的景點、餐廳與行程路線推薦。
            推薦原則：
            1. 優先推薦符合當前季節的活動與景點
            2. 考量使用者的人數、預算與天數
            3. 建議合理的交通動線，減少重複奔波
            4. 搭配在地美食與特色體驗
            5. 回應語言：繁體中文，語氣親切友善
            """;

    public RecommendService(ChatClient.Builder chatClientBuilder,
                            RagService ragService,
                            SeasonalContextAdvisor seasonalContextAdvisor,
                            PlaceTool placeTool,
                            RouteTool routeTool) {
        this.ragService = ragService;
        this.seasonalContextAdvisor = seasonalContextAdvisor;
        this.chatClient = chatClientBuilder
                .defaultTools(placeTool, routeTool)
                .build();
    }

    public Flux<String> recommendStream(RecommendRequest request) {
        String systemPrompt = seasonalContextAdvisor.getSeasonalSystemPrompt() + BASE_SYSTEM_PROMPT;
        String ragContext = ragService.retrieveContext(buildQueryFromRequest(request), 5);
        String userMessage = buildUserMessage(request, ragContext);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userMessage)
                .stream()
                .content();
    }

    public String recommend(RecommendRequest request) {
        String systemPrompt = seasonalContextAdvisor.getSeasonalSystemPrompt() + BASE_SYSTEM_PROMPT;
        String ragContext = ragService.retrieveContext(buildQueryFromRequest(request), 5);
        String userMessage = buildUserMessage(request, ragContext);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userMessage)
                .call()
                .content();
    }

    private String buildUserMessage(RecommendRequest request, String ragContext) {
        StringBuilder sb = new StringBuilder();
        if (!ragContext.isEmpty()) {
            sb.append(ragContext).append("\n\n根據以上參考資料，");
        }
        sb.append("請為我規劃旅遊行程。\n");
        if (request.getDestination() != null) sb.append("目的地：").append(request.getDestination()).append("\n");
        if (request.getDays() != null) sb.append("天數：").append(request.getDays()).append(" 天\n");
        if (request.getPeople() != null) sb.append("人數：").append(request.getPeople()).append(" 人\n");
        if (request.getBudget() != null) sb.append("預算：").append(request.getBudget()).append("\n");
        if (request.getInterests() != null && !request.getInterests().isEmpty())
            sb.append("興趣偏好：").append(String.join("、", request.getInterests())).append("\n");
        if (request.getSpecialNeeds() != null) sb.append("特殊需求：").append(request.getSpecialNeeds()).append("\n");
        return sb.toString();
    }

    private String buildQueryFromRequest(RecommendRequest request) {
        StringBuilder sb = new StringBuilder();
        if (request.getDestination() != null) sb.append(request.getDestination()).append(" ");
        if (request.getInterests() != null) sb.append(String.join(" ", request.getInterests()));
        return sb.toString().trim();
    }
}