package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tai_khoan")
public class TaiKhoan {

    @Id
    @Column(nullable = false, updatable = false)
    private String maTaiKhoan;

    @Column(unique = true, nullable = false)
    private String tenDangNhap;

    @Column(nullable = false)
    private String matKhau;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VaiTro vaiTro;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiTaiKhoan trangThai;

    @Column(nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    public TaiKhoan() {
    }

    // Constructor giữ tương thích với code đang truyền mã tài khoản.
    public TaiKhoan(
            String maTaiKhoan,
            String tenDangNhap,
            String matKhau,
            VaiTro vaiTro
    ) {
        this.maTaiKhoan = maTaiKhoan;
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
        this.vaiTro = vaiTro;
    }

    // Constructor không cần truyền mã tài khoản.
    public TaiKhoan(
            String tenDangNhap,
            String matKhau,
            VaiTro vaiTro
    ) {
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
        this.vaiTro = vaiTro;
    }

    @PrePersist
    protected void truocKhiLuu() {
        if (maTaiKhoan == null || maTaiKhoan.isBlank()) {
            maTaiKhoan = UUID.randomUUID().toString();
        }

        if (ngayTao == null) {
            ngayTao = LocalDateTime.now();
        }

        if (trangThai == null) {
            trangThai = TrangThaiTaiKhoan.DANG_HOAT_DONG;
        }
    }

    public boolean dangHoatDong() {
        return trangThai == TrangThaiTaiKhoan.DANG_HOAT_DONG;
    }

    public boolean coVaiTro(VaiTro vaiTro) {
        return this.vaiTro == vaiTro;
    }

    public void doiMatKhau(String matKhauMoi) {
        this.matKhau = matKhauMoi;
    }

    public void khoa() {
        this.trangThai = TrangThaiTaiKhoan.BI_KHOA;
    }

    public void kichHoat() {
        this.trangThai = TrangThaiTaiKhoan.DANG_HOAT_DONG;
    }

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(String maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public VaiTro getVaiTro() {
        return vaiTro;
    }

    public void setVaiTro(VaiTro vaiTro) {
        this.vaiTro = vaiTro;
    }

    public TrangThaiTaiKhoan getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiTaiKhoan trangThai) {
        this.trangThai = trangThai;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }
}
