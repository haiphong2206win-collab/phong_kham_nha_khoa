package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;

public class CaLamViecResponse {

    private String maCa;
    private String maBacSi;
    private String tenBacSi;
    private String soChungChi;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngayLamViec;

    private CaKham caKham;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime gioBatDau;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime gioKetThuc;

    private int soBenhNhanToiDa;
    private boolean dangHoatDong;
    private int soLichDaXep;

    public CaLamViecResponse() {
    }

    public CaLamViecResponse(
            String maCa,
            String maBacSi,
            String tenBacSi,
            String soChungChi,
            LocalDate ngayLamViec,
            CaKham caKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            int soBenhNhanToiDa,
            boolean dangHoatDong,
            int soLichDaXep
    ) {
        this.maCa = maCa;
        this.maBacSi = maBacSi;
        this.tenBacSi = tenBacSi;
        this.soChungChi = soChungChi;
        this.ngayLamViec = ngayLamViec;
        this.caKham = caKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.soBenhNhanToiDa = soBenhNhanToiDa;
        this.dangHoatDong = dangHoatDong;
        this.soLichDaXep = soLichDaXep;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public String getMaBacSi() {
        return maBacSi;
    }

    public void setMaBacSi(String maBacSi) {
        this.maBacSi = maBacSi;
    }

    public String getTenBacSi() {
        return tenBacSi;
    }

    public void setTenBacSi(String tenBacSi) {
        this.tenBacSi = tenBacSi;
    }

    public String getSoChungChi() {
        return soChungChi;
    }

    public void setSoChungChi(String soChungChi) {
        this.soChungChi = soChungChi;
    }

    public LocalDate getNgayLamViec() {
        return ngayLamViec;
    }

    public void setNgayLamViec(LocalDate ngayLamViec) {
        this.ngayLamViec = ngayLamViec;
    }

    public CaKham getCaKham() {
        return caKham;
    }

    public void setCaKham(CaKham caKham) {
        this.caKham = caKham;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public void setGioBatDau(LocalTime gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public LocalTime getGioKetThuc() {
        return gioKetThuc;
    }

    public void setGioKetThuc(LocalTime gioKetThuc) {
        this.gioKetThuc = gioKetThuc;
    }

    public int getSoBenhNhanToiDa() {
        return soBenhNhanToiDa;
    }

    public void setSoBenhNhanToiDa(int soBenhNhanToiDa) {
        this.soBenhNhanToiDa = soBenhNhanToiDa;
    }

    public boolean isDangHoatDong() {
        return dangHoatDong;
    }

    public void setDangHoatDong(boolean dangHoatDong) {
        this.dangHoatDong = dangHoatDong;
    }

    public int getSoLichDaXep() {
        return soLichDaXep;
    }

    public void setSoLichDaXep(int soLichDaXep) {
        this.soLichDaXep = soLichDaXep;
    }
}
