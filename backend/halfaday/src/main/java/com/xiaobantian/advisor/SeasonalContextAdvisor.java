package com.xiaobantian.advisor;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Month;

@Component
public class SeasonalContextAdvisor {

    public String getSeasonalSystemPrompt() {
        LocalDate today = LocalDate.now();
        Month month = today.getMonth();
        String season = getSeason(month);
        String weather = getWeatherDescription(month);
        String recommendations = getSeasonalRecommendations(season);

        return String.format(
                "[季節背景資訊] 今天是 %d 年 %d 月 %d 日，目前是「%s」。" +
                "台灣當前天氣：%s。推薦重點：%s\n\n",
                today.getYear(), today.getMonthValue(), today.getDayOfMonth(),
                season, weather, recommendations
        );
    }

    private String getSeason(Month month) {
        return switch (month) {
            case MARCH, APRIL, MAY -> "春季";
            case JUNE, JULY, AUGUST -> "夏季";
            case SEPTEMBER, OCTOBER, NOVEMBER -> "秋季";
            case DECEMBER, JANUARY, FEBRUARY -> "冬季";
        };
    }

    private String getWeatherDescription(Month month) {
        return switch (month) {
            case MARCH, APRIL -> "春雨綿綿，氣溫回暖，建議攜帶雨具";
            case MAY -> "初夏炎熱，花季盛開，注意防曬";
            case JUNE -> "梅雨季節，多雨潮濕，注意防雨";
            case JULY, AUGUST -> "高溫酷暑，颱風季，注意防暑";
            case SEPTEMBER -> "初秋涼爽，颱風季尾聲，適合戶外";
            case OCTOBER, NOVEMBER -> "秋高氣爽，天氣宜人，最適合旅遊";
            case DECEMBER, JANUARY -> "冬季寒冷，北部多雨，山區可能有霧";
            case FEBRUARY -> "春節前後，氣溫較低，賞梅花的好時節";
        };
    }

    private String getSeasonalRecommendations(String season) {
        return switch (season) {
            case "春季" -> "賞花（櫻花、油桐花）、登山踏青、茶園體驗";
            case "夏季" -> "水上活動、夜市美食、避暑山區、螢火蟲季";
            case "秋季" -> "賞楓、採果體驗、登山健行、溫泉";
            case "冬季" -> "泡溫泉、年節文化活動、賞梅、南部日曬旅遊";
            default -> "四季皆宜的文化古蹟與美食探索";
        };
    }
}