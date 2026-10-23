package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatHoSoBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TuChoiLichKhamRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BenhNhanResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LichKhamBenhNhanResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.service.BenhNhanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/benh-nhan")
public class BenhNhanController {

    private final BenhNhanService benhNhanService;

    public BenhNhanController(BenhNhanService benhNhanService) {
        this.benhNhanService = benhNhanService;
    }

    // GET /api/v1/patients/me - Xem hồ sơ cá nhân của tài khoản đang đăng nhập
    @GetMapping("/ho-so-cua-toi")
    public BenhNhanResponse xemHoSoCuaToi(Principal principal) {
        // Lấy tên đăng nhập từ token JWT / Principal
        String tenDangNhap = principal.getName();
        BenhNhan benhNhan = benhNhanService.timTheoTenDangNhap(tenDangNhap);
        return chuyenSangBenhNhanResponse(benhNhan);
    }

    // PUT /api/v1/patients/me - Hoàn thiện hoặc cập nhật hồ sơ cá nhân
    @PutMapping("/ho-so-cua-toi")
    public BenhNhanResponse capNhatHoSoCuaToi(
            Principal principal,
            @Valid @RequestBody CapNhatHoSoBenhNhanRequest request) {

        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Bạn cần đăng nhập để cập nhật hồ sơ"
            );
        }

        BenhNhan benhNhan = benhNhanService.capNhatHoSo(
                principal.getName(),
                request
        );
        return chuyenSangBenhNhanResponse(benhNhan);
    }

    // PATCH /api/v1/benh-nhan/lich-kham/{maLich}/xac-nhan
    // Bệnh nhân xác nhận lịch khám
    @PatchMapping("/lich-kham/{maLich}/xac-nhan")
    public LichKhamBenhNhanResponse xacNhanLichKham(
            Principal principal,
            @PathVariable String maLich
    ) {
        return benhNhanService.xacNhanLichKham(
                principal.getName(),
                maLich
        );
    }

    // PATCH /api/v1/benh-nhan/lich-kham/{maLich}/tu-choi
    // Bệnh nhân từ chối lịch khám
    @PatchMapping("/lich-kham/{maLich}/tu-choi")
    public LichKhamBenhNhanResponse tuChoiLichKham(
            Principal principal,
            @PathVariable String maLich,
            @Valid @RequestBody TuChoiLichKhamRequest request
    ) {
        return benhNhanService.tuChoiLichKham(
                principal.getName(),
                maLich,
                request.getLyDo()
        );
    }

    // Chuyen BenhNhan sang BenhNhanResponse
    private BenhNhanResponse chuyenSangBenhNhanResponse(BenhNhan benhNhan) {
        return new BenhNhanResponse(benhNhan.getMaBenhNhan(), benhNhan.getHoTen(), benhNhan.getNgaySinh(), benhNhan.getGioiTinh(), benhNhan.getDiaChi(), benhNhan.getSoDienThoai(), benhNhan.getEmail(), benhNhan.getDiUngThuoc(), benhNhan.getTaiKhoan().getMaTaiKhoan());
    }
}
