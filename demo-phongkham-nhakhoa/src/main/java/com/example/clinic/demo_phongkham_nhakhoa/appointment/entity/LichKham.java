package com.example.clinic.demo_phongkham_nhakhoa.appointment.entity;
// Đại diện cho một lịch khám đã được phòng khám tạo.

//Lưu thông tin bệnh nhân, bác sĩ, phòng và thời gian khám.
// dữ liệu dùng cho h2

/*  nghiệp vụ 
Tạo lịch khám sau khi quản lý phân công bác sĩ và phòng.
Bệnh nhân xác nhận hoặc yêu cầu thay đổi lịch.
Quản lý đổi bác sĩ, phòng hoặc giờ khám.
Bác sĩ bắt đầu và hoàn thành buổi khám.
 Hủy lịch hoặc đánh dấu bệnh nhân vắng mặt.
*/

/*
GET /api/v1/appointments/me
 GET /api/v1/doctors/me/appointments
 GET /api/v1/appointments/{id}
 PATCH /api/v1/appointments/{id}/confirm
 PATCH /api/v1/appointments/{id}/cancel
 PATCH /api/v1/management/appointments/{id}/reschedule
 PATCH /api/v1/doctors/me/appointments/{id}/start
  PATCH /api/v1/doctors/me/appointments/{id}/complete
*/

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
// JPA biết đây là lớp cần lưu vào cơ sở dữ liệu
@Table(name = "lich_kham",

        uniqueConstraints = {
                @UniqueConstraint(name = "uk_lich_kham_yeu_cau", columnNames = "yeu_cau_dat_lich_id")
        }, indexes = {
                @Index(name = "idx_lich_kham_bac_si_ngay", columnList = "bac_si_id, ngay_kham"),
                @Index(name = "idx_lich_kham_phong_ngay", columnList = "phong_id, ngay_kham")
        })

public class LichKham {
    // Khóa chính của bảng lịch khám.
    @Id
    @Column(name = "ma_lich", nullable = false, updatable = false, length = 20)
    private String maLich;

    @Column(name = "yeu_cau_dat_lich_id", nullable = false, length = 50)
    private String yeuCauDatLichId;

    @Column(name = "benh_nhan_id", nullable = false, length = 50)
    private String benhNhanId;

    @Column(name = "bac_si_id", nullable = false, length = 50)
    private String bacSiId;

    @Column(name = "phong_id", nullable = false, length = 50)
    private String phongId;

    @Column(name = "ngay_kham", nullable = false)
    private LocalDate ngayKham;

    @Column(name = "gio_bat_dau", nullable = false)
    private LocalTime gioBatDau;

    @Column(name = "gio_ket_thuc", nullable = false)
    private LocalTime gioKetThuc;

    @Column(name = "ly_do_kham", nullable = false, length = 500)
    private String lyDoKham;

    @Column(name = "trang_thai", nullable = false, length = 30)
    private String trangThai;

    @Column(name = "ly_do_thay_doi", length = 500)
    private String lyDoThayDoi;

    @Column(name = "thoi_gian_tao", nullable = false, updatable = false)
    private LocalDateTime thoiGianTao;

    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    private LocalDateTime thoiGianCapNhat;

    public LichKham() {
    }

    @PrePersist
    // Tự chạy trước lần lưu đầu tiên
    public void truocKhiTao() {

        // Nếu chưa có mã lịch thì tự sinh mã.
        if (maLich == null || maLich.isBlank()) {
            maLich = "LK-" + UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase();
        }

        // Lịch mới tạo có trạng thái mặc định là DA_TAO.
        if (trangThai == null || trangThai.isBlank()) {
            trangThai = "DA_TAO";
        }

        // Ghi nhận thời gian tạo và cập nhật.
        thoiGianTao = LocalDateTime.now();
        thoiGianCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    // Tự chạy trước mỗi lần cập nhật
    public void truocKhiCapNhat() {
        thoiGianCapNhat = LocalDateTime.now();
    }

    public String getMaLich() {
        return maLich;
    }

    public void setMaLich(String maLich) {
        this.maLich = maLich;
    }

    public String getYeuCauDatLichId() {
        return yeuCauDatLichId;
    }

    public void setYeuCauDatLichId(String yeuCauDatLichId) {
        this.yeuCauDatLichId = yeuCauDatLichId;
    }

    public String getBenhNhanId() {
        return benhNhanId;
    }

    public void setBenhNhanId(String benhNhanId) {
        this.benhNhanId = benhNhanId;
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

    public LocalDateTime getThoiGianCapNhat() {
        return thoiGianCapNhat;
    }

    public void setThoiGianCapNhat(LocalDateTime thoiGianCapNhat) {
        this.thoiGianCapNhat = thoiGianCapNhat;
    }

}
