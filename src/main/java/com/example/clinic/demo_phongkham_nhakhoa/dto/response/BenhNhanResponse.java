package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.GioiTinh;

import java.time.LocalDate;

public class BenhNhanResponse {

    private String maBenhNhan;
    private String hoTen;
    private LocalDate ngaySinh;
    private GioiTinh gioiTinh;
    private String diaChi;
    private String soDienThoai;
    private String email;
    private String diUngThuoc;
    private String maTaiKhoan;

    public BenhNhanResponse() {
    }

    public BenhNhanResponse(String maBenhNhan, String hoTen, LocalDate ngaySinh, GioiTinh gioiTinh, String diaChi, String soDienThoai, String email, String diUngThuoc, String maTaiKhoan) {
        this.maBenhNhan = maBenhNhan;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.diaChi = diaChi;
        this.soDienThoai = soDienThoai;
        this.email = email;
        this.diUngThuoc = diUngThuoc;
        this.maTaiKhoan = maTaiKhoan;
    }

    public String getMaBenhNhan() {
        return maBenhNhan;
    }

    public void setMaBenhNhan(String maBenhNhan) {
        this.maBenhNhan = maBenhNhan;
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

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
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

    public String getDiUngThuoc() {
        return diUngThuoc;
    }

    public void setDiUngThuoc(String diUngThuoc) {
        this.diUngThuoc = diUngThuoc;
    }

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(String maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }
}
