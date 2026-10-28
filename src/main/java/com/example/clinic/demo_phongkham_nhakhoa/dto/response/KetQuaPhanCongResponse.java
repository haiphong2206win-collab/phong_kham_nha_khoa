package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.PhongKham;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class KetQuaPhanCongResponse {

    private String maBacSi;
    private String tenBacSi;

    private String maPhong;
    private String tenPhong;

    private LocalDate ngayKham;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;

    private String maNguoiPhanCong;
    private String tenNguoiPhanCong;

    private LocalDateTime thoiGianPhanCong;

    public KetQuaPhanCongResponse() {
    }

    public KetQuaPhanCongResponse(
            BacSi bacSi,
            PhongKham phongKham,
            LocalDate ngayKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            BacSi nguoiPhanCong
    ) {
        this.maBacSi = bacSi.getMaBacSi();
        this.tenBacSi = bacSi.getHoTen();

        this.maPhong = phongKham.getMaPhong();
        this.tenPhong = phongKham.getTenPhong();

        this.ngayKham = ngayKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;

        this.maNguoiPhanCong = nguoiPhanCong.getMaBacSi();
        this.tenNguoiPhanCong = nguoiPhanCong.getHoTen();

        this.thoiGianPhanCong = LocalDateTime.now();
    }

    public String getMaBacSi() {
        return maBacSi;
    }

    public String getTenBacSi() {
        return tenBacSi;
    }

    public String getMaPhong() {
        return maPhong;
    }

    public String getTenPhong() {
        return tenPhong;
    }

    public LocalDate getNgayKham() {
        return ngayKham;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public LocalTime getGioKetThuc() {
        return gioKetThuc;
    }

    public String getMaNguoiPhanCong() {
        return maNguoiPhanCong;
    }

    public String getTenNguoiPhanCong() {
        return tenNguoiPhanCong;
    }

    public LocalDateTime getThoiGianPhanCong() {
        return thoiGianPhanCong;
    }
}