
package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

public class LoTrinhMauResponse {

    private String maLoTrinh;
    private String tenLoTrinh;
    private String moTa;
    private int tongSoBuoi;
    private String thoiGianDuKien;

    public LoTrinhMauResponse(
            String maLoTrinh,
            String tenLoTrinh,
            String moTa,
            int tongSoBuoi,
            String thoiGianDuKien) {

        this.maLoTrinh = maLoTrinh;
        this.tenLoTrinh = tenLoTrinh;
        this.moTa = moTa;
        this.tongSoBuoi = tongSoBuoi;
        this.thoiGianDuKien = thoiGianDuKien;
    }

    public String getMaLoTrinh() {
        return maLoTrinh;
    }

    public String getTenLoTrinh() {
        return tenLoTrinh;
    }

    public String getMoTa() {
        return moTa;
    }

    public int getTongSoBuoi() {
        return tongSoBuoi;
    }

    public String getThoiGianDuKien() {
        return thoiGianDuKien;
    }
}
