package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class TaoCaLamViecRequest {

    @NotBlank(message = "Mã bác sĩ không được để trống")
    private String maBacSi;

    @NotNull(message = "Ngày làm việc không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngayLamViec;

    @NotNull(message = "Ca khám không được để trống")
    private CaKham caKham;

    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime gioBatDau;

    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime gioKetThuc;

    @Min(value = 1, message = "Số bệnh nhân tối đa phải lớn hơn 0")
    private int soBenhNhanToiDa = 10;

    private Boolean dangHoatDong = true;

    public TaoCaLamViecRequest() {
    }

    public TaoCaLamViecRequest(
            String maBacSi,
            LocalDate ngayLamViec,
            CaKham caKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            int soBenhNhanToiDa,
            Boolean dangHoatDong
    ) {
        this.maBacSi = maBacSi;
        this.ngayLamViec = ngayLamViec;
        this.caKham = caKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.soBenhNhanToiDa = soBenhNhanToiDa;
        this.dangHoatDong = dangHoatDong;
    }

    public String getMaBacSi() {
        return maBacSi;
    }

    public void setMaBacSi(String maBacSi) {
        this.maBacSi = maBacSi;
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

    public Boolean getDangHoatDong() {
        return dangHoatDong != null ? dangHoatDong : true;
    }

    public void setDangHoatDong(Boolean dangHoatDong) {
        this.dangHoatDong = dangHoatDong;
    }
}
