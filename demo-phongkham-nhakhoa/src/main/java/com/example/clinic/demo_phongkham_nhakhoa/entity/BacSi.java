package com.example.clinic.demo_phongkham_nhakhoa.entity;
import com.example.clinic.demo_phongkham_nhakhoa.enums.*;

import java.time.*;
import java.util.List;
import jakarta.persistence.*;

@Entity
public class BacSi {
    @Id
    private String maBacSi;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ma_tai_khoan")
    private TaiKhoan taiKhoan;

    private String hoTen;
    private String soDienThoai;
    private String soChungChi;
    private boolean dangLamViec;

    // Ánh xạ 1-Nhiều với CaLamViec, FetchType.EAGER để lấy dữ liệu ngay
    @OneToMany(mappedBy = "bacSi", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<CaLamViec> danhSachCaLam;

    // Constructors, Getters, Setters...

    public boolean dangHoatDong() {
        return this.dangLamViec;
    }

    public boolean laChuPhongKham() {
        return this.taiKhoan != null && this.taiKhoan.coVaiTro(VaiTro.CHU_PHONG_KHAM);
    }

    public boolean coCaLamViec(LocalDate ngay, CaKham ca) {
        if (danhSachCaLam == null) return false;
        for (CaLamViec caLam : danhSachCaLam) {
            if (caLam.getNgayLamViec().equals(ngay) && caLam.getCaKham() == ca && caLam.isDangHoatDong()) {
                return true;
            }
        }
        return false;
    }

    public List<CaLamViec> getDanhSachCaLam() {
        return danhSachCaLam;
    }

    public boolean coTheNhanLich(LocalDateTime batDauMoi, LocalDateTime ketThucMoi, List<LichKham> lichHienCo) {
        if (!dangHoatDong()) return false;

        for (LichKham lichCu : lichHienCo) {
            LocalDateTime batDauCu = LocalDateTime.of(lichCu.getNgayKham(), lichCu.getGioBatDau());
            LocalDateTime ketThucCu = LocalDateTime.of(lichCu.getNgayKham(), lichCu.getGioKetThuc());

            // Công thức kiểm tra trùng lịch được chỉ định trong tài liệu
            if (batDauMoi.isBefore(ketThucCu) && ketThucMoi.isAfter(batDauCu)) {
                return false; // Bị trùng lịch
            }
        }
        return true;
    }
}
