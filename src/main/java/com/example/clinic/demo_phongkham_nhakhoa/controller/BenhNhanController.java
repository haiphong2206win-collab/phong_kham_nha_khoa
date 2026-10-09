package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatHoSoBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.service.BenhNhanService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/patients")
public class BenhNhanController {

    private final BenhNhanService benhNhanService;

    public BenhNhanController(BenhNhanService benhNhanService) {
        this.benhNhanService = benhNhanService;
    }

    // GET /api/v1/patients/me - Xem hồ sơ cá nhân của tài khoản đang đăng nhập
    @GetMapping("/me")
    public BenhNhan xemHoSoCuaToi(Principal principal) {
        // Lấy tên đăng nhập từ token JWT / Principal
        String tenDangNhap = principal != null ? principal.getName() : "vinh123";
        return benhNhanService.timTheoTenDangNhap(tenDangNhap);
    }

    // PUT /api/v1/patients/me - Hoàn thiện hoặc cập nhật hồ sơ cá nhân
    @PutMapping("/me")
    public BenhNhan capNhatHoSoCuaToi(Principal principal,
                                      @Valid @RequestBody CapNhatHoSoBenhNhanRequest request) {
        String tenDangNhap = principal != null ? principal.getName() : "vinh123";
        return benhNhanService.capNhatHoSo(tenDangNhap, request);
    }
}
