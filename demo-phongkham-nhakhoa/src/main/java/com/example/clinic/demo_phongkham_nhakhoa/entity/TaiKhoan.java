package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tai_khoan")
public class TaiKhoan {

    @Id
    private String maTaiKhoan;

    @Column(unique = true, nullable = false)
    private String tenDangNhap;

    @Column(nullable = false)
    private String matKhau;

    @Enumerated(EnumType.STRING)
    private VaiTro vaiTro;

    @Enumerated(EnumType.STRING)
    private TrangThaiTaiKhoan trangThai;

    private LocalDateTime ngayTao;

    public TaiKhoan() {
    }

    public TaiKhoan(String maTaiKhoan, String tenDangNhap, String matKhau, VaiTro vaiTro) {
        this.maTaiKhoan = maTaiKhoan;
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
        this.vaiTro = vaiTro;
    }

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public VaiTro getVaiTro() {
        return vaiTro;
    }

    public TrangThaiTaiKhoan getTrangThai() {
        return trangThai;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setMaTaiKhoan(String maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public void setVaiTro(VaiTro vaiTro) {
        this.vaiTro = vaiTro;
    }

    public void setTrangThai(TrangThaiTaiKhoan trangThai) {
        this.trangThai = trangThai;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public boolean dangHoatDong() {
        return trangThai == TrangThaiTaiKhoan.DANG_HOAT_DONG;
    }

    public boolean coVaiTro(VaiTro vaiTro) {
        return this.vaiTro == vaiTro;
    }

    public void doiMatKhau(String mauKhauMoi) {
        this.matKhau = mauKhauMoi;
    }

    public void khoa() {
        this.trangThai = TrangThaiTaiKhoan.BI_KHOA;
    }

    public void kichHoat() {
        this.trangThai = TrangThaiTaiKhoan.DANG_HOAT_DONG;
    }
}