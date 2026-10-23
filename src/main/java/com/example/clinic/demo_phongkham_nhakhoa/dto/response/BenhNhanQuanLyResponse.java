package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.GioiTinh;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BenhNhanQuanLyResponse {

    private String maBenhNhan;
    private String hoTen;
    private LocalDate ngaySinh;
    private GioiTinh gioiTinh;
    private String soDienThoai;
    private String email;
    private String diaChi;
    private String tienSuBenh;
    private String diUngThuoc;

    private String maTaiKhoan;
    private String tenDangNhap;
    private TrangThaiTaiKhoan trangThaiTaiKhoan;
    private LocalDateTime ngayTaoTaiKhoan;

    public BenhNhanQuanLyResponse() {
    }

    public BenhNhanQuanLyResponse(
            String maBenhNhan,
            String hoTen,
            LocalDate ngaySinh,
            GioiTinh gioiTinh,
            String soDienThoai,
            String email,
            String diaChi,
            String tienSuBenh,
            String diUngThuoc,
            String maTaiKhoan,
            String tenDangNhap,
            TrangThaiTaiKhoan trangThaiTaiKhoan,
            LocalDateTime ngayTaoTaiKhoan
    ) {
        this.maBenhNhan = maBenhNhan;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.soDienThoai = soDienThoai;
        this.email = email;
        this.diaChi = diaChi;
        this.tienSuBenh = tienSuBenh;
        this.diUngThuoc = diUngThuoc;
        this.maTaiKhoan = maTaiKhoan;
        this.tenDangNhap = tenDangNhap;
        this.trangThaiTaiKhoan = trangThaiTaiKhoan;
        this.ngayTaoTaiKhoan = ngayTaoTaiKhoan;
    }

    public String getMaBenhNhan() {
        return maBenhNhan;
    }

    public String getHoTen() {
        return hoTen;
    }

    public LocalDate getNgaySinh() {
        return ngaySinh;
    }

    public GioiTinh getGioiTinh() {
        return gioiTinh;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public String getEmail() {
        return email;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public String getTienSuBenh() {
        return tienSuBenh;
    }

    public String getDiUngThuoc() {
        return diUngThuoc;
    }

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public TrangThaiTaiKhoan getTrangThaiTaiKhoan() {
        return trangThaiTaiKhoan;
    }

    public LocalDateTime getNgayTaoTaiKhoan() {
        return ngayTaoTaiKhoan;
    }
}
