package com.example.clinic.demo_phongkham_nhakhoa.dto;

public class TuChoiRequest {
    private String maChuPhongKham;
    private String maYeuCau;
    private String lyDo;

    // Constructors
    public TuChoiRequest() {
    }

    public TuChoiRequest(String maChuPhongKham, String maYeuCau, String lyDo) {
        this.maChuPhongKham = maChuPhongKham;
        this.maYeuCau = maYeuCau;
        this.lyDo = lyDo;
    }

    // Getters
    public String getMaChuPhongKham() {
        return maChuPhongKham;
    }

    public String getMaYeuCau() {
        return maYeuCau;
    }

    public String getLyDo() {
        return lyDo;
    }

    // Setters
    public void setMaChuPhongKham(String maChuPhongKham) {
        this.maChuPhongKham = maChuPhongKham;
    }

    public void setMaYeuCau(String maYeuCau) {
        this.maYeuCau = maYeuCau;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }
}