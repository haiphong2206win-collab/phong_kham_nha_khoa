package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;

import java.time.LocalDateTime;

public class BacSiQuanLyResponse {

    private String maBacSi;
    private String hoTen;
    private String soDienThoai;
    private String soChungChi;
    private boolean dangLamViec;

    private String maTaiKhoan;
    private String tenDangNhap;
    private TrangThaiTaiKhoan trangThaiTaiKhoan;
    private LocalDateTime ngayTaoTaiKhoan;

    public BacSiQuanLyResponse() {
    }

    public BacSiQuanLyResponse(
            String maBacSi,
            String hoTen,
            String soDienThoai,
            String soChungChi,
            boolean dangLamViec,
            String maTaiKhoan,
            String tenDangNhap,
            TrangThaiTaiKhoan trangThaiTaiKhoan,
            LocalDateTime ngayTaoTaiKhoan
    ) {
        this.maBacSi = maBacSi;
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
        this.soChungChi = soChungChi;
        this.dangLamViec = dangLamViec;
        this.maTaiKhoan = maTaiKhoan;
        this.tenDangNhap = tenDangNhap;
        this.trangThaiTaiKhoan = trangThaiTaiKhoan;
        this.ngayTaoTaiKhoan = ngayTaoTaiKhoan;
    }

    public String getMaBacSi() {
        return maBacSi;
    }

    public String getHoTen() {
        return hoTen;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public String getSoChungChi() {
        return soChungChi;
    }

    public boolean isDangLamViec() {
        return dangLamViec;
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
