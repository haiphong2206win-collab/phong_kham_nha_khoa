
package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

public class BuoiMauResponse {

    private String maBuoi;
    private String maLoTrinh;
    private int soThuTu;
    private String tenBuoi;
    private String noiDung;
    private Integer khoangCachMin;
    private Integer khoangCachMax;
    private String ghiChu;

    public BuoiMauResponse(
            String maBuoi,
            String maLoTrinh,
            int soThuTu,
            String tenBuoi,
            String noiDung,
            Integer khoangCachMin,
            Integer khoangCachMax,
            String ghiChu) {

        this.maBuoi = maBuoi;
        this.maLoTrinh = maLoTrinh;
        this.soThuTu = soThuTu;
        this.tenBuoi = tenBuoi;
        this.noiDung = noiDung;
        this.khoangCachMin = khoangCachMin;
        this.khoangCachMax = khoangCachMax;
        this.ghiChu = ghiChu;
    }

    public String getMaBuoi() {
        return maBuoi;
    }

    public String getMaLoTrinh() {
        return maLoTrinh;
    }

    public int getSoThuTu() {
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
}
