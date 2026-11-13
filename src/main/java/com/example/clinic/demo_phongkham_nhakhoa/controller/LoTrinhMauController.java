
package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LoTrinhMauResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiMauResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.LoTrinhMauService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lo-trinh-mau")
public class LoTrinhMauController {

    private final LoTrinhMauService loTrinhMauService;

    public LoTrinhMauController(
            LoTrinhMauService loTrinhMauService) {

        this.loTrinhMauService = loTrinhMauService;
    }

    // API 1: Lấy danh sách tất cả lộ trình mẫu
    @GetMapping
    public List<LoTrinhMauResponse> layTatCaLoTrinhMau() {

        return loTrinhMauService.layTatCaLoTrinhMau();
    }

    // API 2: Lấy thông tin một lộ trình mẫu theo mã
    @GetMapping("/{maLoTrinh}")
    public LoTrinhMauResponse layLoTrinhTheoMa(
            @PathVariable String maLoTrinh) {

        return loTrinhMauService.layLoTrinhTheoMa(maLoTrinh);
    }

    // API 3: Lấy tất cả buổi của một lộ trình mẫu
    @GetMapping("/{maLoTrinh}/buoi")
    public List<BuoiMauResponse> layDanhSachBuoi(
            @PathVariable String maLoTrinh) {

        return loTrinhMauService.layDanhSachBuoi(maLoTrinh);
    }
}
