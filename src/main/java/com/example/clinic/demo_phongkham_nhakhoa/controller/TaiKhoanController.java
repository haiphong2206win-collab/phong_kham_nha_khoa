package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatTaiKhoanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatTrangThaiTaiKhoanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoTaiKhoanBacSiRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoTaiKhoanBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.TaiKhoanQuanLyResponse;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;
import com.example.clinic.demo_phongkham_nhakhoa.service.TaiKhoanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tai-khoan")
public class TaiKhoanController {

    private final TaiKhoanService taiKhoanService;

    public TaiKhoanController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    // Tạo tài khoản bệnh nhân và hồ sơ bệnh nhân.
    @PostMapping("/benh-nhan")
    public TaiKhoanQuanLyResponse taoTaiKhoanBenhNhan(
            @Valid @RequestBody TaoTaiKhoanBenhNhanRequest request) {

        return taiKhoanService.taoTaiKhoanBenhNhan(request);
    }

    // Tạo tài khoản bác sĩ và hồ sơ bác sĩ.
    @PostMapping("/bac-si")
    public TaiKhoanQuanLyResponse taoTaiKhoanBacSi(
            @Valid @RequestBody TaoTaiKhoanBacSiRequest request) {

        return taiKhoanService.taoTaiKhoanBacSi(request);
    }

    // Lấy danh sách, có thể lọc theo vai trò và trạng thái.
    @GetMapping
    public List<TaiKhoanQuanLyResponse> layDanhSach(
            @RequestParam(required = false) VaiTro vaiTro,
            @RequestParam(required = false) TrangThaiTaiKhoan trangThai) {

        return taiKhoanService.layDanhSach(vaiTro, trangThai);
    }

    // Xem chi tiết một tài khoản.
    @GetMapping("/{maTaiKhoan}")
    public TaiKhoanQuanLyResponse timTheoId(
            @PathVariable String maTaiKhoan) {

        return taiKhoanService.timTaiKhoanQuanLyTheoId(maTaiKhoan);
    }

    // Cập nhật tên đăng nhập và/hoặc mật khẩu.
    @PutMapping("/{maTaiKhoan}")
    public TaiKhoanQuanLyResponse capNhat(
            @PathVariable String maTaiKhoan,
            @Valid @RequestBody CapNhatTaiKhoanRequest request,
            Principal principal) {

        return taiKhoanService.capNhatTaiKhoan(
                maTaiKhoan,
                request,
                principal.getName()
        );
    }

    // Khóa hoặc kích hoạt tài khoản.
    @PatchMapping("/{maTaiKhoan}/trang-thai")
    public TaiKhoanQuanLyResponse capNhatTrangThai(
            @PathVariable String maTaiKhoan,
            @Valid @RequestBody CapNhatTrangThaiTaiKhoanRequest request,
            Principal principal) {

        return taiKhoanService.capNhatTrangThai(
                maTaiKhoan,
                request.getDangHoatDong(),
                principal.getName()
        );
    }

    // Xóa mềm: chuyển tài khoản sang trạng thái bị khóa.
    @DeleteMapping("/{maTaiKhoan}")
    public ResponseEntity<Void> xoaMem(
            @PathVariable String maTaiKhoan,
            Principal principal) {

        taiKhoanService.xoaMem(maTaiKhoan, principal.getName());

        return ResponseEntity.noContent().build();
    }
}