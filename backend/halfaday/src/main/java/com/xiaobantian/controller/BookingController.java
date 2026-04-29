package com.xiaobantian.controller;

import com.xiaobantian.model.Booking;
import com.xiaobantian.model.BookingStatus;
import com.xiaobantian.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Controller", description = "預約建立、查詢與狀態管理相關 API")
public class BookingController {

    private final BookingService bookingService;

    @Operation(
            summary = "建立預約",
            description = "新增一筆預約資料，包含使用者、路線、預約日期與相關資訊。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功建立預約",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或資料驗證失敗", content = @Content)
    })
    @PostMapping
    public Booking create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "預約建立資料",
                    required = true
            )
            @RequestBody Booking booking
    ) {
        return bookingService.createBooking(booking);
    }

    @Operation(
            summary = "查詢單筆預約",
            description = "依照預約 ID 取得指定預約詳細資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得預約資料",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "找不到指定預約", content = @Content)
    })
    @GetMapping("/{id}")
    public Booking findById(
            @Parameter(description = "預約 ID", required = true, example = "1")
            @PathVariable("id") Long id
    ) {
        return bookingService.findById(id);
    }

    @Operation(
            summary = "確認預約",
            description = "將指定預約狀態更新為已確認。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功確認預約",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "找不到指定預約", content = @Content),
            @ApiResponse(responseCode = "400", description = "預約狀態不可確認", content = @Content)
    })
    @PutMapping("/{id}/confirm")
    public Booking confirm(
            @Parameter(description = "要確認的預約 ID", required = true, example = "1")
            @PathVariable("id") Long id
    ) {
        return bookingService.confirm(id);
    }

    @Operation(
            summary = "取消預約",
            description = "將指定預約狀態更新為已取消。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取消預約",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "找不到指定預約", content = @Content),
            @ApiResponse(responseCode = "400", description = "預約狀態不可取消", content = @Content)
    })
    @PutMapping("/{id}/cancel")
    public Booking cancel(
            @Parameter(description = "要取消的預約 ID", required = true, example = "1")
            @PathVariable("id") Long id
    ) {
        return bookingService.cancel(id);
    }

    @Operation(
            summary = "完成預約",
            description = "將指定預約狀態更新為已完成。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功完成預約",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "找不到指定預約", content = @Content),
            @ApiResponse(responseCode = "400", description = "預約狀態不可完成", content = @Content)
    })
    @PutMapping("/{id}/complete")
    public Booking complete(
            @Parameter(description = "要完成的預約 ID", required = true, example = "1")
            @PathVariable("id") Long id
    ) {
        return bookingService.complete(id);
    }

    @Operation(
            summary = "查詢待處理預約",
            description = "取得所有狀態為待處理的預約資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得待處理預約清單",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            )
    })
    @GetMapping("/pending")
    public List<Booking> pending() {
        return bookingService.findPending();
    }

    @Operation(
            summary = "依使用者 Email 查詢預約",
            description = "依照使用者 Email 取得其所有預約資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得使用者預約清單",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/user")
    public List<Booking> byUser(
            @Parameter(description = "使用者 Email", required = true, example = "user@example.com")
            @RequestParam("email") String email
    ) {
        return bookingService.findByUserEmail(email);
    }

    @Operation(
            summary = "依路線查詢預約",
            description = "依照路線 ID 取得該路線相關的所有預約資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得路線預約清單",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/route/{routeId}")
    public List<Booking> byRoute(
            @Parameter(description = "路線 ID", required = true, example = "1")
            @PathVariable("routeId") Long routeId
    ) {
        return bookingService.findByRouteId(routeId);
    }

    @Operation(
            summary = "依使用者與狀態查詢預約",
            description = "依照使用者 Email 與預約狀態查詢符合條件的預約資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得符合條件的預約清單",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Booking.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/user/status")
    public List<Booking> byUserAndStatus(
            @Parameter(description = "使用者 Email", required = true, example = "user@example.com")
            @RequestParam("email") String email,
            @Parameter(
                    description = "預約狀態",
                    required = true,
                    schema = @Schema(
                            implementation = BookingStatus.class,
                            allowableValues = {"PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"}
                    )
            )
            @RequestParam("status") BookingStatus status
    ) {
        return bookingService.findByUserEmailAndStatus(email, status);
    }
}