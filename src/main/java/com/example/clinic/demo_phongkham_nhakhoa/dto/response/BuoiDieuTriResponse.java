
package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

public class BuoiDieuTriResponse {

    // ==================================================
    // GIAI DOAN 2 - CAC THUOC TINH CU
    // ==================================================

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

    // ==================================================
    // GIAI DOAN 3 - THUOC TINH MOI
    // ==================================================

    // Ma lich kham dang lien ket voi buoi dieu tri
    // Null neu buoi chua duoc len lich
    private String maLichKham;

    private LocalDate ngayKham;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private String tenBacSi;
    private String tenPhong;

    // ==================================================
    // CONSTRUCTOR CU - GIU NGUYEN 14 THAM SO
    // ==================================================

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

        this(
                maBuoiDieuTri,
                maLoTrinhDieuTri,
                soThuTu,
                tenBuoi,
                noiDung,
                khoangCachMin,
                khoangCachMax,
                ghiChu,
                trangThai,
                buoiBoSung,
                lyDoBo,
                thoiGianTao,
                thoiGianCapNhat,
                version,
                null,
                null,
                null,
                null,
                null,
                null);
    }

    // ==================================================
    // CONSTRUCTOR MOI - GIAI DOAN 3
    // 15 THAM SO - CO THEM MA LICH KHAM
    // ==================================================

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
            Long version,
            String maLichKham) {

        this(
                maBuoiDieuTri, maLoTrinhDieuTri, soThuTu, tenBuoi, noiDung,
                khoangCachMin, khoangCachMax, ghiChu, trangThai, buoiBoSung,
                lyDoBo, thoiGianTao, thoiGianCapNhat, version, maLichKham,
                null, null, null, null, null);
    }

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
            Long version,
            String maLichKham,
            LocalDate ngayKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            String tenBacSi,
            String tenPhong) {

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
        this.maLichKham = maLichKham;
        this.ngayKham = ngayKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.tenBacSi = tenBacSi;
        this.tenPhong = tenPhong;
    }

    // ==================================================
    // GETTERS CU - GIU NGUYEN
    // ==================================================

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

    // ==================================================
    // GETTER MOI - GIAI DOAN 3
    // ==================================================

    public String getMaLichKham() {
        return maLichKham;
    }

    public LocalDate getNgayKham() { return ngayKham; }
    public LocalTime getGioBatDau() { return gioBatDau; }
    public LocalTime getGioKetThuc() { return gioKetThuc; }
    public String getTenBacSi() { return tenBacSi; }
    public String getTenPhong() { return tenPhong; }
}
