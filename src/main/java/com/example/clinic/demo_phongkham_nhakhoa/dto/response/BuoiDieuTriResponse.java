
package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;

import java.time.LocalDateTime;

public class BuoiDieuTriResponse {

    private String maBuoiDieuTri;

    private String maLoTrinhDieuTri;

    private int soThuTu;

    private String tenBuoi;

    private String noiDung;

    private Integer khoangCachMin;

    private Integer khoangCachMax;

    private String ghiChu;

    private TrangThaiBuoiDieuTri trangThai;

    private boolean buoiBoSung;

    private String lyDoBo;

    private LocalDateTime thoiGianTao;

    private LocalDateTime thoiGianCapNhat;

    private Long version;

    // Constructor
    public BuoiDieuTriResponse(
            String maBuoiDieuTri,
            String maLoTrinhDieuTri,
            int soThuTu,
            String tenBuoi,
            String noiDung,
            Integer khoangCachMin,
            Integer khoangCachMax,
            String ghiChu,
            TrangThaiBuoiDieuTri trangThai,
            boolean buoiBoSung,
            String lyDoBo,
            LocalDateTime thoiGianTao,
            LocalDateTime thoiGianCapNhat,
            Long version) {

        this.maBuoiDieuTri = maBuoiDieuTri;
        this.maLoTrinhDieuTri = maLoTrinhDieuTri;
        this.soThuTu = soThuTu;
        this.tenBuoi = tenBuoi;
        this.noiDung = noiDung;
        this.khoangCachMin = khoangCachMin;
        this.khoangCachMax = khoangCachMax;
        this.ghiChu = ghiChu;
        this.trangThai = trangThai;
        this.buoiBoSung = buoiBoSung;
        this.lyDoBo = lyDoBo;
        this.thoiGianTao = thoiGianTao;
        this.thoiGianCapNhat = thoiGianCapNhat;
        this.version = version;
    }

    // GETTERS

    public String getMaBuoiDieuTri() {
        return maBuoiDieuTri;
    }

    public String getMaLoTrinhDieuTri() {
        return maLoTrinhDieuTri;
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

    public TrangThaiBuoiDieuTri getTrangThai() {
        return trangThai;
    }

    public boolean isBuoiBoSung() {
        return buoiBoSung;
    }

    public String getLyDoBo() {
        return lyDoBo;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public LocalDateTime getThoiGianCapNhat() {
        return thoiGianCapNhat;
    }

    public Long getVersion() {
        return version;
    }
}
