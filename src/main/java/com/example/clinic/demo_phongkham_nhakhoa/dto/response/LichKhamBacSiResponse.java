package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.GioiTinh;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;

import java.time.LocalDate;
import java.time.LocalTime;

public class LichKhamBacSiResponse {

    private String maLich;
    private LocalDate ngayKham;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private String lyDoKham;
    private TrangThaiDatLich trangThai;

    private String maPhong;
    private String tenPhong;

    private String maBenhNhan;
    private String hoTenBenhNhan;
    private LocalDate ngaySinhBenhNhan;
    private GioiTinh gioiTinhBenhNhan;
    private String soDienThoaiBenhNhan;
    private String emailBenhNhan;
    private String tienSuBenh;
    private String diUngThuoc;

    public LichKhamBacSiResponse() {
    }

    public LichKhamBacSiResponse(
            String maLich,
            LocalDate ngayKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            String lyDoKham,
            TrangThaiDatLich trangThai,
            String maPhong,
            String tenPhong,
            String maBenhNhan,
            String hoTenBenhNhan,
            LocalDate ngaySinhBenhNhan,
            GioiTinh gioiTinhBenhNhan,
            String soDienThoaiBenhNhan,
            String emailBenhNhan,
            String tienSuBenh,
            String diUngThuoc
    ) {
        this.maLich = maLich;
        this.ngayKham = ngayKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.lyDoKham = lyDoKham;
        this.trangThai = trangThai;
        this.maPhong = maPhong;
        this.tenPhong = tenPhong;
        this.maBenhNhan = maBenhNhan;
        this.hoTenBenhNhan = hoTenBenhNhan;
        this.ngaySinhBenhNhan = ngaySinhBenhNhan;
        this.gioiTinhBenhNhan = gioiTinhBenhNhan;
        this.soDienThoaiBenhNhan = soDienThoaiBenhNhan;
        this.emailBenhNhan = emailBenhNhan;
        this.tienSuBenh = tienSuBenh;
        this.diUngThuoc = diUngThuoc;
    }

    public String getMaLich() { return maLich; }
    public LocalDate getNgayKham() { return ngayKham; }
    public LocalTime getGioBatDau() { return gioBatDau; }
    public LocalTime getGioKetThuc() { return gioKetThuc; }
    public String getLyDoKham() { return lyDoKham; }
    public TrangThaiDatLich getTrangThai() { return trangThai; }
    public String getMaPhong() { return maPhong; }
    public String getTenPhong() { return tenPhong; }
    public String getMaBenhNhan() { return maBenhNhan; }
    public String getHoTenBenhNhan() { return hoTenBenhNhan; }
    public LocalDate getNgaySinhBenhNhan() { return ngaySinhBenhNhan; }
    public GioiTinh getGioiTinhBenhNhan() { return gioiTinhBenhNhan; }
    public String getSoDienThoaiBenhNhan() { return soDienThoaiBenhNhan; }
    public String getEmailBenhNhan() { return emailBenhNhan; }
    public String getTienSuBenh() { return tienSuBenh; }
    public String getDiUngThuoc() { return diUngThuoc; }
}
