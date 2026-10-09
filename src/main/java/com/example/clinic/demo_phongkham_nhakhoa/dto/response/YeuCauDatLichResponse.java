package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiYeuCau;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class YeuCauDatLichResponse {

    private String maYeuCau;
    private String maBenhNhan;
    private String tenBenhNhan;
    private LocalDate ngayMongMuon;
    private CaKham caKham;
    private String lyDoKham;
    private String ghiChu;
    private LocalDateTime thoiGianGui;
    private TrangThaiYeuCau trangThai;
    private String lyDoTuChoi;

    public YeuCauDatLichResponse() {
    }

    public YeuCauDatLichResponse(String maYeuCau, String maBenhNhan, String tenBenhNhan, LocalDate ngayMongMuon, CaKham caKham, String lyDoKham, String ghiChu, LocalDateTime thoiGianGui, TrangThaiYeuCau trangThai, String lyDoTuChoi) {
        this.maYeuCau = maYeuCau;
        this.maBenhNhan = maBenhNhan;
        this.tenBenhNhan = tenBenhNhan;
        this.ngayMongMuon = ngayMongMuon;
        this.caKham = caKham;
        this.lyDoKham = lyDoKham;
        this.ghiChu = ghiChu;
        this.thoiGianGui = thoiGianGui;
        this.trangThai = trangThai;
        this.lyDoTuChoi = lyDoTuChoi;
    }

    public String getMaYeuCau() {
        return maYeuCau;
    }

    public String getMaBenhNhan() {
        return maBenhNhan;
    }

    public String getTenBenhNhan() {
        return tenBenhNhan;
    }

    public LocalDate getNgayMongMuon() {
        return ngayMongMuon;
    }

    public CaKham getCaKham() {
        return caKham;
    }

    public String getLyDoKham() {
        return lyDoKham;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public LocalDateTime getThoiGianGui() {
        return thoiGianGui;
    }

    public TrangThaiYeuCau getTrangThai() {
        return trangThai;
    }

    public String getLyDoTuChoi() {
        return lyDoTuChoi;
    }

    public void setMaYeuCau(String maYeuCau) {
        this.maYeuCau = maYeuCau;
    }

    public void setMaBenhNhan(String maBenhNhan) {
        this.maBenhNhan = maBenhNhan;
    }

    public void setTenBenhNhan(String tenBenhNhan) {
        this.tenBenhNhan = tenBenhNhan;
    }

    public void setNgayMongMuon(LocalDate ngayMongMuon) {
        this.ngayMongMuon = ngayMongMuon;
    }

    public void setCaKham(CaKham caKham) {
        this.caKham = caKham;
    }

    public void setLyDoKham(String lyDoKham) {
        this.lyDoKham = lyDoKham;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public void setThoiGianGui(LocalDateTime thoiGianGui) {
        this.thoiGianGui = thoiGianGui;
    }

    public void setTrangThai(TrangThaiYeuCau trangThai) {
        this.trangThai = trangThai;
    }

    public void setLyDoTuChoi(String lyDoTuChoi) {
        this.lyDoTuChoi = lyDoTuChoi;
    }
}
