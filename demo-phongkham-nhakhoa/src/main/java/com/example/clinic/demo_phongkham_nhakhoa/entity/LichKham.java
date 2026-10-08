package com.example.clinic.demo_phongkham_nhakhoa.entity;

import java.time.*;
import com.example.clinic.demo_phongkham_nhakhoa.enums.*;
import jakarta.persistence.*;

@Entity
@Table(name = "lich_kham")
public class LichKham {
    @Id
    private String maLich;

    @ManyToOne
    @JoinColumn(name = "ma_yeu_cau")
    private YeuCauDatLich yeuCauGoc;

    @ManyToOne
    @JoinColumn(name = "ma_benh_nhan")
    private BenhNhan benhNhan;

    @ManyToOne
    @JoinColumn(name = "ma_bac_si")
    private BacSi bacSi;

    @ManyToOne
    @JoinColumn(name = "ma_phong")
    private PhongKham phongKham;

    private LocalDate ngayKham;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private String lyDoKham;

    @Enumerated(EnumType.STRING)
    private TrangThaiDatLich trangThai;

    private LocalDateTime thoiGianTao;
    private String lyDoHuyThayDoi;

    // Các Getters cần thiết cho thuật toán kiểm tra của Người 2
    public BacSi getBacSi() { return bacSi; }
    public PhongKham getPhongKham() { return phongKham; }
    public BenhNhan getBenhNhan() { return benhNhan; }
    public LocalDate getNgayKham() { return ngayKham; }
    public LocalTime getGioBatDau() { return gioBatDau; }
    public LocalTime getGioKetThuc() { return gioKetThuc; }

    // Setters để tạo dữ liệu demo
    public void setMaLich(String maLich) { this.maLich = maLich; }
    public void setBacSi(BacSi bacSi) { this.bacSi = bacSi; }
    public void setPhongKham(PhongKham phongKham) { this.phongKham = phongKham; }
    public void setNgayKham(LocalDate ngayKham) { this.ngayKham = ngayKham; }
    public void setGioBatDau(LocalTime gioBatDau) { this.gioBatDau = gioBatDau; }
    public void setGioKetThuc(LocalTime gioKetThuc) { this.gioKetThuc = gioKetThuc; }

    // Các phương thức khác Người 3 sẽ tự implement sau
}
