
package com.example.clinic.demo_phongkham_nhakhoa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lo_trinh_mau")
public class LoTrinhMau {

    @Id
    @Column(name = "ma_lo_trinh", length = 40, nullable = false, updatable = false)
    private String maLoTrinh;

    @Column(name = "ten_lo_trinh", nullable = false, length = 150)
    private String tenLoTrinh;

    @Column(name = "mo_ta", length = 1000)
    private String moTa;

    @Column(name = "tong_so_buoi", nullable = false)
    private int tongSoBuoi;

    @Column(name = "thoi_gian_du_kien", length = 250)
    private String thoiGianDuKien;

    protected LoTrinhMau() {
    }

    public LoTrinhMau(
            String maLoTrinh,
            String tenLoTrinh,
            String moTa,
            int tongSoBuoi,
            String thoiGianDuKien) {

        this.maLoTrinh = maLoTrinh;
        this.tenLoTrinh = tenLoTrinh;
        this.moTa = moTa;
        this.tongSoBuoi = tongSoBuoi;
        this.thoiGianDuKien = thoiGianDuKien;
    }

    public String getMaLoTrinh() {
        return maLoTrinh;
    }

    public String getTenLoTrinh() {
        return tenLoTrinh;
    }

    public String getMoTa() {
        return moTa;
    }

    public int getTongSoBuoi() {
        return tongSoBuoi;
    }

    public String getThoiGianDuKien() {
        return thoiGianDuKien;
    }
}
