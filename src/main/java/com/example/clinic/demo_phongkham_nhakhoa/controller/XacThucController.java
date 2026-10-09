package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThongTinDangKiRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThongTinDangNhapRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.KetQuaXacThucResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.TaiKhoanService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class XacThucController {

    private final TaiKhoanService taiKhoanService;

    public XacThucController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    // POST /api/v1/auth/register
    @PostMapping("/register")
    public KetQuaXacThucResponse dangKy(@Valid @RequestBody ThongTinDangKiRequest request) {
        return taiKhoanService.dangKy(request);
    }

    // POST /api/v1/auth/login
    @PostMapping("/login")
    public KetQuaXacThucResponse dangNhap(@Valid @RequestBody ThongTinDangNhapRequest request) {
        return taiKhoanService.dangNhap(request);
    }
}
