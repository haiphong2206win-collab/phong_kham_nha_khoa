package com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.response;
/* api 
 * - GET /api/v1/appointments/me
 * - GET /api/v1/doctors/me/appointments
 * - GET /api/v1/appointments/{id}
 * - PATCH /api/v1/appointments/{id}/confirm
 * - PATCH /api/v1/appointments/{id}/cancel
 * - PATCH /api/v1/management/appointments/{id}/reschedule

*/

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AppointmentResponse {
    private String maLich;

    private String maBenhNhan;
    private String tenBenhNhan;

    private String maBacSi;
    private String tenBacSi;

    private String maPhong;
    private String tenPhong;

    private LocalDate ngayKham;

    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;

    private String lyDoKham;

    private String trangThai;
    private String lyDoThayDoi;

    private LocalDateTime thoiGianTao;

    public AppointmentResponse() {
    }

    public String getMaLich() {
        return maLich;
    }

    public void setMaLich(String maLich) {
        this.maLich = maLich;
    }

    public String getMaBenhNhan() {
        return maBenhNhan;
    }

    public void setMaBenhNhan(String maBenhNhan) {
        this.maBenhNhan = maBenhNhan;
    }

    public String getTenBenhNhan() {
        return tenBenhNhan;
    }

    public void setTenBenhNhan(String tenBenhNhan) {
        this.tenBenhNhan = tenBenhNhan;
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

    public String getMaPhong() {
        return maPhong;
    }

    public void setMaPhong(String maPhong) {
        this.maPhong = maPhong;
    }

    public String getTenPhong() {
        return tenPhong;
    }

    public void setTenPhong(String tenPhong) {
        this.tenPhong = tenPhong;
    }

    public LocalDate getNgayKham() {
        return ngayKham;
    }

    public void setNgayKham(LocalDate ngayKham) {
        this.ngayKham = ngayKham;
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

    public String getLyDoKham() {
        return lyDoKham;
    }

    public void setLyDoKham(String lyDoKham) {
        this.lyDoKham = lyDoKham;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public String getLyDoThayDoi() {
        return lyDoThayDoi;
    }

    public void setLyDoThayDoi(String lyDoThayDoi) {
        this.lyDoThayDoi = lyDoThayDoi;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public void setThoiGianTao(LocalDateTime thoiGianTao) {
        this.thoiGianTao = thoiGianTao;
    }
}
