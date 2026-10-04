package com.example.clinic.demo_phongkham_nhakhoa.notification.dto.response;
//  Giúp bệnh nhân xem các thông báo liên quan đến lịch khám.

//Chứa dữ liệu thông báo mà Backend trả về cho Frontend.

import java.time.LocalDateTime;

/* 
GET /api/v1/notifications/me
=> trả danh sách NotificationResponse.
PATCH /api/v1/notifications/{id}/read
*/

public class NotificationResponse {
    private String maThongBao;

    private String maLich;

    private String tieuDe;

    private String noiDung;
    private String loaiThongBao;

    private boolean daDoc;

    private LocalDateTime thoiGianTao;

    private LocalDateTime thoiGianDoc;

    public NotificationResponse() {
    }

    public String getMaThongBao() {
        return maThongBao;
    }

    public void setMaThongBao(String maThongBao) {
        this.maThongBao = maThongBao;
    }

    public String getMaLich() {
        return maLich;
    }

    public void setMaLich(String maLich) {
        this.maLich = maLich;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public void setTieuDe(String tieuDe) {
        this.tieuDe = tieuDe;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }

    public String getLoaiThongBao() {
        return loaiThongBao;
    }

    public void setLoaiThongBao(String loaiThongBao) {
        this.loaiThongBao = loaiThongBao;
    }

    public boolean isDaDoc() {
        return daDoc;
    }

    public void setDaDoc(boolean daDoc) {
        this.daDoc = daDoc;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public void setThoiGianTao(LocalDateTime thoiGianTao) {
        this.thoiGianTao = thoiGianTao;
    }

    public LocalDateTime getThoiGianDoc() {
        return thoiGianDoc;
    }

    public void setThoiGianDoc(LocalDateTime thoiGianDoc) {
        this.thoiGianDoc = thoiGianDoc;
    }

}
