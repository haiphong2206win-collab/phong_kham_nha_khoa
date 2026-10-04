package com.example.clinic.demo_phongkham_nhakhoa.notification.entity;

// một thông báo được gửi đến bệnh nhân.

// Lưu thông báo vào bảng thong_bao trong H2.
// Theo dõi bệnh nhân đã đọc thông báo hay chưa.

/* 
GET /api/v1/notifications/me
PATCH /api/v1/notifications/{id}/read
*/

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "thong_bao", indexes = {
        /*
         * Hỗ trợ tìm nhanh thông báo của một bệnh nhân,
         * đặc biệt khi lọc thông báo chưa đọc.
         */
        @Index(name = "idx_thong_bao_benh_nhan_da_doc", columnList = "benh_nhan_id, da_doc"),

        // Hỗ trợ tìm thông báo theo lịch khám.
        @Index(name = "idx_thong_bao_lich_kham", columnList = "ma_lich")
})

public class ThongBao {
    @Id
    @Column(name = "ma_thong_bao", nullable = false, updatable = false, length = 20)
    private String maThongBao;

    @Column(name = "benh_nhan_id", nullable = false, length = 50)
    private String benhNhanId;

    @Column(name = "ma_lich", nullable = false, length = 20)
    private String maLich;

    @Column(name = "tieu_de", nullable = false, length = 150)
    private String tieuDe;

    @Column(name = "noi_dung", nullable = false, length = 1000)
    private String noiDung;

    @Column(name = "loai_thong_bao", nullable = false, length = 30)
    private String loaiThongBao;

    @Column(name = "da_doc", nullable = false)
    private boolean daDoc;

    @Column(name = "thoi_gian_tao", nullable = false, updatable = false)
    private LocalDateTime thoiGianTao;

    @Column(name = "thoi_gian_doc")
    private LocalDateTime thoiGianDoc;

    // JPA cần constructor rỗng để tạo đối tượng
    public ThongBao() {
    }

    @PrePersist
    public void truocKhiTao() {

        // Tự tạo mã nếu thông báo chưa có mã.
        if (maThongBao == null || maThongBao.isBlank()) {
            maThongBao = "TB-" + UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase();
        }

        // Thông báo mới luôn có trạng thái chưa đọc.
        daDoc = false;

        // Ghi lại thời điểm thông báo được tạo.
        thoiGianTao = LocalDateTime.now();
    }

    // method quan trọng của nghiệp vụ đảm bảo đọc hay chưa
    public void danhDauDaDoc() {
        if (!daDoc) {
            daDoc = true;
            thoiGianDoc = LocalDateTime.now();
        }
    }

    public String getMaThongBao() {
        return maThongBao;
    }

    public void setMaThongBao(String maThongBao) {
        this.maThongBao = maThongBao;
    }

    public String getBenhNhanId() {
        return benhNhanId;
    }

    public void setBenhNhanId(String benhNhanId) {
        this.benhNhanId = benhNhanId;
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
