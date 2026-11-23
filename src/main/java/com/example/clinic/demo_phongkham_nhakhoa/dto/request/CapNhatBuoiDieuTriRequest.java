
package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public class CapNhatBuoiDieuTriRequest {

    // Ten moi cua buoi dieu tri
    @NotBlank(message = "Ten buoi khong duoc de trong")
    @Size(max = 200, message = "Ten buoi khong duoc qua 200 ky tu")
    private String tenBuoi;

    // Noi dung dieu tri moi
    @NotBlank(message = "Noi dung khong duoc de trong")
    @Size(max = 2000, message = "Noi dung khong duoc qua 2000 ky tu")
    private String noiDung;

    // Khoang cach du kien den buoi tiep theo (ngay)
    @Min(value = 0, message = "Khoang cach toi thieu khong hop le")
    private Integer khoangCachMin;

    @Min(value = 0, message = "Khoang cach toi da khong hop le")
    private Integer khoangCachMax;

    // Ghi chu moi cua buoi dieu tri
    @Size(max = 1000, message = "Ghi chu khong duoc qua 1000 ky tu")
    private String ghiChu;

    // Cac truong lich hen chi can gui khi buoi da duoc len lich.
    // Neu bo trong, API chi cap nhat noi dung dieu tri.
    private LocalDate ngayKham;

    private LocalTime gioBatDau;

    @Min(value = 15, message = "Thoi luong kham phai tu 15 phut")
    private Integer thoiLuongPhut;

    // Constructor cho Jackson
    public CapNhatBuoiDieuTriRequest() {
    }

    // GETTERS

    public String getTenBuoi() {
        return tenBuoi;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public Integer getKhoangCachMin() {
        return khoangCachMin;
    }

    public Integer getKhoangCachMax() {
        return khoangCachMax;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public LocalDate getNgayKham() {
        return ngayKham;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public Integer getThoiLuongPhut() {
        return thoiLuongPhut;
    }

    // SETTERS

    public void setTenBuoi(String tenBuoi) {
        this.tenBuoi = tenBuoi;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }

    public void setKhoangCachMin(Integer khoangCachMin) {
        this.khoangCachMin = khoangCachMin;
    }

    public void setKhoangCachMax(Integer khoangCachMax) {
        this.khoangCachMax = khoangCachMax;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public void setNgayKham(LocalDate ngayKham) {
        this.ngayKham = ngayKham;
    }

    public void setGioBatDau(LocalTime gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public void setThoiLuongPhut(Integer thoiLuongPhut) {
        this.thoiLuongPhut = thoiLuongPhut;
    }
}
