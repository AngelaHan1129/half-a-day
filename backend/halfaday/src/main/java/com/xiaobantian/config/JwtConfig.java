package com.xiaobantian.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {

    /**
     * JWT 簽章金鑰
     */
    private String secret;

    /**
     * JWT 發行者
     */
    private String issuer = "xiaobantian-platform";

    /**
     * Access Token 過期時間（分鐘）
     */
    private long expireMinutes = 120;
}