package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.LoaiThongBao;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "thong_bao")
public class ThongBao {

    @Id
    @Column(nullable = false, updatable = false)
    private String maThongBao;

    // Tài khoản nhận thông báo.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_tai_khoan", nullable = false)
    private TaiKhoan taiKhoan;

    // Lịch khám liên quan đến thông báo.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_lich")
    private LichKham lichKham;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoaiThongBao loaiThongBao;

    @Column(nullable = false)
    private String tieuDe;

    @Column(nullable = false, length = 1000)
    private String noiDung;

    @Column(nullable = false)
    private boolean daDoc = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime thoiGianTao;

    public ThongBao() {
    }

    @PrePersist
    protected void truocKhiLuu() {
        if (maThongBao == null || maThongBao.isBlank()) {
            maThongBao = UUID.randomUUID().toString();
        }

        if (thoiGianTao == null) {
            thoiGianTao = LocalDateTime.now();
        }
    }

    public void danhDauDaDoc() {
        this.daDoc = true;
    }

    public String getMaThongBao() {
        return maThongBao;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public LichKham getLichKham() {
        return lichKham;
    }

    public LoaiThongBao getLoaiThongBao() {
        return loaiThongBao;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public boolean isDaDoc() {
        return daDoc;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public void setLichKham(LichKham lichKham) {
        this.lichKham = lichKham;
    }

    public void setLoaiThongBao(LoaiThongBao loaiThongBao) {
        this.loaiThongBao = loaiThongBao;
    }

    public void setTieuDe(String tieuDe) {
        this.tieuDe = tieuDe;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }
}
