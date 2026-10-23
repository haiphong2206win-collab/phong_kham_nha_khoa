package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatTrangThaiLichRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BenhNhanTrongLichResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LichKhamBacSiResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.BacSiLichKhamService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bac-si/lich-kham")
public class BacSiLichKhamController {

    private final BacSiLichKhamService bacSiLichKhamService;

    public BacSiLichKhamController(
            BacSiLichKhamService bacSiLichKhamService
    ) {
        this.bacSiLichKhamService = bacSiLichKhamService;
    }

    // GET /api/v1/bac-si/lich-kham
    @GetMapping
    public List<LichKhamBacSiResponse> layLichCuaToi(
            Principal principal
    ) {
        return bacSiLichKhamService.layLichCuaToi(
                principal.getName()
        );
    }

    // GET /api/v1/bac-si/lich-kham/{maLich}/benh-nhan
    @GetMapping("/{maLich}/benh-nhan")
    public BenhNhanTrongLichResponse xemBenhNhanTrongLich(
            Principal principal,
            @PathVariable String maLich
    ) {
        return bacSiLichKhamService.xemBenhNhanTrongLich(
                principal.getName(),
                maLich
        );
    }

    // PATCH /api/v1/bac-si/lich-kham/{maLich}/trang-thai
    @PatchMapping("/{maLich}/trang-thai")
    public LichKhamBacSiResponse capNhatTrangThai(
            Principal principal,
            @PathVariable String maLich,
            @Valid @RequestBody CapNhatTrangThaiLichRequest request
    ) {
        return bacSiLichKhamService.capNhatTrangThai(
                principal.getName(),
                maLich,
                request.getTrangThai()
        );
    }
}
