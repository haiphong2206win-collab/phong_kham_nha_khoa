package com.example.clinic.demo_phongkham_nhakhoa.dto;

import java.time.LocalTime;

public class PhanCongRequest {
    private String maChuPhongKham;
    private String maYeuCau;
    private String maBacSi;
    private String maPhong;
    private LocalTime gioBatDau;
    private int thoiLuongPhut;

    // Constructors
    public PhanCongRequest() {
    }

    public PhanCongRequest(String maChuPhongKham, String maYeuCau, String maBacSi,
                           String maPhong, LocalTime gioBatDau, int thoiLuongPhut) {
        this.maChuPhongKham = maChuPhongKham;
        this.maYeuCau = maYeuCau;
        this.maBacSi = maBacSi;
        this.maPhong = maPhong;
        this.gioBatDau = gioBatDau;
        this.thoiLuongPhut = thoiLuongPhut;
    }

    // Getters
    public String getMaChuPhongKham() {
        return maChuPhongKham;
    }

    public String getMaYeuCau() {
        return maYeuCau;
    }

    public String getMaBacSi() {
        return maBacSi;
    }

    public String getMaPhong() {
        return maPhong;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public int getThoiLuongPhut() {
        return thoiLuongPhut;
    }

    // Setters
    public void setMaChuPhongKham(String maChuPhongKham) {
        this.maChuPhongKham = maChuPhongKham;
    }

    public void setMaYeuCau(String maYeuCau) {
        this.maYeuCau = maYeuCau;
    }

    public void setMaBacSi(String maBacSi) {
        this.maBacSi = maBacSi;
    }

    public void setMaPhong(String maPhong) {
        this.maPhong = maPhong;
    }

    public void setGioBatDau(LocalTime gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public void setThoiLuongPhut(int thoiLuongPhut) {
        this.thoiLuongPhut = thoiLuongPhut;
    }
}
