package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;

import java.time.LocalTime;

public class CapNhatCaLamViecRequest {

    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime gioBatDau;

    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime gioKetThuc;

    @Min(value = 1, message = "Số bệnh nhân tối đa phải lớn hơn 0")
    private Integer soBenhNhanToiDa;

    private Boolean dangHoatDong;

    public CapNhatCaLamViecRequest() {
    }

    public CapNhatCaLamViecRequest(
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            Integer soBenhNhanToiDa,
            Boolean dangHoatDong
    ) {
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.soBenhNhanToiDa = soBenhNhanToiDa;
        this.dangHoatDong = dangHoatDong;
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

    public Integer getSoBenhNhanToiDa() {
        return soBenhNhanToiDa;
    }

    public void setSoBenhNhanToiDa(Integer soBenhNhanToiDa) {
        this.soBenhNhanToiDa = soBenhNhanToiDa;
    }

    public Boolean getDangHoatDong() {
        return dangHoatDong;
    }

    public void setDangHoatDong(Boolean dangHoatDong) {
        this.dangHoatDong = dangHoatDong;
    }
}
