package com.xiaobantian.service;

import com.xiaobantian.dto.RecommendRequest;
import com.xiaobantian.dto.WeatherInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final ChatClient.Builder chatClientBuilder;
    private final WeatherService weatherService;
    private final RagService ragService;

    private static final String SYSTEM_PROMPT = """
            你是「小半天平台」的 AI 旅遊行程推薦顧問。
            你擅長根據旅遊地點、旅伴類型、旅遊風格、可用時間、預算與天氣條件，
            推薦適合的台灣旅遊景點、行程安排、餐飲建議與雨備方案。

            請務必遵守以下規則：
            1. 一律使用繁體中文回答。
            2. 回答要具體、可執行，不要空泛。
            3. 如果有天氣資訊，務必根據天氣調整行程。
            4. 若下雨，優先提供室內、半室內、可雨備的景點與安排。
            5. 若天氣炎熱，避免長時間曝曬，優先安排室內、林蔭、傍晚活動。
            6. 若適合戶外，可多安排步道、散步、拍照、戶外景點。
            7. 回答格式要清楚，至少包含：
               - 推薦理由
               - 建議行程安排
               - 推薦景點/活動
               - 餐飲建議
               - 注意事項
            8. 如果資訊不足，可以合理推估，但請保持實用。
            """;

    public String recommend(RecommendRequest req) {
        validateRequest(req);

        String ragContext = buildRagContext(req);
        String weatherContext = buildWeatherContext(req);
        String userPrompt = buildUserPrompt(req, ragContext, weatherContext);

        ChatClient chatClient = chatClientBuilder.build();

        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userPrompt)
                .call()
                .content();
    }

    public Flux<String> recommendStream(RecommendRequest req) {
        validateRequest(req);

        String ragContext = buildRagContext(req);
        String weatherContext = buildWeatherContext(req);
        String userPrompt = buildUserPrompt(req, ragContext, weatherContext);

        ChatClient chatClient = chatClientBuilder.build();

        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userPrompt)
                .stream()
                .content();
    }

    private void validateRequest(RecommendRequest req) {
        if (req == null) {
            throw new IllegalArgumentException("RecommendRequest 不可為空");
        }
        if (req.getDestination() == null || req.getDestination().isBlank()) {
            throw new IllegalArgumentException("destination 不可為空");
        }
    }

    private String buildRagContext(RecommendRequest req) {
        try {
            String keyword = buildRagQuery(req);
            String rag = ragService.retrieveContext(keyword, 3);
            return (rag == null || rag.isBlank()) ? "" : "【在地知識資料】\n" + rag + "\n";
        } catch (Exception e) {
            return "";
        }
    }

    private String buildRagQuery(RecommendRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append(req.getDestination());

        if (req.getTravelStyle() != null && !req.getTravelStyle().isBlank()) {
            sb.append(" ").append(req.getTravelStyle());
        }
        if (req.getPreferences() != null && !req.getPreferences().isBlank()) {
            sb.append(" ").append(req.getPreferences());
        }

        return sb.toString();
    }

    private String buildWeatherContext(RecommendRequest req) {
        Boolean weatherAware = req.getWeatherAware();

        if (weatherAware == null || !weatherAware) {
            return "";
        }

        try {
            WeatherInfo weather = weatherService.getCurrentWeather(req.getDestination(), null, null);

            return """
                    【天氣資訊】
                    資料來源：%s
                    地點：%s
                    預報時段：%s ～ %s
                    天氣狀況：%s
                    描述：%s
                    降雨機率：%s%%
                    最低溫：%s°C
                    最高溫：%s°C
                    舒適度：%s
                    是否下雨：%s
                    是否炎熱：%s
                    是否適合戶外：%s

                    請根據以上天氣資訊調整推薦內容，避免與天氣條件衝突。
                    """.formatted(
                    safe(weather.getProvider()),
                    safe(weather.getLocation()),
                    safe(weather.getStartTime()),
                    safe(weather.getEndTime()),
                    safe(weather.getWeatherMain()),
                    safe(weather.getDescription()),
                    safeNumber(weather.getRainProbability()),
                    safeNumber(weather.getMinTemperature()),
                    safeNumber(weather.getMaxTemperature()),
                    safe(weather.getComfort()),
                    weather.isRainy() ? "是" : "否",
                    weather.isHot() ? "是" : "否",
                    weather.isSuitableOutdoor() ? "是" : "否"
            );
        } catch (Exception e) {
            return """
                    【天氣資訊】
                    目前無法取得天氣資料：%s
                    請改以一般旅遊條件提供推薦，但若涉及戶外活動，仍需提醒使用者注意天氣變化。
                    """.formatted(e.getMessage());
        }
    }

    private String buildUserPrompt(RecommendRequest req, String ragContext, String weatherContext) {
        return """
                請根據以下資訊，推薦適合的旅遊行程：

                【旅遊需求】
                目的地：%s
                偏好：%s
                旅伴類型：%s
                旅遊風格：%s
                可用時間：%s 小時
                預算：%s
                是否啟用天氣感知：%s

                %s

                %s

                請輸出：
                1. 先用 2~3 句說明整體推薦方向
                2. 提供 3~5 個推薦景點或活動
                3. 排出一個簡單順遊行程
                4. 補充餐飲或休息建議
                5. 如果天氣不佳，提供雨備或替代方案
                6. 回答務必具體，不要只講抽象概念
                """.formatted(
                safe(req.getDestination()),
                safe(req.getPreferences()),
                safe(defaultCompanion(req.getCompanionType())),
                safe(defaultTravelStyle(req.getTravelStyle())),
                req.getDurationHours() == null ? 4 : req.getDurationHours(),
                safe(defaultBudget(req.getBudgetLevel())),
                (req.getWeatherAware() != null && req.getWeatherAware()) ? "是" : "否",
                ragContext == null ? "" : ragContext,
                weatherContext == null ? "" : weatherContext
        );
    }

    private String defaultCompanion(String value) {
        if (value == null || value.isBlank()) return "未指定";
        return switch (value.toLowerCase()) {
            case "solo" -> "獨旅";
            case "couple" -> "情侶";
            case "family" -> "家庭";
            case "friends" -> "朋友";
            case "elder" -> "長輩同行";
            default -> value;
        };
    }

    private String defaultTravelStyle(String value) {
        if (value == null || value.isBlank()) return "一般輕鬆旅遊";
        return switch (value.toLowerCase()) {
            case "chill" -> "放鬆散策";
            case "food" -> "美食探索";
            case "nature" -> "自然景觀";
            case "culture" -> "人文文化";
            case "photography" -> "拍照打卡";
            default -> value;
        };
    }

    private String defaultBudget(String value) {
        if (value == null || value.isBlank()) return "中等";
        return switch (value.toLowerCase()) {
            case "low" -> "低預算";
            case "medium" -> "中等預算";
            case "high" -> "高預算";
            default -> value;
        };
    }

    private String safe(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }

    private String safeNumber(Integer value) {
        return value == null ? "-" : String.valueOf(value);
    }
}