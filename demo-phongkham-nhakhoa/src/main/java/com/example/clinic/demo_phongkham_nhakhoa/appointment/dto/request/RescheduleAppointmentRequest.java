package com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request;

// PATCH /api/v1/management/appointments/{id}/reschedule
// Nhận thông tin khi chủ phòng khám muốn xếp lại lịch khám
import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDate;

public class RescheduleAppointmentRequest {

    @NotNull(message = "Ngày khám không được để trống")
    @FutureOrPresent(message = "Ngày khám không được nằm trong quá khứ")
    private LocalDate ngayKham;

    @NotBlank(message = "Mã bác sĩ không được để trống")
    private String bacSiId;
    @NotBlank(message = "Mã phòng không được để trống")
    private String phongId;
    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime gioBatDau;
    @Positive(message = "Thời lượng khám phải lớn hơn 0")
    private int thoiLuongPhut;
    @NotBlank(message = "Lý do thay đổi lịch không được để trống")
    private String lyDo;

    public RescheduleAppointmentRequest() {
    }

    public RescheduleAppointmentRequest(
            String bacSiId,
            String phongId,
            LocalTime gioBatDau,
            int thoiLuongPhut,
            String lyDo) {

        this.bacSiId = bacSiId;
        this.phongId = phongId;
        this.gioBatDau = gioBatDau;
        this.thoiLuongPhut = thoiLuongPhut;
        this.lyDo = lyDo;
        this.ngayKham = ngayKham;
    }

    public String getBacSiId() {
        return bacSiId;
    }

    public void setBacSiId(String bacSiId) {
        this.bacSiId = bacSiId;
    }

    public String getPhongId() {
        return phongId;
    }

    public void setPhongId(String phongId) {
        this.phongId = phongId;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public void setGioBatDau(LocalTime gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public int getThoiLuongPhut() {
        return thoiLuongPhut;
    }

    public void setThoiLuongPhut(int thoiLuongPhut) {
        this.thoiLuongPhut = thoiLuongPhut;
    }

    public String getLyDo() {
        return lyDo;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }

    public LocalDate getNgayKham() {
        return ngayKham;
    }

    public void setNgayKham(LocalDate ngayKham) {
        this.ngayKham = ngayKham;
    }
}

// test :
/*
 * "ngayKham": "2026-10-10",
 * "bacSiId": "BS002",
 * "phongId": "P002",
 * "gioBatDau": "14:30",
 * "thoiLuongPhut": 30,
 * "lyDo": "Bác sĩ cũ nghỉ đột xuất"
 */