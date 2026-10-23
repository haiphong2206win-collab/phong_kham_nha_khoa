package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import com.example.clinic.demo_phongkham_nhakhoa.enums.GioiTinh;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class TaoTaiKhoanBenhNhanRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 4, max = 50,
            message = "Tên đăng nhập phải có từ 4 đến 50 ký tự")
    private String tenDangNhap;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8,
            message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String matKhau;

    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;

    @NotNull(message = "Ngày sinh không được để trống")
    @PastOrPresent(message = "Ngày sinh không được ở tương lai")
    private LocalDate ngaySinh;

    private GioiTinh gioiTinh;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "0\\d{9}",
            message = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"
    )
    private String soDienThoai;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String diaChi;

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

    public LocalDate getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(LocalDate ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public GioiTinh getGioiTinh() {
        return gioiTinh;
    }

    public void setGioiTinh(GioiTinh gioiTinh) {
        this.gioiTinh = gioiTinh;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }
}
