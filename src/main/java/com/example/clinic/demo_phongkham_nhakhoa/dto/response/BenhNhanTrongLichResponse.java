package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.GioiTinh;

import java.time.LocalDate;

public class BenhNhanTrongLichResponse {

    private String maLich;
    private String maBenhNhan;
    private String hoTen;
    private LocalDate ngaySinh;
    private GioiTinh gioiTinh;
    private String soDienThoai;
    private String email;
    private String diaChi;
    private String tienSuBenh;
    private String diUngThuoc;

    public BenhNhanTrongLichResponse() {
    }

    public BenhNhanTrongLichResponse(
            String maLich,
            String maBenhNhan,
            String hoTen,
            LocalDate ngaySinh,
            GioiTinh gioiTinh,
            String soDienThoai,
            String email,
            String diaChi,
            String tienSuBenh,
            String diUngThuoc
    ) {
        this.maLich = maLich;
        this.maBenhNhan = maBenhNhan;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.soDienThoai = soDienThoai;
        this.email = email;
        this.diaChi = diaChi;
        this.tienSuBenh = tienSuBenh;
        this.diUngThuoc = diUngThuoc;
    }

    public String getMaLich() { return maLich; }
    public String getMaBenhNhan() { return maBenhNhan; }
    public String getHoTen() { return hoTen; }
    public LocalDate getNgaySinh() { return ngaySinh; }
    public GioiTinh getGioiTinh() { return gioiTinh; }
    public String getSoDienThoai() { return soDienThoai; }
    public String getEmail() { return email; }
    public String getDiaChi() { return diaChi; }
    public String getTienSuBenh() { return tienSuBenh; }
    public String getDiUngThuoc() { return diUngThuoc; }
}
