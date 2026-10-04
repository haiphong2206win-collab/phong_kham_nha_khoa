package com.example.clinic.demo_phongkham_nhakhoa.notification.controller;
//Controller nhận yêu cầu từ website, gọi NotificationService xử lý rồi trả kết quả. Controller không trực tiếp đọc hoặc lưu H2.

// cung cấp API thông báo cho website.

/* 
GET   /api/v1/notifications/me
GET   /api/v1/notifications/me?unreadOnly=true
PATCH /api/v1/notifications/{id}/read
*/

import com.example.clinic.demo_phongkham_nhakhoa.notification.dto.response.NotificationResponse;
import com.example.clinic.demo_phongkham_nhakhoa.notification.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")

public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Lấy danh sách thông báo của bệnh nhân.
    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponse>> layThongBaoCuaToi(
            @RequestHeader("X-Benh-Nhan-Id") String benhNhanId,

            @RequestParam(name = "unreadOnly", defaultValue = "false") boolean unreadOnly) {
        List<NotificationResponse> danhSachThongBao;

        if (unreadOnly) {
            danhSachThongBao = notificationService.layThongBaoChuaDoc(
                    benhNhanId);
        } else {
            danhSachThongBao = notificationService.layThongBaoCuaBenhNhan(
                    benhNhanId);
        }

        return ResponseEntity.ok(danhSachThongBao);
    }

    // Đánh dấu một thông báo là đã đọc.

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> danhDauThongBaoDaDoc(
            @PathVariable("id") String maThongBao,

            @RequestHeader("X-Benh-Nhan-Id") String benhNhanId) {
        NotificationResponse response = notificationService.danhDauDaDoc(
                maThongBao,
                benhNhanId);

        return ResponseEntity.ok(response);
    }
}
