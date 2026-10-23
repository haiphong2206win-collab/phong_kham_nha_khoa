package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiPhong;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class PhongKham {

    @Id
    @Column(nullable = false, updatable = false)
    private String maPhong;

    @Column(nullable = false)
    private String tenPhong;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiPhong trangThai;

    private String ghiChu;

    public PhongKham() {
    }

    public PhongKham(
            String maPhong,
            String tenPhong,
            TrangThaiPhong trangThai,
            String ghiChu
    ) {
        this.maPhong = maPhong;
        this.tenPhong = tenPhong;
        this.trangThai = trangThai;
        this.ghiChu = ghiChu;
    }

    @PrePersist
    protected void truocKhiLuu() {
        if (maPhong == null || maPhong.isBlank()) {
            maPhong = UUID.randomUUID().toString();
        }

        if (trangThai == null) {
            trangThai = TrangThaiPhong.TRONG;
        }
    }

    public boolean coTheXepLich() {
        return trangThai == TrangThaiPhong.TRONG
                || trangThai == TrangThaiPhong.DANG_SU_DUNG;
    }

    public void tamNgung() {
        this.trangThai = TrangThaiPhong.TAM_NGUNG;
    }

    public void baoTri() {
        this.trangThai = TrangThaiPhong.BAO_TRI;
    }

    public void moLai() {
        this.trangThai = TrangThaiPhong.TRONG;
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

    public TrangThaiPhong getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiPhong trangThai) {
        this.trangThai = trangThai;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
}
