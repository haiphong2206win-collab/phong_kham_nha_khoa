package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.*;
import jakarta.persistence.*;
import java.time.*;

@Entity
public class CaLamViec {
    @Id
    private String maCa;

    @ManyToOne
    @JoinColumn(name = "ma_bac_si")
    private BacSi bacSi;

    private LocalDate ngayLamViec;

    @Enumerated(EnumType.STRING)
    private CaKham caKham;

    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private int soBenhNhanToiDa;
    private boolean dangHoatDong;

    // Constructors, Getters và Setters
    public LocalDate getNgayLamViec() { return ngayLamViec; }
    public CaKham getCaKham() { return caKham; }
    public LocalTime getGioBatDau() { return gioBatDau; }
    public LocalTime getGioKetThuc() { return gioKetThuc; }
    public boolean isDangHoatDong() { return dangHoatDong; }

    public boolean chuaThoiGian(LocalTime batDau, LocalTime ketThuc) {
        // batDau không được trước gioBatDau VÀ ketThuc không được sau gioKetThuc
        return !batDau.isBefore(this.gioBatDau) && !ketThuc.isAfter(this.gioKetThuc);
    }

    public boolean conSucChua(int soLichDaCo) {
        return soLichDaCo < this.soBenhNhanToiDa;
    }

    public boolean hopLe() {
        return gioBatDau != null && gioKetThuc != null
                && gioBatDau.isBefore(gioKetThuc) && soBenhNhanToiDa > 0;
    }


    public void tamNgung() {
        this.dangHoatDong = false;
    }

    public void kichHoat() {
        this.dangHoatDong = true;
    }
}