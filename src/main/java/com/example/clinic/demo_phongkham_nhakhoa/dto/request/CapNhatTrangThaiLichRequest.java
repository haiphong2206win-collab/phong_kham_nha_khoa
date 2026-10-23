package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import jakarta.validation.constraints.NotNull;

public class CapNhatTrangThaiLichRequest {

    @NotNull(message = "Trạng thái mới không được để trống")
    private TrangThaiDatLich trangThai;

    public CapNhatTrangThaiLichRequest() {
    }

    public TrangThaiDatLich getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiDatLich trangThai) {
        this.trangThai = trangThai;
    }
}
