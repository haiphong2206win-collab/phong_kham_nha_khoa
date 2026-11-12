
package com.example.clinic.demo_phongkham_nhakhoa.entity;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "buoi_dieu_tri", indexes = {
        @Index(name = "idx_buoi_dieu_tri_lo_trinh", columnList = "ma_lo_trinh_dieu_tri")
})
public class BuoiDieuTri {

    // 1. Ma duy nhat cua buoi dieu tri
    @Id
    @Column(name = "ma_buoi_dieu_tri", nullable = false, updatable = false, length = 36)
    private String maBuoiDieuTri;

    // 2. Lo trinh rieng cua benh nhan
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_lo_trinh_dieu_tri", nullable = false)
    private LoTrinhDieuTri loTrinhDieuTri;

    // ==================================================
    // GIAI DOAN 3 - LIEN KET VOI LICH KHAM
    // ==================================================

    // Lich kham hien tai cua buoi dieu tri.
    // Co the NULL neu buoi chua duoc len lich.
    // Khong thay doi Entity LichKham cua nhom.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_lich_kham", nullable = true)
    private LichKham lichKham;

    // ==================================================
    // CAC THUOC TINH CU - GIU NGUYEN
    // ==================================================

    // 3. Thu tu buoi trong lo trinh
    @Column(name = "so_thu_tu", nullable = false)
    private int soThuTu;

    // 4. Ten buoi dieu tri
    @Column(name = "ten_buoi", nullable = false, length = 200)
    private String tenBuoi;

    // 5. Noi dung thuc hien
    @Column(name = "noi_dung", nullable = false, length = 2000)
    private String noiDung;

    // 6. Khoang cach du kien den buoi tiep theo
    @Column(name = "khoang_cach_min")
    private Integer khoangCachMin;

    @Column(name = "khoang_cach_max")
    private Integer khoangCachMax;

    // 7. Ghi chu cua buoi
    @Column(name = "ghi_chu", length = 1000)
    private String ghiChu;

