
package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TaoLoTrinhDieuTriRequest {

    // Ma benh nhan da ton tai trong MySQL
    @NotBlank(message = "Ma benh nhan khong duoc de trong")
    private String maBenhNhan;

    // Ma mot trong 3 lo trinh mau
    @NotBlank(message = "Ma lo trinh mau khong duoc de trong")
    private String maLoTrinhMau;

    // Ten rieng cua lo trinh (khong bat buoc)
    @Size(max = 200, message = "Ten lo trinh khong duoc qua 200 ky tu")
    private String tenLoTrinh;

    // Ghi chu theo tinh trang benh nhan
    @Size(max = 2000, message = "Ghi chu khong duoc qua 2000 ky tu")
    private String ghiChu;

    // Constructor cho Jackson
    public TaoLoTrinhDieuTriRequest() {
    }

    // GETTERS

    public String getMaBenhNhan() {
        return maBenhNhan;
    }

    public String getMaLoTrinhMau() {
        return maLoTrinhMau;
    }

    public String getTenLoTrinh() {
        return tenLoTrinh;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    // SETTERS

    public void setMaBenhNhan(String maBenhNhan) {
        this.maBenhNhan = maBenhNhan;
    }

    public void setMaLoTrinhMau(String maLoTrinhMau) {
        this.maLoTrinhMau = maLoTrinhMau;
    }

    public void setTenLoTrinh(String tenLoTrinh) {
        this.tenLoTrinh = tenLoTrinh;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
}
