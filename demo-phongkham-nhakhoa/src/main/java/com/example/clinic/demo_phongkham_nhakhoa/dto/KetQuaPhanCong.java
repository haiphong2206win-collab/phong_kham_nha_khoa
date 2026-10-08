package com.example.clinic.demo_phongkham_nhakhoa.dto;
import com.example.clinic.demo_phongkham_nhakhoa.entity.*;
import java.time.*;


public class KetQuaPhanCong {
    private BacSi bacSi;
    private PhongKham phongKham;
    private LocalDate ngayKham;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private BacSi nguoiPhanCong;
    private LocalDateTime thoiGianPhanCong;

    public KetQuaPhanCong(BacSi bacSi, PhongKham phongKham, LocalDate ngayKham,
                          LocalTime gioBatDau, LocalTime gioKetThuc, BacSi nguoiPhanCong) {
        this.bacSi = bacSi;
        this.phongKham = phongKham;
        this.ngayKham = ngayKham;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.nguoiPhanCong = nguoiPhanCong;
        this.thoiGianPhanCong = LocalDateTime.now();
    }
}
