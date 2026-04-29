package com.xiaobantian.controller;

import com.xiaobantian.model.Place;
import com.xiaobantian.model.PlaceType;
import com.xiaobantian.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@Tag(name = "Place Controller", description = "景點查詢與篩選相關 API")
public class PlaceController {

    private final PlaceService placeService;

    @Operation(
            summary = "取得全部景點",
            description = "查詢系統內所有景點資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得景點清單",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Place.class))
                    )
            )
    })
    @GetMapping
    public List<Place> findAll() {
        return placeService.findAll();
    }

    @Operation(
            summary = "取得單一景點",
            description = "依照景點 ID 查詢單筆景點詳細資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得景點資料",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Place.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "找不到指定景點", content = @Content)
    })
    @GetMapping("/{id}")
    public Place findById(
            @Parameter(description = "景點 ID", required = true, example = "1")
            @PathVariable("id") Long id
    ) {
        return placeService.findById(id);
    }

    @Operation(
            summary = "依景點類型查詢",
            description = "依照景點類型篩選符合條件的景點資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得指定類型景點清單",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Place.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "景點類型參數錯誤", content = @Content)
    })
    @GetMapping("/type/{type}")
    public List<Place> findByType(
            @Parameter(
                    description = "景點類型",
                    required = true,
                    schema = @Schema(
                            implementation = PlaceType.class
                    )
            )
            @PathVariable("type") PlaceType type
    ) {
        return placeService.findByType(type);
    }

    @Operation(
            summary = "關鍵字搜尋景點",
            description = "依照關鍵字搜尋景點名稱、描述或其他相關欄位。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得搜尋結果",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Place.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/search")
    public List<Place> search(
            @Parameter(description = "搜尋關鍵字", required = true, example = "瀑布")
            @RequestParam("keyword") String keyword
    ) {
        return placeService.searchByKeyword(keyword);
    }

    @Operation(
            summary = "依地點位置搜尋景點",
            description = "依照地區、地址或位置關鍵字查詢符合條件的景點資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得位置搜尋結果",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Place.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/location")
    public List<Place> searchByLocation(
            @Parameter(description = "位置關鍵字", required = true, example = "鹿谷")
            @RequestParam("q") String q
    ) {
        return placeService.searchByLocation(q);
    }
}