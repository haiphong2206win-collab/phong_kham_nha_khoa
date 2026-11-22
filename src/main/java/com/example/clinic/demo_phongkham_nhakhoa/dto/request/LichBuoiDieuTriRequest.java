package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class LichBuoiDieuTriRequest {

    @NotNull(message = "Số thứ tự buổi không được để trống")
    @Min(value = 2, message = "Lịch tiếp theo phải bắt đầu từ buổi 2")
    private Integer soThuTu;

    @NotNull(message = "Ngày khám không được để trống")
    private LocalDate ngayKham;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime gioBatDau;

    @NotNull(message = "Thời lượng khám không được để trống")
    @Min(value = 15, message = "Thời lượng khám tối thiểu là 15 phút")
    @Max(value = 480, message = "Thời lượng khám tối đa là 480 phút")
    private Integer thoiLuongPhut;

    public LichBuoiDieuTriRequest() {
    }

    public Integer getSoThuTu() { return soThuTu; }
    public LocalDate getNgayKham() { return ngayKham; }
    public LocalTime getGioBatDau() { return gioBatDau; }
    public Integer getThoiLuongPhut() { return thoiLuongPhut; }

    public void setSoThuTu(Integer soThuTu) { this.soThuTu = soThuTu; }
    public void setNgayKham(LocalDate ngayKham) { this.ngayKham = ngayKham; }
    public void setGioBatDau(LocalTime gioBatDau) { this.gioBatDau = gioBatDau; }
    public void setThoiLuongPhut(Integer thoiLuongPhut) { this.thoiLuongPhut = thoiLuongPhut; }
}
