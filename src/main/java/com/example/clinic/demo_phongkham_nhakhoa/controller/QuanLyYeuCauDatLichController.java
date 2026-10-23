package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.YeuCauDatLichResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.YeuCauDatLichService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quan-ly/yeu-cau-dat-lich")
public class QuanLyYeuCauDatLichController {

    private final YeuCauDatLichService yeuCauDatLichService;

    public QuanLyYeuCauDatLichController(
            YeuCauDatLichService yeuCauDatLichService
    ) {
        this.yeuCauDatLichService = yeuCauDatLichService;
    }

    // GET /api/quan-ly/yeu-cau-dat-lich
    // Bác sĩ chủ phòng khám xem toàn bộ yêu cầu đặt lịch.
    @GetMapping
    public List<YeuCauDatLichResponse> layDanhSachYeuCau() {
        return yeuCauDatLichService.layDanhSach();
    }
}
