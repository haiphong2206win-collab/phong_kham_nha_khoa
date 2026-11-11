
package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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
}
