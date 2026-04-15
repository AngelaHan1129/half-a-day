package com.xiaobantian.dto;

public class RecommendRequest {

    private String destination;     // 例如：台北市、南投縣、鹿谷
    private String preferences;     // 使用者額外需求，例如「想看茶園」「想吃在地小吃」
    private String companionType;   // solo / couple / family / friends / elder
    private String travelStyle;     // chill / food / nature / culture / photography
    private Integer durationHours;  // 例如 4、6、8
    private String budgetLevel;     // low / medium / high
    private Boolean weatherAware;   // 是否根據天氣調整推薦

    public RecommendRequest() {}

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    public String getCompanionType() {
        return companionType;
    }

    public void setCompanionType(String companionType) {
        this.companionType = companionType;
    }

    public String getTravelStyle() {
        return travelStyle;
    }

    public void setTravelStyle(String travelStyle) {
        this.travelStyle = travelStyle;
    }

    public Integer getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(Integer durationHours) {
        this.durationHours = durationHours;
    }

    public String getBudgetLevel() {
        return budgetLevel;
    }

    public void setBudgetLevel(String budgetLevel) {
        this.budgetLevel = budgetLevel;
    }

    public Boolean getWeatherAware() {
        return weatherAware;
    }

    public void setWeatherAware(Boolean weatherAware) {
        this.weatherAware = weatherAware;
    }
}