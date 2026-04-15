package com.xiaobantian.dto;

public class WeatherInfo {

    private String provider;
    private String location;
    private String startTime;
    private String endTime;

    private String weatherMain;
    private String description;
    private Integer rainProbability;
    private Integer minTemperature;
    private Integer maxTemperature;
    private String comfort;

    private boolean rainy;
    private boolean hot;
    private boolean suitableOutdoor;

    public WeatherInfo() {}

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getWeatherMain() {
        return weatherMain;
    }

    public void setWeatherMain(String weatherMain) {
        this.weatherMain = weatherMain;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getRainProbability() {
        return rainProbability;
    }

    public void setRainProbability(Integer rainProbability) {
        this.rainProbability = rainProbability;
    }

    public Integer getMinTemperature() {
        return minTemperature;
    }

    public void setMinTemperature(Integer minTemperature) {
        this.minTemperature = minTemperature;
    }

    public Integer getMaxTemperature() {
        return maxTemperature;
    }

    public void setMaxTemperature(Integer maxTemperature) {
        this.maxTemperature = maxTemperature;
    }

    public String getComfort() {
        return comfort;
    }

    public void setComfort(String comfort) {
        this.comfort = comfort;
    }

    public boolean isRainy() {
        return rainy;
    }

    public void setRainy(boolean rainy) {
        this.rainy = rainy;
    }

    public boolean isHot() {
        return hot;
    }

    public void setHot(boolean hot) {
        this.hot = hot;
    }

    public boolean isSuitableOutdoor() {
        return suitableOutdoor;
    }

    public void setSuitableOutdoor(boolean suitableOutdoor) {
        this.suitableOutdoor = suitableOutdoor;
    }
}