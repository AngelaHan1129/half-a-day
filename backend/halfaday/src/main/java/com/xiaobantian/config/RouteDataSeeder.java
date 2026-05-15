package com.xiaobantian.config;

import com.xiaobantian.model.Place;
import com.xiaobantian.model.Route;
import com.xiaobantian.model.RouteStop;
import com.xiaobantian.repository.PlaceRepository;
import com.xiaobantian.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RouteDataSeeder implements CommandLineRunner {

    private final RouteRepository routeRepository;
    private final PlaceRepository placeRepository;

    @Override
    public void run(String... args) {
        if (routeRepository.count() > 0) {
            return;
        }

        List<Place> places = placeRepository.findAll();
        if (places.size() < 3) {
            System.out.println("[RouteDataSeeder] 至少需要 3 筆景點資料才能建立示範路線。");
            return;
        }

        Place p1 = places.get(0);
        Place p2 = places.get(1);
        Place p3 = places.get(2);

        Route route1 = new Route();
        route1.setName("小半天經典半日遊");
        route1.setDescription("適合第一次來訪旅客的半日路線，串連經典景點與輕鬆步調行程。");
        route1.setDurationHours(4);
        route1.setSuitableSeasons("spring,summer,autumn,winter");
        route1.setDifficulty("easy");
        route1.setGroupSizeNote("2-6 人最適合");
        route1.setCoverImage(firstNonBlank(p1.getImageUrls(), p2.getImageUrls(), p3.getImageUrls()));

        List<RouteStop> route1Stops = new ArrayList<>();
        route1Stops.add(createStop(route1, p1, 1, 60, "第一站建議安排拍照與集合。", "開車約 10 分鐘"));
        route1Stops.add(createStop(route1, p2, 2, 90, "第二站可安排在地體驗或用餐。", "開車約 8 分鐘"));
        route1Stops.add(createStop(route1, p3, 3, 60, "最後一站適合收尾與自由活動。", "行程結束"));
        route1.setStops(route1Stops);

        Route route2 = new Route();
        route2.setName("森林慢旅步道線");
        route2.setDescription("以自然景觀與步道體驗為主，適合喜歡輕健行與山林氛圍的旅客。");
        route2.setDurationHours(5);
        route2.setSuitableSeasons("spring,autumn");
        route2.setDifficulty("medium");
        route2.setGroupSizeNote("4-8 人皆可");
        route2.setCoverImage(firstNonBlank(p2.getImageUrls(), p3.getImageUrls(), p1.getImageUrls()));

        List<RouteStop> route2Stops = new ArrayList<>();
        route2Stops.add(createStop(route2, p2, 1, 80, "建議早上出發，避開中午較熱時段。", "步行或接駁約 15 分鐘"));
        route2Stops.add(createStop(route2, p3, 2, 120, "此站可安排較長停留與導覽。", "開車約 12 分鐘"));
        route2Stops.add(createStop(route2, p1, 3, 45, "回程前可作簡單休息與整理。", "行程結束"));
        route2.setStops(route2Stops);

        routeRepository.saveAll(List.of(route1, route2));

        System.out.println("[RouteDataSeeder] 已建立 2 筆示範旅遊路線資料。");
    }

    private RouteStop createStop(
            Route route,
            Place place,
            int order,
            int stayMinutes,
            String note,
            String transportToNext
    ) {
        RouteStop stop = new RouteStop();
        stop.setRoute(route);
        stop.setPlace(place);
        stop.setStopOrder(order);
        stop.setStayMinutes(stayMinutes);
        stop.setNote(note);
        stop.setTransportToNext(transportToNext);
        return stop;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }
}