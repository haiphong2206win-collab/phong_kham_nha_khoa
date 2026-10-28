package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TaoTaiKhoanBacSiRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 4, max = 50,
            message = "Tên đăng nhập phải có từ 4 đến 50 ký tự")
    private String tenDangNhap;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8,
            message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String matKhau;

    @NotBlank(message = "Họ tên bác sĩ không được để trống")
    private String hoTen;

    private String soDienThoai;

    private String soChungChi;

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

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getSoChungChi() {
        return soChungChi;
    }

    public void setSoChungChi(String soChungChi) {
        this.soChungChi = soChungChi;
    }
}
