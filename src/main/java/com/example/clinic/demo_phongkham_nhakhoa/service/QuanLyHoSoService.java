package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BacSiQuanLyResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BenhNhanQuanLyResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BacSiRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class QuanLyHoSoService {

    private final BacSiRepository bacSiRepository;
    private final BenhNhanRepository benhNhanRepository;

    public QuanLyHoSoService(
            BacSiRepository bacSiRepository,
            BenhNhanRepository benhNhanRepository
    ) {
        this.bacSiRepository = bacSiRepository;
        this.benhNhanRepository = benhNhanRepository;
    }

    // Lấy danh sách bác sĩ
    public List<BacSiQuanLyResponse> layDanhSachBacSi() {
        return bacSiRepository.findAll()
                .stream()
                .map(this::chuyenBacSiSangResponse)
                .toList();
    }

    // Xem chi tiết một bác sĩ
    public BacSiQuanLyResponse xemChiTietBacSi(String maBacSi) {
        BacSi bacSi = bacSiRepository.findById(maBacSi)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy bác sĩ: " + maBacSi
                ));

        return chuyenBacSiSangResponse(bacSi);
    }

    // Lấy danh sách bệnh nhân
    public List<BenhNhanQuanLyResponse> layDanhSachBenhNhan() {
        return benhNhanRepository.findAll()
                .stream()
                .map(this::chuyenBenhNhanSangResponse)
                .toList();
    }

    // Xem chi tiết một bệnh nhân
    public BenhNhanQuanLyResponse xemChiTietBenhNhan(
            String maBenhNhan
    ) {
        BenhNhan benhNhan = benhNhanRepository.findById(maBenhNhan)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy bệnh nhân: " + maBenhNhan
                ));

        return chuyenBenhNhanSangResponse(benhNhan);
    }

    // Chuyển entity BacSi sang DTO
    private BacSiQuanLyResponse chuyenBacSiSangResponse(
            BacSi bacSi
    ) {
        TaiKhoan taiKhoan = bacSi.getTaiKhoan();

        return new BacSiQuanLyResponse(
                bacSi.getMaBacSi(),
                bacSi.getHoTen(),
                bacSi.getSoDienThoai(),
                bacSi.getSoChungChi(),
                bacSi.isDangLamViec(),

                taiKhoan != null
                        ? taiKhoan.getMaTaiKhoan() : null,
                taiKhoan != null
                        ? taiKhoan.getTenDangNhap() : null,
                taiKhoan != null
                        ? taiKhoan.getTrangThai() : null,
                taiKhoan != null
                        ? taiKhoan.getNgayTao() : null
        );
    }

    // Chuyển entity BenhNhan sang DTO
    private BenhNhanQuanLyResponse chuyenBenhNhanSangResponse(
            BenhNhan benhNhan
    ) {
        TaiKhoan taiKhoan = benhNhan.getTaiKhoan();

        return new BenhNhanQuanLyResponse(
                benhNhan.getMaBenhNhan(),
                benhNhan.getHoTen(),
                benhNhan.getNgaySinh(),
                benhNhan.getGioiTinh(),
                benhNhan.getSoDienThoai(),
                benhNhan.getEmail(),
                benhNhan.getDiaChi(),
                benhNhan.getTienSuBenh(),
                benhNhan.getDiUngThuoc(),

                taiKhoan != null
                        ? taiKhoan.getMaTaiKhoan() : null,
                taiKhoan != null
                        ? taiKhoan.getTenDangNhap() : null,
                taiKhoan != null
                        ? taiKhoan.getTrangThai() : null,
                taiKhoan != null
                        ? taiKhoan.getNgayTao() : null
        );
    }
}
