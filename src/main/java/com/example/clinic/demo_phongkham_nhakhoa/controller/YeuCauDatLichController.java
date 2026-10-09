package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoYeuCauDatLichRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.YeuCauDatLichResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.YeuCauDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.service.YeuCauDatLichService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appointment-requests")
public class YeuCauDatLichController {

    private final YeuCauDatLichService yeuCauDatLichService;

    public YeuCauDatLichController(YeuCauDatLichService yeuCauDatLichService) {
        this.yeuCauDatLichService = yeuCauDatLichService;
    }

    // POST /api/v1/appointment-requests - Bệnh nhân gửi yêu cầu đặt lịch
    @PostMapping
    public YeuCauDatLichResponse guiYeuCau(Principal principal,
                                           @Valid @RequestBody TaoYeuCauDatLichRequest request) {
        String tenDangNhap = principal != null ? principal.getName() : "vinh123";
        return yeuCauDatLichService.guiYeuCau(tenDangNhap, request);
    }

    // GET /api/v1/appointment-requests/me - Bệnh nhân xem danh sách các yêu cầu của mình
    @GetMapping("/me")
    public List<YeuCauDatLichResponse> layDanhSachCuaToi(Principal principal) {
        String tenDangNhap = principal != null ? principal.getName() : "vinh123";
        return yeuCauDatLichService.layDanhSachCuaToi(tenDangNhap);
    }

    // GET - Tim yeu cau dat lich theo Id
    @GetMapping("/{maYeuCau}")
    public YeuCauDatLichResponse timTheoId(@PathVariable String maYeuCau) {
        return yeuCauDatLichService.layChiTiet(maYeuCau);
    }

    @PatchMapping("/{id}/cancel")
    public YeuCauDatLichResponse huyYeuCau(@PathVariable("id") String id,
                                           Principal principal,
                                           @RequestBody HashMap<String, String> body) {
        String tenDangNhap = principal != null ? principal.getName() : "vinh123";
        String lyDo = body.getOrDefault("lyDo", "Người dùng tự hủy");
        return yeuCauDatLichService.huyYeuCau(id, tenDangNhap, lyDo);
    }
}
