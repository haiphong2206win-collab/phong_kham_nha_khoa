package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

public class KetQuaXacThucResponse {

    private String token;
    private String loaiToken = "Bearer";
    private String maTaiKhoan;
    private String tenDangNhap;
    private String vaiTro;

    public KetQuaXacThucResponse() {
    }

    public KetQuaXacThucResponse(String token, String maTaiKhoan, String tenDangNhap, String vaiTro) {
        this.token = token;
        this.maTaiKhoan = maTaiKhoan;
        this.tenDangNhap = tenDangNhap;
        this.vaiTro = vaiTro;
    }

    public String getToken() {
        return token;
    }

    public String getLoaiToken() {
        return loaiToken;
    }

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public String getVaiTro() {
        return vaiTro;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setLoaiToken(String loaiToken) {
        this.loaiToken = loaiToken;
    }

    public void setMaTaiKhoan(String maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public void setVaiTro(String vaiTro) {
        this.vaiTro = vaiTro;
    }
}