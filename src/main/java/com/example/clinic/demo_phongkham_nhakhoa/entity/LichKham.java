package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "lich_kham")
public class LichKham {

    @Id
    @Column(nullable = false, updatable = false)
    private String maLich;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_yeu_cau")
    private YeuCauDatLich yeuCauGoc;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_benh_nhan", nullable = false)
    private BenhNhan benhNhan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_bac_si", nullable = false)
    private BacSi bacSi;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_phong", nullable = false)
    private PhongKham phongKham;

    @Column(nullable = false)
    private LocalDate ngayKham;

    @Column(nullable = false)
    private LocalTime gioBatDau;

    @Column(nullable = false)
    private LocalTime gioKetThuc;

    private String lyDoKham;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiDatLich trangThai;

    @Column(nullable = false, updatable = false)
    private LocalDateTime thoiGianTao;

    private String lyDoHuyThayDoi;

    public LichKham() {
    }

    @PrePersist
    protected void truocKhiLuu() {
        if (maLich == null || maLich.isBlank()) {
            maLich = UUID.randomUUID().toString();
        }

        if (thoiGianTao == null) {
            thoiGianTao = LocalDateTime.now();
        }
    }

    // Getters

    public String getMaLich() {
        return maLich;
    }

    public YeuCauDatLich getYeuCauGoc() {
        return yeuCauGoc;
    }

    public BenhNhan getBenhNhan() {
        return benhNhan;
    }

    public BacSi getBacSi() {
        return bacSi;
    }

    public PhongKham getPhongKham() {
        return phongKham;
    }

    public LocalDate getNgayKham() {
        return ngayKham;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public LocalTime getGioKetThuc() {
        return gioKetThuc;
    }

    public String getLyDoKham() {
        return lyDoKham;
    }

    public TrangThaiDatLich getTrangThai() {
        return trangThai;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public String getLyDoHuyThayDoi() {
        return lyDoHuyThayDoi;
    }

    // Setters

    public void setMaLich(String maLich) {
        this.maLich = maLich;
    }

    public void setYeuCauGoc(YeuCauDatLich yeuCauGoc) {
        this.yeuCauGoc = yeuCauGoc;
    }

    public void setBenhNhan(BenhNhan benhNhan) {
        this.benhNhan = benhNhan;
    }

    public void setBacSi(BacSi bacSi) {
        this.bacSi = bacSi;
    }

    public void setPhongKham(PhongKham phongKham) {
        this.phongKham = phongKham;
    }

    public void setNgayKham(LocalDate ngayKham) {
        this.ngayKham = ngayKham;
    }

    public void setGioBatDau(LocalTime gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public void setGioKetThuc(LocalTime gioKetThuc) {
        this.gioKetThuc = gioKetThuc;
    }

    public void setLyDoKham(String lyDoKham) {
        this.lyDoKham = lyDoKham;
    }

    public void setTrangThai(TrangThaiDatLich trangThai) {
        this.trangThai = trangThai;
    }

    public void setThoiGianTao(LocalDateTime thoiGianTao) {
        this.thoiGianTao = thoiGianTao;
    }

    public void setLyDoHuyThayDoi(String lyDoHuyThayDoi) {
        this.lyDoHuyThayDoi = lyDoHuyThayDoi;
    }


    public void xacNhan() {
        if (trangThai != TrangThaiDatLich.CHO_BENH_NHAN_XAC_NHAN) {
            throw new IllegalStateException(
                    "Chỉ có thể xác nhận lịch đang chờ bệnh nhân xác nhận"
            );
        }

        this.trangThai = TrangThaiDatLich.DA_XAC_NHAN;
    }

    public void tuChoi(String lyDo) {
        if (trangThai != TrangThaiDatLich.CHO_BENH_NHAN_XAC_NHAN) {
            throw new IllegalStateException(
                    "Chỉ có thể từ chối lịch đang chờ bệnh nhân xác nhận"
            );
        }

        if (lyDo == null || lyDo.isBlank()) {
            throw new IllegalArgumentException(
                    "Lý do từ chối không được để trống"
            );
        }

        this.trangThai = TrangThaiDatLich.DA_HUY;
        this.lyDoHuyThayDoi = lyDo;
    }

}