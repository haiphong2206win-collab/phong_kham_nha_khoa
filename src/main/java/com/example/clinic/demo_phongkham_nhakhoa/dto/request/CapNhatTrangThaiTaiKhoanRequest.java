package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.NotNull;

public class CapNhatTrangThaiTaiKhoanRequest {

    @NotNull(message = "Trạng thái hoạt động không được để trống")
    private Boolean dangHoatDong;

    public Boolean getDangHoatDong() {
        return dangHoatDong;
    }

    public void setDangHoatDong(Boolean dangHoatDong) {
        this.dangHoatDong = dangHoatDong;
    }
}
