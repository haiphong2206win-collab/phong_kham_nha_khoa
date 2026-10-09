package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class TaoYeuCauDatLichRequest {

    @NotNull(message = "Ngày mong muốn không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngayMongMuon;

    @NotNull(message = "Ca khám không được để trống")
    private CaKham caKham;

    @NotNull(message = "Lý do khám không được để trống")
    private String lyDoKham;

    private String ghiChu;

    public TaoYeuCauDatLichRequest() {
    }

    public LocalDate getNgayMongMuon() {
        return ngayMongMuon;
    }

    public void setNgayMongMuon(LocalDate ngayMongMuon) {
        this.ngayMongMuon = ngayMongMuon;
    }

    public CaKham getCaKham() {
        return caKham;
    }

    public void setCaKham(CaKham caKham) {
        this.caKham = caKham;
    }

    public String getLyDoKham() {
        return lyDoKham;
    }

    public void setLyDoKham(String lyDoKham) {
        this.lyDoKham = lyDoKham;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
}
