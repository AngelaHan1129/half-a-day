可以，下面我直接幫你規劃成 **可落地的前端 sitemap + React TSX 元件架構**，會以你現在的資料夾方向為主，再補到可以直接開發的程度。小半天本身有三村聚落、茶苗與銀杏兩大全國性特色、德興瀑布、孟宗竹林古戰場，以及四季旅程如 3–4 月挖筍、3–5 月螢火蟲茶席、6–8 月星空茶席、9–10 月秋櫻茶席、10–12 月雲海茶席，這些都很適合做成敘事式互動網站的主線內容。 [ezgo.ardswc.gov](https://ezgo.ardswc.gov.tw/zh-tw/leisure-area/54/)

## Sitemap 規劃

這個站我建議分成 **前台導覽主站**、**互動功能頁**、**後台管理入口** 三層，因為小半天的內容不只是介紹型網站，還包含景點、遊程、體驗、商家、預約與 AR 導覽模組。 [lugu.org](https://www.lugu.org.tw)

```text
/
├─ 首頁 Home
│  ├─ Hero 沉浸式開場
│  ├─ 小半天故事
│  ├─ 四季旅程
│  ├─ 精選景點
│  ├─ 互動地圖入口
│  ├─ AR 體驗入口
│  ├─ 智慧推薦入口
│  └─ 預約 CTA
│
├─ about
│  ├─ 小半天由來
│  ├─ 開墾歷史
│  ├─ 三村聚落
│  ├─ 三大特色產業
│  └─ 地方文化故事
│
├─ spots
│  ├─ 景點總覽
│  ├─ 景點分類（自然 / 歷史 / 體驗 / 打卡）
│  └─ spots/:spotId
│     ├─ 景點資訊
│     ├─ 圖片 / 影片
│     ├─ 地圖位置
│     ├─ 推薦順遊
│     ├─ AR 查看
│     └─ 預約 / 前往方式
│
├─ seasons
│  ├─ 春季行程
│  ├─ 夏季行程
│  ├─ 秋季行程
│  ├─ 冬季行程
│  └─ seasons/:seasonId
│
├─ routes
│  ├─ 半日遊
│  ├─ 一日遊
│  ├─ 二日遊
│  ├─ 親子推薦
│  ├─ 長輩推薦
│  └─ routes/:routeId
│
├─ experiences
│  ├─ 農事體驗
│  ├─ 茶席體驗
│  ├─ 竹藝 DIY
│  ├─ 套裝行程
│  └─ experiences/:experienceId
│
├─ map
│  ├─ 互動地圖
│  ├─ 三村圖層
│  ├─ 景點點位
│  ├─ 商家點位
│  ├─ 路線規劃
│  └─ 附近推薦
│
├─ ar
│  ├─ AR 首頁
│  ├─ 裝置支援檢查
│  ├─ 桌面模型模式
│  ├─ 現地導覽模式
│  └─ AR 收藏 / 互動章
│
├─ recommend
│  ├─ 旅遊條件選擇
│  ├─ AI 推薦結果
│  └─ 推薦行程詳情
│
├─ booking
│  ├─ 體驗預約
│  ├─ 遊程預約
│  ├─ 填表流程
│  └─ 預約完成頁
│
├─ news
│  ├─ 最新消息列表
│  └─ news/:newsId
│
├─ faq
├─ contact
├─ login
└─ admin
   ├─ dashboard
   ├─ 景點管理
   ├─ 遊程管理
   ├─ 體驗管理
   ├─ 商家管理
   ├─ 最新消息管理
   ├─ 預約管理
   └─ 媒體素材管理
```

## 導覽邏輯

首頁不只是入口，而是整個品牌敘事主軸。因為小半天的內容很強調「從山霧中看見台地」、「竹林步道」、「四季農遊」，所以首頁應該用滾動來串接故事，再分流到景點、四季、地圖、AR、預約等功能頁，這樣體驗會比傳統官網更完整。 [lugu.org](https://www.lugu.org.tw/travel.html)
另外 WebXR 在不同裝置與瀏覽器支援差異仍存在，因此 `ar` 頁應獨立，不要把 AR 綁死在首頁主流程，否則部分裝置體驗會斷掉。 [browserstack](https://www.browserstack.com/guide/webxr-and-compatible-browsers)

## React 專案結構

你原本的資料夾方向是對的，我幫你補成更完整、可維護的版本。

```text
src/
├─ app/
│  ├─ router/
│  │  ├─ index.tsx
│  │  ├─ routeGuards.tsx
│  │  └─ paths.ts
│  ├─ providers/
│  │  ├─ ThemeProvider.tsx
│  │  ├─ MotionProvider.tsx
│  │  ├─ DeviceProvider.tsx
│  │  └─ QueryProvider.tsx
│  └─ store/
│     ├─ uiStore.ts
│     ├─ arStore.ts
│     ├─ mapStore.ts
│     └─ bookingStore.ts
│
├─ assets/
│  ├─ images/
│  ├─ icons/
│  ├─ models/
│  ├─ videos/
│  └─ data/
│
├─ components/
│  ├─ layout/
│  │  ├─ AppShell.tsx
│  │  ├─ Header.tsx
│  │  ├─ MobileMenu.tsx
│  │  ├─ Footer.tsx
│  │  ├─ SectionContainer.tsx
│  │  ├─ PageHero.tsx
│  │  ├─ Breadcrumbs.tsx
│  │  └─ ThemeToggle.tsx
│  │
│  ├─ common/
│  │  ├─ Button.tsx
│  │  ├─ Tag.tsx
│  │  ├─ Card.tsx
│  │  ├─ Modal.tsx
│  │  ├─ Drawer.tsx
│  │  ├─ Tabs.tsx
│  │  ├─ Accordion.tsx
│  │  ├─ EmptyState.tsx
│  │  ├─ LoadingSkeleton.tsx
│  │  ├─ SectionTitle.tsx
│  │  ├─ BadgeStat.tsx
│  │  ├─ ImageReveal.tsx
│  │  └─ ScrollHint.tsx
│  │
│  ├─ story/
│  │  ├─ StoryTimeline.tsx
│  │  ├─ DoorReveal.tsx
│  │  ├─ BambooParallax.tsx
│  │  ├─ MistTransition.tsx
│  │  ├─ ChapterIndicator.tsx
│  │  ├─ VillageIntro.tsx
│  │  ├─ HistoryMilestone.tsx
│  │  └─ SeasonSwitcher.tsx
│  │
│  ├─ map/
│  │  ├─ InteractiveMap.tsx
│  │  ├─ MapLegend.tsx
│  │  ├─ VillageLayerToggle.tsx
│  │  ├─ SpotMarker.tsx
│  │  ├─ RoutePolyline.tsx
│  │  ├─ SpotPreviewCard.tsx
│  │  ├─ NearbyPanel.tsx
│  │  └─ MapFilterBar.tsx
│  │
│  ├─ ar/
│  │  ├─ ARLauncher.tsx
│  │  ├─ ARSupportPanel.tsx
│  │  ├─ CameraPermissionGuide.tsx
│  │  ├─ ARModeSwitch.tsx
│  │  ├─ ARModelViewer.tsx
│  │  ├─ ARSpotInfoOverlay.tsx
│  │  ├─ ARCaptureButton.tsx
│  │  └─ ARBadgeCollection.tsx
│  │
│  ├─ booking/
│  │  ├─ BookingWizard.tsx
│  │  ├─ BookingCalendar.tsx
│  │  ├─ ParticipantSelector.tsx
│  │  ├─ BookingSummary.tsx
│  │  └─ BookingSuccessCard.tsx
│  │
│  ├─ recommend/
│  │  ├─ PreferenceForm.tsx
│  │  ├─ DurationSelector.tsx
│  │  ├─ AudienceSelector.tsx
│  │  ├─ ThemeSelector.tsx
│  │  ├─ RecommendationResult.tsx
│  │  └─ RouteReasonCard.tsx
│  │
│  └─ admin/
│     ├─ AdminSidebar.tsx
│     ├─ AdminTopbar.tsx
│     ├─ DataTable.tsx
│     ├─ EditorForm.tsx
│     ├─ MediaUploader.tsx
│     └─ StatusChip.tsx
│
├─ sections/
│  ├─ home/
│  │  ├─ HeroSection.tsx
│  │  ├─ HistorySection.tsx
│  │  ├─ SeasonsSection.tsx
│  │  ├─ SpotsSection.tsx
│  │  ├─ StoryMapSection.tsx
│  │  ├─ ExperienceSection.tsx
│  │  ├─ RecommendationSection.tsx
│  │  ├─ BookingSection.tsx
│  │  ├─ ARSection.tsx
│  │  └─ NewsSection.tsx
│  │
│  ├─ about/
│  │  ├─ OriginSection.tsx
│  │  ├─ VillageSection.tsx
│  │  ├─ IndustrySection.tsx
│  │  └─ CultureSection.tsx
│  │
│  ├─ spots/
│  │  ├─ SpotListSection.tsx
│  │  ├─ SpotFilterSection.tsx
│  │  ├─ SpotDetailSection.tsx
│  │  ├─ SpotGallerySection.tsx
│  │  └─ NearbySuggestionSection.tsx
│  │
│  ├─ seasons/
│  │  ├─ SeasonHeroSection.tsx
│  │  ├─ SeasonTimelineSection.tsx
│  │  ├─ SeasonalEventSection.tsx
│  │  └─ SeasonRouteSection.tsx
│  │
│  ├─ map/
│  │  ├─ MapHeroSection.tsx
│  │  ├─ VillageMapSection.tsx
│  │  └─ NearbyRouteSection.tsx
│  │
│  ├─ ar/
│  │  ├─ ARHeroSection.tsx
│  │  ├─ ARGuideSection.tsx
│  │  ├─ ARExperienceSection.tsx
│  │  └─ ARFallbackSection.tsx
│  │
│  └─ booking/
│     ├─ BookingHeroSection.tsx
│     ├─ BookingFormSection.tsx
│     └─ BookingNoticeSection.tsx
│
├─ pages/
│  ├─ Home.tsx
│  ├─ About.tsx
│  ├─ Spots.tsx
│  ├─ SpotDetail.tsx
│  ├─ Seasons.tsx
│  ├─ SeasonDetail.tsx
│  ├─ Routes.tsx
│  ├─ RouteDetail.tsx
│  ├─ Experiences.tsx
│  ├─ ExperienceDetail.tsx
│  ├─ MapPage.tsx
│  ├─ Recommend.tsx
│  ├─ Booking.tsx
│  ├─ BookingSuccess.tsx
│  ├─ ARPage.tsx
│  ├─ News.tsx
│  ├─ NewsDetail.tsx
│  ├─ FAQ.tsx
│  ├─ Contact.tsx
│  ├─ Login.tsx
│  ├─ admin/
│  │  ├─ AdminDashboard.tsx
│  │  ├─ AdminSpots.tsx
│  │  ├─ AdminRoutes.tsx
│  │  ├─ AdminExperiences.tsx
│  │  ├─ AdminBookings.tsx
│  │  ├─ AdminNews.tsx
│  │  └─ AdminMedia.tsx
│  └─ NotFound.tsx
│
├─ three/
│  ├─ SceneCanvas.tsx
│  ├─ BambooGate.tsx
│  ├─ TeaScene.tsx
│  ├─ GinkgoScene.tsx
│  ├─ WaterfallScene.tsx
│  ├─ VillageTerrain.tsx
│  ├─ FloatingMist.tsx
│  ├─ FireflyParticles.tsx
│  ├─ ScrollCameraRig.tsx
│  ├─ SceneLoader.tsx
│  └─ materials/
│     ├─ bambooMaterial.ts
│     ├─ mistMaterial.ts
│     └─ leafShader.ts
│
├─ hooks/
│  ├─ useScrollProgress.ts
│  ├─ useDoorTransition.ts
│  ├─ useParallaxDepth.ts
│  ├─ useDeviceCapability.ts
│  ├─ useXRSupport.ts
│  ├─ useMapFilters.ts
│  ├─ useSeasonTheme.ts
│  ├─ useSpotSearch.ts
│  ├─ useBookingForm.ts
│  └─ useMediaQuery.ts
│
├─ services/
│  ├─ api/
│  │  ├─ client.ts
│  │  ├─ spotsApi.ts
│  │  ├─ routesApi.ts
│  │  ├─ experiencesApi.ts
│  │  ├─ bookingApi.ts
│  │  ├─ newsApi.ts
│  │  └─ recommendApi.ts
│  ├─ ar/
│  │  ├─ xrSession.ts
│  │  ├─ cameraPermission.ts
│  │  └─ placement.ts
│  └─ map/
│     ├─ mapConfig.ts
│     └─ routeUtils.ts
│
├─ types/
│  ├─ api.ts
│  ├─ spot.ts
│  ├─ route.ts
│  ├─ season.ts
│  ├─ booking.ts
│  ├─ ar.ts
│  └─ map.ts
│
├─ mocks/
│  ├─ spots.mock.ts
│  ├─ seasons.mock.ts
│  ├─ routes.mock.ts
│  └─ news.mock.ts
│
├─ utils/
│  ├─ motion.ts
│  ├─ format.ts
│  ├─ capability.ts
│  ├─ image.ts
│  └─ constants.ts
│
├─ styles/
│  ├─ globals.css
│  ├─ tokens.css
│  ├─ animations.css
│  └─ sections.css
│
├─ main.tsx
└─ vite-env.d.ts
```

## Pages 職責

你現在列的 `Home.tsx / Spots.tsx / Routes.tsx / Admin.tsx` 太少，後面很容易把所有內容都塞進同一頁，維護會變差。小半天有景點、季節活動、套裝體驗、互動地圖、AR、預約，頁面最好按內容領域分開。 [lugu.org](https://www.lugu.org.tw/diy.html)

| 頁面 | 職責 |
|---|---|
| `Home.tsx` | 沉浸式首頁，負責故事導覽與分流。 [ezgo.ardswc.gov](https://ezgo.ardswc.gov.tw/zh-tw/leisure-area/54/) |
| `About.tsx` | 歷史由來、三村聚落、產業與文化內容。 [ezgo.ardswc.gov](https://ezgo.ardswc.gov.tw/zh-tw/leisure-area/54/) |
| `Spots.tsx` | 景點總覽、分類、篩選。 |
| `SpotDetail.tsx` | 單一景點詳情、地圖、順遊、AR。 |
| `Seasons.tsx` | 四季行程入口與主題切換。 [lugu.org](https://www.lugu.org.tw/travel.html) |
| `Routes.tsx` | 半日遊 / 一日遊 / 二日遊建議。 |
| `Experiences.tsx` | 竹編 DIY、竹炭鹹蛋、茶餅等體驗整合。 [lugu.org](https://www.lugu.org.tw/diy.html) |
| `MapPage.tsx` | 互動地圖與附近推薦。 |
| `ARPage.tsx` | 裝置檢測、AR 啟動與 fallback。 |
| `Recommend.tsx` | AI 智慧推薦流程。 |
| `Booking.tsx` | 預約流程與填表。 |
| `News.tsx` | 最新消息列表。 |
| `Admin/*` | 後台各模組管理。 |

## Home 頁面組成

首頁是整站最重要的頁面，建議用 section-based 組裝：

```tsx
<Home>
  <HeroSection />
  <HistorySection />
  <SeasonsSection />
  <SpotsSection />
  <StoryMapSection />
  <ExperienceSection />
  <RecommendationSection />
  <ARSection />
  <BookingSection />
  <NewsSection />
</Home>
```

這樣的好處是首頁既可以沉浸敘事，又能保留導流功能；也符合小半天「先被故事吸引，再去看行程與預約」的使用流程。 [ezgo.ardswc.gov](https://ezgo.ardswc.gov.tw/zh-tw/leisure-area/54/)

## 你原本的 sections 怎麼補強

你原本只有：

- `HeroSection.tsx`
- `HistorySection.tsx`
- `SeasonsSection.tsx`
- `SpotsSection.tsx`
- `BookingSection.tsx`
- `ARSection.tsx`

這是好開始，但還缺幾個關鍵區塊。

### 建議新增

- `StoryMapSection.tsx`：首頁中段直接放小半天互動地圖入口。
- `ExperienceSection.tsx`：竹編、茶餅、挖筍等 DIY/體驗活動。 [lugu.org](https://www.lugu.org.tw/diy.html)
- `RecommendationSection.tsx`：給 AI 推薦入口。
- `NewsSection.tsx`：接官方最新消息流。 [lugu.org](https://www.lugu.org.tw)

## 元件分層原則

這種專案最好分成 4 層：

1. **Page**：頁級路由容器。
2. **Section**：頁內大區塊。
3. **Feature Component**：功能模組，例如地圖、AR、預約。
4. **Common/UI**：可重用按鈕、卡片、彈窗。

這樣你之後要加後台、接 API、改樣式都不會太痛。

## `components/layout`

這裡是全站骨架，負責導覽和一致性。

建議元件：

- `AppShell.tsx`：包 header / main / footer。
- `Header.tsx`：主導覽列，含桌機導覽與 CTA。
- `MobileMenu.tsx`：手機抽屜選單。
- `Footer.tsx`：聯絡、地圖、協會資訊。
- `SectionContainer.tsx`：統一 section 寬度與 padding。
- `PageHero.tsx`：內頁共用 Hero。
- `Breadcrumbs.tsx`：景點詳情、文章頁會用到。
- `ThemeToggle.tsx`：白天/夜景主題切換。

## `components/story`

這是你網站的靈魂區，負責你說的「背景推進、像開門一樣」。

建議重點元件：

- `DoorReveal.tsx`：左右門片打開。
- `BambooParallax.tsx`：竹林多層視差。
- `MistTransition.tsx`：雲霧切場。
- `StoryTimeline.tsx`：開墾歷史年表。
- `ChapterIndicator.tsx`：滾動章節指示器。
- `VillageIntro.tsx`：竹林村 / 竹豐村 / 和雅村介紹。
- `SeasonSwitcher.tsx`：四季切換器。

## `components/map`

小半天地理性很強，三村與景點路線一定要有地圖模組。 [ezgo.ardswc.gov](https://ezgo.ardswc.gov.tw/zh-tw/leisure-area/54/)

建議：

- `InteractiveMap.tsx`：主地圖。
- `VillageLayerToggle.tsx`：三村圖層切換。
- `SpotMarker.tsx`：景點標記。
- `RoutePolyline.tsx`：遊程線段。
- `SpotPreviewCard.tsx`：點 marker 後彈出的資訊卡。
- `NearbyPanel.tsx`：附近景點與商家推薦。
- `MapFilterBar.tsx`：景點/民宿/餐飲/體驗篩選。

## `components/ar`

AR 模組一定要拆清楚，因為支援檢查、權限、fallback 都跟一般 UI 不同。 [reddit](https://www.reddit.com/r/WebXR/comments/1h14761/compatibility_roadmap/)

建議：

- `ARLauncher.tsx`：啟動 AR 按鈕。
- `ARSupportPanel.tsx`：告知是否支援。
- `CameraPermissionGuide.tsx`：相機權限說明。
- `ARModeSwitch.tsx`：桌面模型 / 現地導覽切換。
- `ARModelViewer.tsx`：不支援 XR 時的 3D 模型備援。
- `ARSpotInfoOverlay.tsx`：AR 上方景點資訊。
- `ARCaptureButton.tsx`：拍照按鈕。
- `ARBadgeCollection.tsx`：AR 收藏章。

## `three/`

這層專門放 3D 場景，不要跟普通 UI 混在一起，否則很亂。

你原本的：

- `SceneCanvas.tsx`
- `BambooGate.tsx`
- `TeaScene.tsx`
- `GinkgoScene.tsx`

我建議再加：

- `WaterfallScene.tsx`：德興瀑布場景。
- `VillageTerrain.tsx`：地形縮景模型。
- `FloatingMist.tsx`：雲霧粒子。
- `FireflyParticles.tsx`：螢火蟲效果，對應春夏茶席。 [lugu.org](https://www.lugu.org.tw/travel.html)
- `ScrollCameraRig.tsx`：滾動時推進鏡頭。
- `SceneLoader.tsx`：懶載入模型。

## Hooks 規劃

這個專案的 hooks 很重要，因為它是互動站，不只是 CRUD。

你原本的：

- `useScrollProgress.ts`
- `useDeviceCapability.ts`
- `useXRSupport.ts`

很好，我再補幾個：

- `useDoorTransition.ts`：控制門片開啟比例。
- `useParallaxDepth.ts`：控制背景各層位移。
- `useSeasonTheme.ts`：春夏秋冬配色與素材切換。
- `useMapFilters.ts`：地圖篩選。
- `useSpotSearch.ts`：景點查詢。
- `useBookingForm.ts`：預約表單狀態。
- `useMediaQuery.ts`：手機、平板、桌機判斷。

## API / 型別規劃

你前端若要接 Spring Boot，最好先把型別和 service 層分好，不然後面會很亂。

### `types/`

- `spot.ts`
- `route.ts`
- `season.ts`
- `experience.ts`
- `booking.ts`
- `news.ts`
- `ar.ts`
- `map.ts`

### `services/api/`

- `spotsApi.ts`
- `routesApi.ts`
- `experiencesApi.ts`
- `bookingApi.ts`
- `newsApi.ts`
- `recommendApi.ts`

這樣之後改 API route 或 token 邏輯，不用每個頁面都重改。

## 路由建議

你可以這樣定義：

```tsx
/
about
/spots
/spots/:spotId
/seasons
/seasons/:seasonId
/routes
/routes/:routeId
/experiences
/experiences/:experienceId
/map
/ar
/recommend
/booking
/booking/success
/news
/news/:newsId
/contact
/faq
/login
/admin/dashboard
/admin/spots
/admin/routes
/admin/experiences
/admin/bookings
/admin/news
/admin/media
```

## 開發優先順序

如果你現在就要開始切版，我建議順序如下：

1. `layout + common`
2. `Home sections`
3. `Spots + SpotDetail`
4. `Seasons + Routes + Experiences`
5. `MapPage`
6. `ARPage`
7. `Booking`
8. `Admin`

這樣做的原因是首頁與景點頁最能先看出成果，也最有利於提案展示。

## 最適合你的第一版

如果你想先做出一版可以 demo 的前端，我建議第一版先包含：

- `Home`
- `About`
- `Spots`
- `SpotDetail`
- `Seasons`
- `MapPage`
- `ARPage`
- `Booking`

因為這幾頁就能把「品牌故事、景點導覽、四季行程、互動地圖、AR、預約」整個小半天核心價值呈現出來。 [lugu.org](https://www.lugu.org.tw/diy.html)

## 你可以直接採用的精簡版目錄

如果你要先從簡，再逐步擴充，我建議你先用這版：

```text
src/
  components/
    layout/
    common/
    story/
    map/
    ar/
    booking/
  sections/
    home/
    about/
    spots/
    seasons/
    ar/
    booking/
  pages/
    Home.tsx
    About.tsx
    Spots.tsx
    SpotDetail.tsx
    Seasons.tsx
    MapPage.tsx
    ARPage.tsx
    Booking.tsx
    Admin.tsx
  three/
    SceneCanvas.tsx
    BambooGate.tsx
    TeaScene.tsx
    GinkgoScene.tsx
    WaterfallScene.tsx
    ScrollCameraRig.tsx
  hooks/
    useScrollProgress.ts
    useDoorTransition.ts
    useDeviceCapability.ts
    useXRSupport.ts
    useSeasonTheme.ts
  services/
    api/
  types/
  utils/
  styles/
```