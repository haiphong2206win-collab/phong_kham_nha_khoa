package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BacSiQuanLyResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BenhNhanQuanLyResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.QuanLyHoSoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quan-ly")
public class QuanLyHoSoController {

    private final QuanLyHoSoService quanLyHoSoService;

    public QuanLyHoSoController(
            QuanLyHoSoService quanLyHoSoService
    ) {
        this.quanLyHoSoService = quanLyHoSoService;
    }

    // GET /api/v1/quan-ly/bac-si
    @GetMapping("/bac-si")
    public List<BacSiQuanLyResponse> layDanhSachBacSi() {
        return quanLyHoSoService.layDanhSachBacSi();
    }

    // GET /api/v1/quan-ly/bac-si/{maBacSi}
    @GetMapping("/bac-si/{maBacSi}")
    public BacSiQuanLyResponse xemChiTietBacSi(
            @PathVariable String maBacSi
    ) {
        return quanLyHoSoService.xemChiTietBacSi(maBacSi);
    }

    // GET /api/v1/quan-ly/benh-nhan
    @GetMapping("/benh-nhan")
    public List<BenhNhanQuanLyResponse> layDanhSachBenhNhan() {
        return quanLyHoSoService.layDanhSachBenhNhan();
    }

    // GET /api/v1/quan-ly/benh-nhan/{maBenhNhan}
    @GetMapping("/benh-nhan/{maBenhNhan}")
    public BenhNhanQuanLyResponse xemChiTietBenhNhan(
            @PathVariable String maBenhNhan
    ) {
        return quanLyHoSoService.xemChiTietBenhNhan(maBenhNhan);
    }
}
