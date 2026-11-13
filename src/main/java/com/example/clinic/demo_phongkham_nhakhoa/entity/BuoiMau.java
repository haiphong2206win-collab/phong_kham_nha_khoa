
package com.example.clinic.demo_phongkham_nhakhoa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "buoi_mau", uniqueConstraints = @UniqueConstraint(name = "uk_buoi_mau_lo_trinh_thu_tu", columnNames = {
        "ma_lo_trinh", "so_thu_tu" }))
public class BuoiMau {

    @Id
    @Column(name = "ma_buoi", length = 50, nullable = false, updatable = false)
    private String maBuoi;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_lo_trinh", nullable = false)
    private LoTrinhMau loTrinhMau;

    @Column(name = "so_thu_tu", nullable = false)
    private int soThuTu;

    @Column(name = "ten_buoi", nullable = false, length = 200)
    private String tenBuoi;

    @Column(name = "noi_dung", nullable = false, length = 2000)
    private String noiDung;

    @Column(name = "khoang_cach_min")
    private Integer khoangCachMin;

    @Column(name = "khoang_cach_max")
    private Integer khoangCachMax;

    @Column(name = "ghi_chu", length = 1000)
    private String ghiChu;

    protected BuoiMau() {
    }

    public BuoiMau(
            String maBuoi,
            LoTrinhMau loTrinhMau,
            int soThuTu,
            String tenBuoi,
            String noiDung,
            Integer khoangCachMin,
            Integer khoangCachMax,
            String ghiChu) {

        this.maBuoi = maBuoi;
        this.loTrinhMau = loTrinhMau;
        this.soThuTu = soThuTu;
        this.tenBuoi = tenBuoi;
        this.noiDung = noiDung;
        this.khoangCachMin = khoangCachMin;
        this.khoangCachMax = khoangCachMax;
        this.ghiChu = ghiChu;
    }

    public String getMaBuoi() {
        return maBuoi;
    }

    public LoTrinhMau getLoTrinhMau() {
        return loTrinhMau;
    }

    public int getSoThuTu() {
        return soThuTu;
    }

    public String getTenBuoi() {
        return tenBuoi;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public Integer getKhoangCachMin() {
        return khoangCachMin;
    }

    public Integer getKhoangCachMax() {
        return khoangCachMax;
    }

    public String getGhiChu() {
        return ghiChu;
    }
}
