package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.Size;

public class CapNhatTaiKhoanRequest {

    @Size(min = 4, max = 50,
            message = "Tên đăng nhập phải có từ 4 đến 50 ký tự")
    private String tenDangNhap;

    @Size(min = 8,
            message = "Mật khẩu mới phải có ít nhất 8 ký tự")
    private String matKhauMoi;

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public String getMatKhauMoi() {
        return matKhauMoi;
    }

    public void setMatKhauMoi(String matKhauMoi) {
        this.matKhauMoi = matKhauMoi;
    }
}