    // 8. Trang thai cua buoi dieu tri
    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 30)
    private TrangThaiBuoiDieuTri trangThai;

    // 9. Danh dau buoi duoc them rieng
    // true: bac si bo sung
    // false: sao chep tu lo trinh mau
    @Column(name = "buoi_bo_sung", nullable = false)
    private boolean buoiBoSung;

    // 10. Ly do bo buoi neu khong ap dung
    @Column(name = "ly_do_bo", length = 1000)
    private String lyDoBo;

    // 11. Thoi gian tao va cap nhat
    @Column(name = "thoi_gian_tao", nullable = false, updatable = false)
    private LocalDateTime thoiGianTao;

    @Column(name = "thoi_gian_cap_nhat")
    private LocalDateTime thoiGianCapNhat;

    // 12. Chong ghi de khi cap nhat dong thoi
    @Version
    private Long version;

    // Constructor cho JPA
    protected BuoiDieuTri() {
    }

    // Constructor tao buoi dieu tri - GIU NGUYEN
    public BuoiDieuTri(
            LoTrinhDieuTri loTrinhDieuTri,
            int soThuTu,
            String tenBuoi,
            String noiDung,
            Integer khoangCachMin,
            Integer khoangCachMax,
            String ghiChu,
            boolean buoiBoSung) {

        this.loTrinhDieuTri = loTrinhDieuTri;
        this.soThuTu = soThuTu;
        this.tenBuoi = tenBuoi;
        this.noiDung = noiDung;
        this.khoangCachMin = khoangCachMin;
        this.khoangCachMax = khoangCachMax;
        this.ghiChu = ghiChu;
        this.buoiBoSung = buoiBoSung;

        this.trangThai = TrangThaiBuoiDieuTri.CHUA_LEN_LICH;
    }

    // Tu dong tao ma va thoi gian
    @PrePersist
    protected void truocKhiLuu() {

        if (maBuoiDieuTri == null
                || maBuoiDieuTri.isBlank()) {

            maBuoiDieuTri = UUID.randomUUID().toString();
        }

        if (trangThai == null) {
            trangThai = TrangThaiBuoiDieuTri.CHUA_LEN_LICH;
        }

        if (thoiGianTao == null) {
            thoiGianTao = LocalDateTime.now();
        }

        thoiGianCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void truocKhiCapNhat() {
        thoiGianCapNhat = LocalDateTime.now();
    }

    // ==================================================
    // GETTERS CU - GIU NGUYEN
    // ==================================================

    public String getMaBuoiDieuTri() {
        return maBuoiDieuTri;
    }

    public LoTrinhDieuTri getLoTrinhDieuTri() {
        return loTrinhDieuTri;
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
    // GIAI DOAN 3 - GETTER LICH KHAM
    // ==================================================

    public LichKham getLichKham() {
        return lichKham;
    }

    // ==================================================
    // GIAI DOAN 3 - GAN LICH KHAM
    // ==================================================

    public void ganLichKham(LichKham lichKhamMoi) {

        if (lichKhamMoi == null) {
            throw new IllegalArgumentException(
                    "Lich kham khong duoc de trong");
        }

        if (this.lichKham != null) {
            throw new IllegalStateException(
                    "Buoi nay da co lich kham");
        }

        if (this.trangThai != TrangThaiBuoiDieuTri.CHUA_LEN_LICH
                && this.trangThai != TrangThaiBuoiDieuTri.TAM_HOAN) {

            throw new IllegalStateException(
                    "Trang thai buoi khong cho phep gan lich");
        }

        if (loTrinhDieuTri == null
                || loTrinhDieuTri.getBenhNhan() == null
                || lichKhamMoi.getBenhNhan() == null) {

            throw new IllegalStateException(
                    "Thieu thong tin benh nhan");
        }

        String maBnLoTrinh = loTrinhDieuTri
                .getBenhNhan()
                .getMaBenhNhan();

        String maBnLich = lichKhamMoi
                .getBenhNhan()
                .getMaBenhNhan();

        if (maBnLoTrinh == null
                || !maBnLoTrinh.equals(maBnLich)) {

            throw new IllegalArgumentException(
                    "Benh nhan cua lich kham "
                            + "khong trung voi lo trinh");
        }

        TrangThaiDatLich trangThaiLich = lichKhamMoi.getTrangThai();

        if (trangThaiLich == null
                || trangThaiLich == TrangThaiDatLich.DA_HUY
                || trangThaiLich == TrangThaiDatLich.VANG_MAT
                || trangThaiLich == TrangThaiDatLich.HOAN_THANH) {

            throw new IllegalStateException(
                    "Khong the gan lich da huy, "
                            + "vang mat hoac da hoan thanh");
        }

        this.lichKham = lichKhamMoi;
        this.trangThai = TrangThaiBuoiDieuTri.DA_LEN_LICH;
    }

    // ==================================================
    // GIAI DOAN 3 - GO LIEN KET LICH KHAM
    // ==================================================

    // Chi duoc go sau khi lich da huy hoac vang mat.
    // Service phai kiem tra quyen va lich su truoc khi go.
    public void goLichKham() {

        if (this.lichKham == null) {
            throw new IllegalStateException(
                    "Buoi dieu tri chua co lich kham");
        }

        if (this.trangThai == TrangThaiBuoiDieuTri.HOAN_THANH
                || this.trangThai == TrangThaiBuoiDieuTri.DA_BO
                || this.trangThai == TrangThaiBuoiDieuTri.DANG_THUC_HIEN) {

            throw new IllegalStateException(
                    "Khong the go lich cua buoi "
                            + "da hoan thanh, da bo "
                            + "hoac dang thuc hien");
        }

        TrangThaiDatLich trangThaiLich = this.lichKham.getTrangThai();

        if (trangThaiLich != TrangThaiDatLich.DA_HUY
                && trangThaiLich != TrangThaiDatLich.VANG_MAT) {

            throw new IllegalStateException(
                    "Chi duoc go lien ket khi lich "
                            + "da huy hoac benh nhan vang mat");
        }

        this.lichKham = null;

        if (trangThaiLich == TrangThaiDatLich.VANG_MAT) {
            this.trangThai = TrangThaiBuoiDieuTri.TAM_HOAN;
        } else {
            this.trangThai = TrangThaiBuoiDieuTri.CHUA_LEN_LICH;
        }
    }

    // ==================================================
    // CAP NHAT NOI DUNG BUOI - GIU NGUYEN
    // ==================================================

    public void capNhatThongTin(
            String tenBuoiMoi,
            String noiDungMoi,
            Integer minMoi,
            Integer maxMoi,
            String ghiChuMoi) {

        if (trangThai == TrangThaiBuoiDieuTri.HOAN_THANH
                || trangThai == TrangThaiBuoiDieuTri.DA_BO) {

            throw new IllegalStateException(
                    "Khong the sua buoi da hoan thanh hoac da bo");
        }

        if (tenBuoiMoi == null
                || tenBuoiMoi.isBlank()
                || noiDungMoi == null
                || noiDungMoi.isBlank()) {

            throw new IllegalArgumentException(
                    "Ten buoi va noi dung khong duoc de trong");
        }

        if (minMoi != null && minMoi < 0) {
            throw new IllegalArgumentException(
                    "Khoang cach toi thieu khong hop le");
        }

        if (maxMoi != null && maxMoi < 0) {
            throw new IllegalArgumentException(
                    "Khoang cach toi da khong hop le");
        }

        if (minMoi != null && maxMoi != null
                && minMoi > maxMoi) {

            throw new IllegalArgumentException(
                    "Khoang cach toi thieu lon hon toi da");
        }

        this.tenBuoi = tenBuoiMoi;
        this.noiDung = noiDungMoi;
        this.khoangCachMin = minMoi;
        this.khoangCachMax = maxMoi;
        this.ghiChu = ghiChuMoi;
    }

    // ==================================================
    // DANH DAU BO BUOI - GIU NGUYEN
    // ==================================================

    public void boBuoi(String lyDo) {

        if (trangThai == TrangThaiBuoiDieuTri.HOAN_THANH
                || trangThai == TrangThaiBuoiDieuTri.DANG_THUC_HIEN) {

            throw new IllegalStateException(
                    "Khong the bo buoi da hoan thanh hoac dang thuc hien");
        }

        if (trangThai == TrangThaiBuoiDieuTri.DA_LEN_LICH) {

            throw new IllegalStateException(
                    "Can xu ly lich hen truoc khi bo buoi");
        }

        if (trangThai == TrangThaiBuoiDieuTri.DA_BO) {

            throw new IllegalStateException(
                    "Buoi nay da duoc bo truoc do");
        }

        if (lyDo == null || lyDo.isBlank()) {
            throw new IllegalArgumentException(
                    "Phai nhap ly do bo buoi");
        }

        this.trangThai = TrangThaiBuoiDieuTri.DA_BO;
        this.lyDoBo = lyDo.trim();
    }

    // ==================================================
    // DOI TRANG THAI BUOI - GIU NGUYEN
    // ==================================================

    // Service se kiem tra quyen va lich kham
    public void doiTrangThai(
            TrangThaiBuoiDieuTri trangThaiMoi) {

        if (trangThaiMoi == null) {
            throw new IllegalArgumentException(
                    "Trang thai khong duoc de trong");
        }

        if (this.trangThai == TrangThaiBuoiDieuTri.DA_BO
                || this.trangThai == TrangThaiBuoiDieuTri.HOAN_THANH) {

            throw new IllegalStateException(
                    "Khong the doi trang thai buoi da ket thuc");
        }

        this.trangThai = trangThaiMoi;
    }

    // ==================================================
    // SAP XEP LAI THU TU - GIU NGUYEN
    // ==================================================

    public void capNhatSoThuTu(int soThuTuMoi) {

        if (soThuTuMoi <= 0) {
            throw new IllegalArgumentException(
                    "So thu tu phai lon hon 0");
        }

        if (trangThai == TrangThaiBuoiDieuTri.HOAN_THANH) {

            throw new IllegalStateException(
                    "Khong the doi thu tu buoi da hoan thanh");
        }

        this.soThuTu = soThuTuMoi;
    }
}
