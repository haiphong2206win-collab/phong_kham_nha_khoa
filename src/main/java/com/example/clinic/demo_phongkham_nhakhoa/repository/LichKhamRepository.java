package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.PhongKham;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LichKhamRepository extends JpaRepository<LichKham, String> {
    List<LichKham> findByBacSiAndNgayKham(BacSi bacSi, LocalDate ngayKham);
    List<LichKham> findByPhongKhamAndNgayKham(PhongKham phongKham, LocalDate ngayKham);
    List<LichKham> findByBenhNhan_MaBenhNhanAndNgayKham(String maBenhNhan, LocalDate ngayKham);

    // Lấy lịch của một bác sĩ, sắp xếp theo ngày và giờ tăng dần
    List<LichKham> findByBacSi_MaBacSiOrderByNgayKhamAscGioBatDauAsc(
            String maBacSi
    );

    // Chỉ tìm lịch nếu nó thuộc đúng bác sĩ đang đăng nhập
    Optional<LichKham> findByMaLichAndBacSi_TaiKhoan_TenDangNhap(
            String maLich,
            String tenDangNhap
    );

    Optional<LichKham>
    findByMaLichAndBenhNhan_TaiKhoan_TenDangNhap(
            String maLich,
            String tenDangNhap
    );
}
