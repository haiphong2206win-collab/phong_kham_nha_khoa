
package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiLoTrinh;

import java.time.LocalDateTime;

public class LoTrinhDieuTriResponse {

    // Ma lo trinh rieng cua benh nhan
    private String maLoTrinhDieuTri;

    // Ma benh nhan
    private String maBenhNhan;

    // Ma lo trinh mau ban dau
    private String maLoTrinhMau;

    // Ten lo trinh rieng
    private String tenLoTrinh;

    // Ghi chu cua bac si
    private String ghiChu;

    // Trang thai toan bo lo trinh
    private TrangThaiLoTrinh trangThai;

    // Tong so buoi dang ap dung
    private long tongSoBuoi;

    // So buoi da hoan thanh
    private long soBuoiHoanThanh;

    // So buoi da bo
    private long soBuoiDaBo;

    // Thoi gian tao va cap nhat
    private LocalDateTime thoiGianTao;

    private LocalDateTime thoiGianCapNhat;

    // Phien ban ban ghi
    private Long version;

    // Constructor
    public LoTrinhDieuTriResponse(
            String maLoTrinhDieuTri,
            String maBenhNhan,
            String maLoTrinhMau,
            String tenLoTrinh,
            String ghiChu,
            TrangThaiLoTrinh trangThai,
            long tongSoBuoi,
            long soBuoiHoanThanh,
            long soBuoiDaBo,
            LocalDateTime thoiGianTao,
            LocalDateTime thoiGianCapNhat,
            Long version) {

        this.maLoTrinhDieuTri = maLoTrinhDieuTri;
        this.maBenhNhan = maBenhNhan;
        this.maLoTrinhMau = maLoTrinhMau;
        this.tenLoTrinh = tenLoTrinh;
        this.ghiChu = ghiChu;
        this.trangThai = trangThai;
        this.tongSoBuoi = tongSoBuoi;
        this.soBuoiHoanThanh = soBuoiHoanThanh;
        this.soBuoiDaBo = soBuoiDaBo;
        this.thoiGianTao = thoiGianTao;
        this.thoiGianCapNhat = thoiGianCapNhat;
        this.version = version;
    }

    // GETTERS

    public String getMaLoTrinhDieuTri() {
        return maLoTrinhDieuTri;
    }

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

    public TrangThaiLoTrinh getTrangThai() {
        return trangThai;
    }

    public long getTongSoBuoi() {
        return tongSoBuoi;
    }

    public long getSoBuoiHoanThanh() {
        return soBuoiHoanThanh;
    }

    public long getSoBuoiDaBo() {
        return soBuoiDaBo;
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
