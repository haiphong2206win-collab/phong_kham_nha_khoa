
package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ThemBuoiDieuTriRequest {

    // Vi tri muon chen buoi vao lo trinh
    @NotNull(message = "So thu tu khong duoc de trong")
    @Min(value = 1, message = "So thu tu phai tu 1 tro len")
    private Integer soThuTu;

    // Ten buoi dieu tri bo sung
    @NotBlank(message = "Ten buoi khong duoc de trong")
    @Size(max = 200, message = "Ten buoi toi da 200 ky tu")
    private String tenBuoi;

    // Noi dung dieu tri
    @NotBlank(message = "Noi dung khong duoc de trong")
    @Size(max = 2000, message = "Noi dung toi da 2000 ky tu")
    private String noiDung;

    // Khoang cach du kien den buoi tiep theo
    @Min(value = 0, message = "Khoang cach min khong hop le")
    private Integer khoangCachMin;

    @Min(value = 0, message = "Khoang cach max khong hop le")
    private Integer khoangCachMax;

    // Ghi chu rieng cho buoi bo sung
    @Size(max = 1000, message = "Ghi chu toi da 1000 ky tu")
    private String ghiChu;

    // Constructor cho Jackson
    public ThemBuoiDieuTriRequest() {
    }

    // GETTERS

    public Integer getSoThuTu() {
        return soThuTu;
    }

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

    // SETTERS

    public void setSoThuTu(Integer soThuTu) {
        this.soThuTu = soThuTu;
    }

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
}
