package com.xiaobantian.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiaobantian.dto.WeatherInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    @Value("${cwa.api.key}")
    private String cwaApiKey;

    @Value("${cwa.api.base-url}")
    private String cwaApiBaseUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherInfo getCurrentWeather(String city, Double lat, Double lon) {
        if (city == null || city.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CWA 版本目前請提供 city");
        }
        return getCurrentWeatherByCity(city);
    }

    public WeatherInfo getCurrentWeatherByCity(String city) {
        validateApiKey();

        String normalizedCity = normalizeCity(city);

        String url = UriComponentsBuilder
                .fromHttpUrl(cwaApiBaseUrl)
                .queryParam("Authorization", cwaApiKey)
                .queryParam("format", "JSON")
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);

            log.info("CWA request url={}", url);
            log.info("CWA raw response={}", response);

            return parseCwaResponse(response, normalizedCity);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "CWA 天氣查詢失敗，city=" + city + "，normalizedCity=" + normalizedCity +
                            "，外部回應=" + e.getResponseBodyAsString()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "無法取得 CWA 天氣資訊，city=" + city + "，原因=" + e.getMessage()
            );
        }
    }

    private WeatherInfo parseCwaResponse(String response, String normalizedCity) throws Exception {
        JsonNode root = objectMapper.readTree(response);

        String success = root.path("success").asText();
        if (!"true".equalsIgnoreCase(success)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "CWA 回傳 success != true，原始回應=" + response
            );
        }

        JsonNode records = root.path("records");
        if (records.isMissingNode() || records.isNull()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "CWA records 不存在，原始回應=" + response
            );
        }

        JsonNode locations = records.path("location");

        if (locations.isMissingNode() || !locations.isArray() || locations.isEmpty()) {
            JsonNode locationsWrapper = records.path("locations");
            if (locationsWrapper.isArray() && !locationsWrapper.isEmpty()) {
                locations = locationsWrapper.get(0).path("location");
            }
        }

        if (locations.isMissingNode() || !locations.isArray() || locations.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "找不到地點天氣資料：" + normalizedCity + "，原始回應=" + response
            );
        }

        JsonNode location = null;
        for (JsonNode loc : locations) {
            String locationName = loc.path("locationName").asText();
            if (normalizedCity.equals(locationName)) {
                location = loc;
                break;
            }
        }

        if (location == null) {
            location = locations.get(0);
        }

        JsonNode weatherElements = location.path("weatherElement");
        if (weatherElements.isMissingNode() || !weatherElements.isArray()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "weatherElement 不存在，原始回應=" + response
            );
        }

        String wx = null;
        Integer pop = null;
        Integer minT = null;
        String ci = null;
        Integer maxT = null;
        String startTime = null;
        String endTime = null;

        for (JsonNode element : weatherElements) {
            String elementName = element.path("elementName").asText();
            JsonNode timeArray = element.path("time");
            if (!timeArray.isArray() || timeArray.isEmpty()) {
                continue;
            }

            JsonNode time0 = timeArray.get(0);

            if (startTime == null) startTime = time0.path("startTime").asText(null);
            if (endTime == null) endTime = time0.path("endTime").asText(null);

            String value = null;

            if (time0.path("parameter").isObject()) {
                value = time0.path("parameter").path("parameterName").asText();
            } else if (time0.path("elementValue").isArray() && !time0.path("elementValue").isEmpty()) {
                value = time0.path("elementValue").get(0).path("value").asText();
            }

            switch (elementName) {
                case "Wx" -> wx = value;
                case "PoP" -> pop = tryParseInt(value);
                case "MinT" -> minT = tryParseInt(value);
                case "CI" -> ci = value;
                case "MaxT" -> maxT = tryParseInt(value);
            }
        }

        WeatherInfo info = new WeatherInfo();
        info.setProvider("CWA");
        info.setLocation(location.path("locationName").asText(normalizedCity));
        info.setStartTime(startTime);
        info.setEndTime(endTime);
        info.setWeatherMain(wx);
        info.setDescription(wx);
        info.setRainProbability(pop);
        info.setMinTemperature(minT);
        info.setMaxTemperature(maxT);
        info.setComfort(ci);

        boolean rainy = isRainy(wx, pop);
        boolean hot = maxT != null && maxT >= 30;
        boolean suitableOutdoor = !rainy && (maxT == null || maxT < 33);

        info.setRainy(rainy);
        info.setHot(hot);
        info.setSuitableOutdoor(suitableOutdoor);

        return info;
    }

    private boolean isRainy(String weatherMain, Integer pop) {
        boolean byText = weatherMain != null &&
                (weatherMain.contains("雨") || weatherMain.contains("雷") || weatherMain.contains("陣雨"));
        boolean byPop = pop != null && pop >= 50;
        return byText || byPop;
    }

    private Integer tryParseInt(String value) {
        try {
            return Integer.parseInt(value);
        } catch (Exception e) {
            return null;
        }
    }

    private void validateApiKey() {
        if (cwaApiKey == null || cwaApiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "cwa.api.key 尚未設定，請在 .env 設定 CWA_API_KEY"
            );
        }
    }

    private String normalizeCity(String city) {
    String c = city == null ? "" : city.trim();
    if (c.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "city 不能為空");
    }

    c = c.replace("台", "臺");

    // 先處理英文 city（全部台灣縣市）
    String normalizedEnglish = switch (c) {
        case "Taipei"          -> "臺北市";
        case "New Taipei"      -> "新北市";
        case "Taoyuan"         -> "桃園市";
        case "Taichung"        -> "臺中市";
        case "Tainan"          -> "臺南市";
        case "Kaohsiung"       -> "高雄市";
        case "Keelung"         -> "基隆市";
        case "Hsinchu"         -> "新竹市";
        case "Chiayi"          -> "嘉義市";
        case "Hualien"         -> "花蓮縣";
        case "Yilan"           -> "宜蘭縣";
        case "Taitung"         -> "臺東縣";
        case "Penghu"          -> "澎湖縣";
        case "Kinmen"          -> "金門縣";
        case "Lienchiang"      -> "連江縣";
        case "Matsu"           -> "連江縣";
        case "Hsinchu County"  -> "新竹縣";
        case "Miaoli"          -> "苗栗縣";
        case "Changhua"        -> "彰化縣";
        case "Nantou"          -> "南投縣";
        case "Yunlin"          -> "雲林縣";
        case "Chiayi County"   -> "嘉義縣";
        case "Pingtung"        -> "屏東縣";
        default                -> null; // 不是英文城市
    };

    if (normalizedEnglish != null) {
        return normalizedEnglish;
    }

    // 再處理中文 city（繁體中文縣市）
    return switch (c) {
        case "臺北" -> "臺北市";
        case "新北" -> "新北市";
        case "桃園" -> "桃園市";
        case "臺中" -> "臺中市";
        case "臺南" -> "臺南市";
        case "高雄" -> "高雄市";
        case "基隆" -> "基隆市";
        case "新竹市" -> "新竹市";  // 省轄市
        case "新竹" -> "新竹縣";    // 當使用者輸入「新竹」預設是縣
        case "苗栗" -> "苗栗縣";
        case "彰化" -> "彰化縣";
        case "南投" -> "南投縣";
        case "雲林" -> "雲林縣";
        case "嘉義市" -> "嘉義市";  // 省轄市
        case "嘉義" -> "嘉義縣";    // 當使用者輸入「嘉義」預設是縣
        case "屏東" -> "屏東縣";
        case "宜蘭" -> "宜蘭縣";
        case "花蓮" -> "花蓮縣";
        case "臺東" -> "臺東縣";
        case "澎湖" -> "澎湖縣";
        case "金門" -> "金門縣";
        case "連江", "馬祖" -> "連江縣";
        case "鹿谷", "鹿谷鄉", "竹山", "竹山鎮" -> "南投縣";
        default -> c; 
    };
}
}