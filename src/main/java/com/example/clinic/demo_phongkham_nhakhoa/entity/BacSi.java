package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class BacSi {

    @Id
    @Column(nullable = false, updatable = false)
    private String maBacSi;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tai_khoan", unique = true)
    private TaiKhoan taiKhoan;

    private String hoTen;

    private String soDienThoai;

    private String soChungChi;

    private boolean dangLamViec;

    @OneToMany(
            mappedBy = "bacSi",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CaLamViec> danhSachCaLam = new ArrayList<>();

    public BacSi() {
    }

    public BacSi(
            String maBacSi,
            TaiKhoan taiKhoan,
            String hoTen,
            String soDienThoai,
            String soChungChi,
            boolean dangLamViec
    ) {
        this.maBacSi = maBacSi;
        this.taiKhoan = taiKhoan;
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
        this.soChungChi = soChungChi;
        this.dangLamViec = dangLamViec;
    }

    @PrePersist
    protected void truocKhiLuu() {
        if (maBacSi == null || maBacSi.isBlank()) {
            maBacSi = UUID.randomUUID().toString();
        }
    }

    public boolean dangHoatDong() {
        return dangLamViec;
    }

    public boolean laChuPhongKham() {
        return taiKhoan != null
                && taiKhoan.coVaiTro(VaiTro.CHU_PHONG_KHAM);
    }

    public boolean coCaLamViec(LocalDate ngay, CaKham ca) {
        if (ngay == null || ca == null || danhSachCaLam == null) {
            return false;
        }

        for (CaLamViec caLam : danhSachCaLam) {
            if (caLam.getNgayLamViec() != null
                    && caLam.getNgayLamViec().equals(ngay)
                    && caLam.getCaKham() == ca
                    && caLam.isDangHoatDong()) {
                return true;
            }
        }

        return false;
    }

    public boolean coTheNhanLich(
            LocalDateTime batDauMoi,
            LocalDateTime ketThucMoi,
            List<LichKham> lichHienCo
    ) {
        if (!dangHoatDong()
                || batDauMoi == null
                || ketThucMoi == null
                || !batDauMoi.isBefore(ketThucMoi)) {
            return false;
        }

        if (lichHienCo == null || lichHienCo.isEmpty()) {
            return true;
        }

        for (LichKham lichCu : lichHienCo) {
            if (lichCu == null
                    || lichCu.getNgayKham() == null
                    || lichCu.getGioBatDau() == null
                    || lichCu.getGioKetThuc() == null) {
                continue;
            }

            LocalDateTime batDauCu = LocalDateTime.of(
                    lichCu.getNgayKham(),
                    lichCu.getGioBatDau()
            );

            LocalDateTime ketThucCu = LocalDateTime.of(
                    lichCu.getNgayKham(),
                    lichCu.getGioKetThuc()
            );

            // Hai lịch bị trùng nếu khoảng thời gian của chúng giao nhau.
            if (batDauMoi.isBefore(ketThucCu)
                    && ketThucMoi.isAfter(batDauCu)) {
                return false;
            }
        }

        return true;
    }

    public String getMaBacSi() {
        return maBacSi;
    }

    public void setMaBacSi(String maBacSi) {
        this.maBacSi = maBacSi;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getSoChungChi() {
        return soChungChi;
    }

    public void setSoChungChi(String soChungChi) {
        this.soChungChi = soChungChi;
    }

    public boolean isDangLamViec() {
        return dangLamViec;
    }

    public void setDangLamViec(boolean dangLamViec) {
        this.dangLamViec = dangLamViec;
    }

    public List<CaLamViec> getDanhSachCaLam() {
        return danhSachCaLam;
    }

    public void setDanhSachCaLam(List<CaLamViec> danhSachCaLam) {
        this.danhSachCaLam = danhSachCaLam;
    }
}
