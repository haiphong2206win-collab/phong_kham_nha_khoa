package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.entity.ThongBao;
import com.example.clinic.demo_phongkham_nhakhoa.enums.LoaiThongBao;

import java.time.LocalDateTime;

public class ThongBaoResponse {

    private String maThongBao;
    private LoaiThongBao loaiThongBao;
    private String tieuDe;
    private String noiDung;
    private String maLich;
    private boolean daDoc;
    private LocalDateTime thoiGianTao;

    public ThongBaoResponse(ThongBao thongBao) {
        this.maThongBao = thongBao.getMaThongBao();
        this.loaiThongBao = thongBao.getLoaiThongBao();
        this.tieuDe = thongBao.getTieuDe();
        this.noiDung = thongBao.getNoiDung();
        this.daDoc = thongBao.isDaDoc();
        this.thoiGianTao = thongBao.getThoiGianTao();

        if (thongBao.getLichKham() != null) {
            this.maLich = thongBao.getLichKham().getMaLich();
        }
    }

    public String getMaThongBao() {
        return maThongBao;
    }

    public LoaiThongBao getLoaiThongBao() {
        return loaiThongBao;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public String getMaLich() {
        return maLich;
    }

    public boolean isDaDoc() {
        return daDoc;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }
}
