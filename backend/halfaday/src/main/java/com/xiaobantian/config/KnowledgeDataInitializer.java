package com.xiaobantian.config;

import com.xiaobantian.model.KnowledgeItem;
import com.xiaobantian.repository.KnowledgeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KnowledgeDataInitializer {

    @Bean
    CommandLineRunner initKnowledge(KnowledgeRepository repository) {
        return args -> {
            seed(repository, "bamboo_grove", "小半天", "孟宗竹林",
                "小半天擁有廣闊的孟宗竹林，是地方最具代表性的山林景觀之一。",
                "小半天的重要產業包含孟宗竹與茶葉，竹林景觀清幽高雅，除了適合散步與生態導覽，也和竹筍、竹炭、竹藝等地方生活文化緊密相連。",
                null, null,
                "[\"自然景觀\",\"孟宗竹\",\"在地產業\",\"森林療癒\"]",
                "[\"bamboo_shoots\",\"carpentry\",\"park\"]");

            seed(repository, "tea_field", "小半天", "高山茶園",
                "小半天與大崙山一帶是著名茶區，展現鹿谷山區特有的茶鄉風貌。",
                "小半天是重要的茶產地，也是全台重要茶苗繁殖區之一；當地茶文化和山區雲霧、海拔條件、製茶技術密切相關，適合結合採茶、品茗與茶席體驗。",
                null, null,
                "[\"農業文化\",\"茶產業\",\"高山茶\",\"茶鄉景觀\"]",
                "[\"tea\",\"ginkgo_forest\",\"person\"]");

            seed(repository, "ginkgo_forest", "小半天", "銀杏森林",
                "小半天擁有大面積銀杏造林，秋季轉黃時是最具代表性的山區景觀之一。",
                "當地逐步發展茶園與混合造林，形成大面積銀杏林景觀；如今銀杏森林已成為鹿谷小半天的重要旅遊亮點。",
                null, null,
                "[\"自然景觀\",\"秋季限定\",\"銀杏\",\"茶園共景\"]",
                "[\"tea_field\",\"park\",\"waterfall\"]");

            seed(repository, "waterfall", "小半天", "山林瀑布",
                "小半天有德興瀑布等自然景點，適合散步、觀瀑與避暑。",
                "德興瀑布是小半天的重要自然景點之一，周邊適合結合散步、觀瀑與避暑活動；瀑布景觀也和小半天的山谷地形、生態資源與旅遊動線密切相關。",
                null, null,
                "[\"自然景觀\",\"瀑布\",\"步道\",\"避暑\"]",
                "[\"bridge\",\"park\",\"firefly\"]");

            seed(repository, "bridge", "小半天", "半天橋與山區橋景",
                "橋梁串連小半天聚落、溪谷與景點入口，是旅遊動線的重要節點。",
                "在小半天的地形中，橋梁不只是交通設施，也是一種觀看山谷、溪流與聚落風景的轉換點，能幫助旅客理解地方的山區生活與路線脈絡。",
                null, null,
                "[\"人文空間\",\"橋梁\",\"交通節點\",\"景觀視角\"]",
                "[\"waterfall\",\"park\",\"sign\"]");

            seed(repository, "park", "小半天", "石馬公園與休憩空間",
                "石馬公園是小半天重要的休憩節點，也是賞櫻與串連周邊景點的熱門入口。",
                "石馬公園周邊可串連孟宗竹林古戰場、長源圳生態步道與德興瀑布等景點，形成小半天具代表性的旅遊軸線；櫻花季更是地方亮點。",
                null, null,
                "[\"人文空間\",\"公園\",\"櫻花\",\"親子旅遊\"]",
                "[\"cherry_blossoms\",\"bamboo_grove\",\"waterfall\"]");

            seed(repository, "person", "小半天", "遊客與在地居民",
                "在小半天，人物畫面常延伸到茶農、筍農、導覽員與社區工作者。",
                "小半天的旅遊特色來自自然景觀與在地產業的結合，因此人物畫面常能延伸到食農教育、體驗活動、地方創生與社區導覽等內容。",
                null, null,
                "[\"人文\",\"地方生活\",\"社區\",\"旅遊互動\"]",
                "[\"tea\",\"tea_field\",\"bamboo_shoots\"]");

            seed(repository, "sign", "小半天", "景區指標與解說牌",
                "景區指標與解說牌是認識小半天地景、生態與歷史的重要入口。",
                "在小半天，解說系統常與步道、瀑布、竹林古戰場、長源圳及農遊據點結合，適合搭配前端做成可延伸閱讀的導覽資訊。",
                null, null,
                "[\"導覽\",\"解說系統\",\"旅遊資訊\",\"場域認識\"]",
                "[\"bridge\",\"park\",\"bamboo_grove\"]");

            seed(repository, "bamboo_shoots", "小半天", "孟宗竹筍",
                "孟宗竹筍是小半天的重要農產，可延伸到挖筍體驗與地方飲食文化。",
                "小半天的孟宗竹筍可分為冬筍與春筍，除了是農民重要收入來源，也能延伸成挖筍體驗、竹筍料理與食農教育內容。",
                null, null,
                "[\"農特產\",\"竹筍\",\"在地飲食\",\"農遊體驗\"]",
                "[\"bamboo_grove\",\"carpentry\",\"person\"]");

            seed(repository, "tea", "小半天", "茶葉與茶文化",
                "茶不只是農產品，也是小半天地方生活與待客文化的重要核心。",
                "小半天可延伸到品茗、茶席、製茶與茶會形式等內容，尤其圍爐煮茶、茶席導覽與茶文化體驗，很適合轉化為前端知識卡與互動內容。",
                null, null,
                "[\"茶文化\",\"農業文化\",\"品茗\",\"旅遊體驗\"]",
                "[\"tea_field\",\"person\",\"firefly\"]");

            seed(repository, "cherry_blossoms", "小半天", "櫻花景觀",
                "小半天石馬公園是鹿谷知名賞櫻景點之一，櫻花季時非常受歡迎。",
                "石馬公園的櫻花景觀已成為地方重要亮點，並與周邊竹林、步道與瀑布景點串連，形成春季與初秋都適合走訪的旅遊軸線。",
                null, null,
                "[\"花季\",\"櫻花\",\"季節景觀\",\"公園\"]",
                "[\"park\",\"ginkgo_forest\",\"sign\"]");

            seed(repository, "firefly", "小半天", "螢火蟲生態",
                "鹿谷小半天一帶具螢火蟲觀賞資源，春末夏初可結合夜間導覽。",
                "小半天的螢火蟲活動常與竹豐社區、茶席體驗及生態導覽結合，適合在前端延伸成季節限定的夜間生態知識內容。",
                null, null,
                "[\"生態旅遊\",\"夜間活動\",\"季節限定\",\"螢火蟲\"]",
                "[\"tea\",\"waterfall\",\"park\"]");

            seed(repository, "carpentry", "小半天", "竹藝與手作工藝",
                "小半天的工藝文化與竹產業關係密切，可延伸竹編、竹器與手作體驗。",
                "當地可延伸到竹編 DIY、竹管茶餅、竹製器具與地方手作活動等內容；若辨識場景偏向竹製作品，前端可將此類別解釋為竹藝文化，更貼近在地脈絡。",
                null, null,
                "[\"工藝文化\",\"竹藝\",\"手作\",\"地方創生\"]",
                "[\"bamboo_grove\",\"bamboo_shoots\",\"person\"]");
        };
    }

    private void seed(
        KnowledgeRepository repository,
        String detectedClass,
        String region,
        String title,
        String shortIntro,
        String fullIntro,
        String arGlbPath,
        String arUsdzPath,
        String tags,
        String relatedClasses
    ) {
        if (repository.findByDetectedClassAndRegion(detectedClass, region).isPresent()) {
            return;
        }

        KnowledgeItem item = KnowledgeItem.builder()
            .detectedClass(detectedClass)
            .region(region)
            .title(title)
            .shortIntro(shortIntro)
            .fullIntro(fullIntro)
            .arGlbPath(arGlbPath)
            .arUsdzPath(arUsdzPath)
            .tags(tags)
            .relatedClasses(relatedClasses)
            .build();

        repository.save(item);
    }
}