
package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiLoTrinh;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lo_trinh_dieu_tri")
public class LoTrinhDieuTri {

    // Ma duy nhat cua lo trinh benh nhan
    @Id
    @Column(name = "ma_lo_trinh_dieu_tri", nullable = false, updatable = false, length = 36)
    private String maLoTrinhDieuTri;

    // Benh nhan so huu lo trinh
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_benh_nhan", nullable = false)
    private BenhNhan benhNhan;

    // Lo trinh mau duoc chon
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_lo_trinh_mau", nullable = false)
    private LoTrinhMau loTrinhMau;

    // Ten lo trinh rieng cua benh nhan
    @Column(name = "ten_lo_trinh", nullable = false, length = 200)
    private String tenLoTrinh;

    // Ghi chu ve tinh trang benh nhan
    @Column(name = "ghi_chu", length = 2000)
    private String ghiChu;

    // Trang thai cua ca lo trinh
    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 30)
    private TrangThaiLoTrinh trangThai;

    // Thoi diem tao lo trinh
    @Column(name = "thoi_gian_tao", nullable = false, updatable = false)
    private LocalDateTime thoiGianTao;

    // Thoi diem cap nhat gan nhat
    @Column(name = "thoi_gian_cap_nhat")
    private LocalDateTime thoiGianCapNhat;

    // Ho tro kiem tra cap nhat dong thoi
    @Version
    private Long version;

    // Constructor cho JPA
    protected LoTrinhDieuTri() {
    }

    // Constructor tao lo trinh moi
    public LoTrinhDieuTri(
            BenhNhan benhNhan,
            LoTrinhMau loTrinhMau,
            String tenLoTrinh,
            String ghiChu) {

        this.benhNhan = benhNhan;
        this.loTrinhMau = loTrinhMau;
        this.tenLoTrinh = tenLoTrinh;
        this.ghiChu = ghiChu;

        this.trangThai = TrangThaiLoTrinh.CHUA_BAT_DAU;
    }

    // Tu dong gan ma va ngay tao
    @PrePersist
    protected void truocKhiLuu() {

        if (maLoTrinhDieuTri == null
                || maLoTrinhDieuTri.isBlank()) {

            maLoTrinhDieuTri = UUID.randomUUID().toString();
        }

        if (trangThai == null) {
            trangThai = TrangThaiLoTrinh.CHUA_BAT_DAU;
        }

        if (thoiGianTao == null) {
            thoiGianTao = LocalDateTime.now();
        }

        thoiGianCapNhat = LocalDateTime.now();
    }

    // Tu dong cap nhat thoi gian sua
    @PreUpdate
    protected void truocKhiCapNhat() {
        thoiGianCapNhat = LocalDateTime.now();
    }

    // GETTERS

    public String getMaLoTrinhDieuTri() {
        return maLoTrinhDieuTri;
    }

    public BenhNhan getBenhNhan() {
        return benhNhan;
    }

    public LoTrinhMau getLoTrinhMau() {
        return loTrinhMau;
    }

    public String getTenLoTrinh() {
        return tenLoTrinh;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public TrangThaiLoTrinh getTrangThai() {
        return trangThai;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public LocalDateTime getThoiGianCapNhat() {
        return thoiGianCapNhat;
    }

    public Long getVersion() {
        return version;
    }

    // CAP NHAT GHI CHU

    public void capNhatGhiChu(String ghiChuMoi) {
        this.ghiChu = ghiChuMoi;
    }

    // THAY DOI TRANG THAI

    public void doiTrangThai(
            TrangThaiLoTrinh trangThaiMoi) {

        if (trangThaiMoi == null) {
            throw new IllegalArgumentException(
                    "Trang thai khong duoc de trong");
        }

        this.trangThai = trangThaiMoi;
    }
}
