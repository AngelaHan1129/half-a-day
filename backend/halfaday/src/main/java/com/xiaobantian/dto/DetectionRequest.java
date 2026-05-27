// ============================================================
// src/main/java/com/xiaobantian/dto/DetectionRequest.java
// ============================================================
package com.xiaobantian.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;

public class DetectionRequest {

    @NotBlank(message = "className 不可為空")
    private String className;

    @DecimalMin(value = "0.0") @DecimalMax(value = "1.0")
    private double confidence;

    private String locale     = "zh-TW";  // 預設繁體中文
    private String deviceType = "android"; // "ios" | "android"

    public DetectionRequest() {}

    public DetectionRequest(String className, double confidence, String locale, String deviceType) {
        this.className  = className;
        this.confidence = confidence;
        this.locale     = locale;
        this.deviceType = deviceType;
    }

    public String getClassName()           { return className; }
    public void   setClassName(String v)   { this.className = v; }

    public double getConfidence()          { return confidence; }
    public void   setConfidence(double v)  { this.confidence = v; }

    public String getLocale()              { return locale; }
    public void   setLocale(String v)      { this.locale = v; }

    public String getDeviceType()          { return deviceType; }
    public void   setDeviceType(String v)  { this.deviceType = v; }
}