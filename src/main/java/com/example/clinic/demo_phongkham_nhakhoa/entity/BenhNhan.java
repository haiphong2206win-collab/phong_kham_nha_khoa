package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.GioiTinh;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "benh_nhan")
public class BenhNhan {

    @Id
    private String maBenhNhan;

    @OneToOne(optional = false)
    @JoinColumn(name = "ma_tai_khoan", nullable = false, unique = true)
    private TaiKhoan taiKhoan;

    @Column(nullable = false)
    private String hoTen;

    @Column(nullable = false)
    private LocalDate ngaySinh;

    @Enumerated(EnumType.STRING)
    private GioiTinh gioiTinh;

    @Column(nullable = false)
    private String soDienThoai;

    private String email;

    private String diaChi;

    private String tienSuBenh;

    private String diUngThuoc;

    public BenhNhan() {
    }

    public String getMaBenhNhan() {
        return maBenhNhan;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
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

    public void setMaBenhNhan(String maBenhNhan) {
        this.maBenhNhan = maBenhNhan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public void setNgaySinh(LocalDate ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public void setGioiTinh(GioiTinh gioiTinh) {
        this.gioiTinh = gioiTinh;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public void setTienSuBenh(String tienSuBenh) {
        this.tienSuBenh = tienSuBenh;
    }

    public void setDiUngThuoc(String diUngThuoc) {
        this.diUngThuoc = diUngThuoc;
    }

    public boolean soDienThoaiHopLe() {
        return soDienThoai != null
                && soDienThoai.matches("^0\\d{9}$");
    }

    public boolean daHoanThienThongTin() {
        return taiKhoan != null
                && hoTen != null && !hoTen.isBlank()
                && ngaySinh != null
                && !ngaySinh.isAfter(LocalDate.now())
                && soDienThoaiHopLe();
    }

    public void capNhatTienSuBenh(String noiDung) {
        this.tienSuBenh = noiDung;
    }

    public void capNhatDiUngThuoc(String noiDung) {
        this.diUngThuoc = noiDung;
    }

}
