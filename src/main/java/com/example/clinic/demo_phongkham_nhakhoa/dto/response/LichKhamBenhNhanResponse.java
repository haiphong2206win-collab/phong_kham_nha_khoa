package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class LichKhamBenhNhanResponse {

    private String maLich;
    private String maYeuCau;
    private String maBacSi;
    private String tenBacSi;
    private String maPhong;
    private String tenPhong;
    private LocalDate ngayKham;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private String lyDoKham;
    private TrangThaiDatLich trangThai;
    private String lyDoHuyThayDoi;
    private LocalDateTime thoiGianTao;

    public LichKhamBenhNhanResponse(
            String maLich,
            String maYeuCau,
            String maBacSi,
            String tenBacSi,
            String maPhong,
            String tenPhong,
            LocalDate ngayKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            String lyDoKham,
            TrangThaiDatLich trangThai,
            String lyDoHuyThayDoi,
            LocalDateTime thoiGianTao
    ) {
        this.maLich = maLich;
        this.maYeuCau = maYeuCau;
        this.maBacSi = maBacSi;
        this.tenBacSi = tenBacSi;
        this.maPhong = maPhong;
        this.tenPhong = tenPhong;
        this.ngayKham = ngayKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.lyDoKham = lyDoKham;
        this.trangThai = trangThai;
        this.lyDoHuyThayDoi = lyDoHuyThayDoi;
        this.thoiGianTao = thoiGianTao;
    }

    public String getMaLich() {
        return maLich;
    }

    public String getMaYeuCau() {
        return maYeuCau;
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

    public String getLyDoKham() {
        return lyDoKham;
    }

    public TrangThaiDatLich getTrangThai() {
        return trangThai;
    }

    public String getLyDoHuyThayDoi() {
        return lyDoHuyThayDoi;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }
}
