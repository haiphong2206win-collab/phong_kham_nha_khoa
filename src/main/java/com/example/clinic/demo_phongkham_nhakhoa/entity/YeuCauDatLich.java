package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiYeuCau;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "yeu_cau_dat_lich")
public class YeuCauDatLich {

    @Id
    private String maYeuCau;

    @ManyToOne
    @JoinColumn(name = "ma_benh_nhan", nullable = false)
    private BenhNhan benhNhan;

    @Column(nullable = false)
    private LocalDate ngayMongMuon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaKham caKham;

    @Column(nullable = false)
    private String lyDoKham;

    private String ghiChu;

    @Column(nullable = false)
    private LocalDateTime thoiGianGui;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiYeuCau trangThai;

    private String lyDoTuChoi;

    @Version
    private long version;

    public YeuCauDatLich() {
    }

    public YeuCauDatLich(String maYeuCau, BenhNhan benhNhan, LocalDate ngayMongMuon, CaKham caKham, String lyDoKham, String ghiChu) {
        this.maYeuCau = maYeuCau;
        this.benhNhan = benhNhan;
        this.ngayMongMuon = ngayMongMuon;
        this.caKham = caKham;
        this.lyDoKham = lyDoKham;
        this.ghiChu = ghiChu;

        this.thoiGianGui = LocalDateTime.now();
        this.trangThai = TrangThaiYeuCau.CHO_PHAN_CONG;
        this.version = 0;
    }

    public String getMaYeuCau() {
        return maYeuCau;
    }

    public BenhNhan getBenhNhan() {
        return benhNhan;
    }

    public LocalDate getNgayMongMuon() {
        return ngayMongMuon;
    }

    public CaKham getCaKham() {
        return caKham;
    }

    public String getLyDoKham() {
        return lyDoKham;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public LocalDateTime getThoiGianGui() {
        return thoiGianGui;
    }

    public TrangThaiYeuCau getTrangThai() {
        return trangThai;
    }

    public String getLyDoTuChoi() {
        return lyDoTuChoi;
    }

    public long getVersion() {
        return version;
    }

    public void setMaYeuCau(String maYeuCau) {
        this.maYeuCau = maYeuCau;
    }

    public void setBenhNhan(BenhNhan benhNhan) {
        this.benhNhan = benhNhan;
    }

    public void setNgayMongMuon(LocalDate ngayMongMuon) {
        this.ngayMongMuon = ngayMongMuon;
    }

    public void setCaKham(CaKham caKham) {
        this.caKham = caKham;
    }

    public void setLyDoKham(String lyDoKham) {
        this.lyDoKham = lyDoKham;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public void setThoiGianGui(LocalDateTime thoiGianGui) {
        this.thoiGianGui = thoiGianGui;
    }

    public void setTrangThai(TrangThaiYeuCau trangThai) {
        this.trangThai = trangThai;
    }

    public void setLyDoTuChoi(String lyDoTuChoi) {
        this.lyDoTuChoi = lyDoTuChoi;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    public void gui() {
        this.trangThai = TrangThaiYeuCau.CHO_PHAN_CONG;
        this.thoiGianGui = LocalDateTime.now();
    }

    public void huy(String lyDo) {
        if (trangThai != TrangThaiYeuCau.CHO_PHAN_CONG) {
            throw new IllegalStateException(
                    "Chỉ có thể hủy yêu cầu đang chờ phân công"
            );
        }

        this.trangThai = TrangThaiYeuCau.DA_HUY;
    }

    public void danhDauDaPhanCong() {
        if (trangThai != TrangThaiYeuCau.CHO_PHAN_CONG) {
            throw new IllegalStateException(
                    "Chỉ có thể phân công yêu cầu đang chờ phân công"
            );
        }

        this.trangThai = TrangThaiYeuCau.DA_PHAN_CONG;
    }

    public void tuChoi(String lyDo) {
        if (trangThai != TrangThaiYeuCau.CHO_PHAN_CONG) {
            throw new IllegalStateException(
                    "Chỉ có thể từ chối yêu cầu đang chờ phân công"
            );
        }

        if (lyDo == null || lyDo.isBlank()) {
            throw new IllegalArgumentException(
                    "Lý do từ chối không được để trống"
            );
        }

        this.lyDoTuChoi = lyDo;
        this.trangThai = TrangThaiYeuCau.TU_CHOI;
    }

    public boolean dangChoPhanCong() {
        return trangThai == TrangThaiYeuCau.CHO_PHAN_CONG;
    }
}
