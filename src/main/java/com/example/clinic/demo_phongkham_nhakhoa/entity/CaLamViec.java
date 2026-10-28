package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
public class CaLamViec {

    @Id
    @Column(nullable = false, updatable = false)
    private String maCa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_bac_si", nullable = false)
    private BacSi bacSi;

    @Column(nullable = false)
    private LocalDate ngayLamViec;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaKham caKham;

    @Column(nullable = false)
    private LocalTime gioBatDau;

    @Column(nullable = false)
    private LocalTime gioKetThuc;

    @Column(nullable = false)
    private int soBenhNhanToiDa;

    @Column(nullable = false)
    private boolean dangHoatDong;

    public CaLamViec() {
    }

    public CaLamViec(
            String maCa,
            BacSi bacSi,
            LocalDate ngayLamViec,
            CaKham caKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            int soBenhNhanToiDa,
            boolean dangHoatDong
    ) {
        this.maCa = maCa;
        this.bacSi = bacSi;
        this.ngayLamViec = ngayLamViec;
        this.caKham = caKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.soBenhNhanToiDa = soBenhNhanToiDa;
        this.dangHoatDong = dangHoatDong;
    }

    @PrePersist
    protected void truocKhiLuu() {
        if (maCa == null || maCa.isBlank()) {
            maCa = UUID.randomUUID().toString();
        }
    }

    public boolean chuaThoiGian(
            LocalTime batDau,
            LocalTime ketThuc
    ) {
        if (!hopLe() || batDau == null || ketThuc == null) {
            return false;
        }

        if (!batDau.isBefore(ketThuc)) {
            return false;
        }

        return !batDau.isBefore(gioBatDau)
                && !ketThuc.isAfter(gioKetThuc);
    }

    public boolean conSucChua(int soLichDaCo) {
        return dangHoatDong
                && soBenhNhanToiDa > 0
                && soLichDaCo >= 0
                && soLichDaCo < soBenhNhanToiDa;
    }

    public boolean hopLe() {
        return bacSi != null
                && ngayLamViec != null
                && caKham != null
                && gioBatDau != null
                && gioKetThuc != null
                && gioBatDau.isBefore(gioKetThuc)
                && soBenhNhanToiDa > 0;
    }

    public void tamNgung() {
        this.dangHoatDong = false;
    }

    public void kichHoat() {
        this.dangHoatDong = true;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public BacSi getBacSi() {
        return bacSi;
    }

    public void setBacSi(BacSi bacSi) {
        this.bacSi = bacSi;
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

    public boolean isDangHoatDong() {
        return dangHoatDong;
    }

    public void setDangHoatDong(boolean dangHoatDong) {
        this.dangHoatDong = dangHoatDong;
    }
}
