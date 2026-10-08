package com.example.clinic.demo_phongkham_nhakhoa.repository;

import java.time.*;
import java.util.List;
import com.example.clinic.demo_phongkham_nhakhoa.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LichKhamRepository extends JpaRepository<LichKham, String> {
    List<LichKham> findByBacSiAndNgayKham(BacSi bacSi, LocalDate ngayKham);
    List<LichKham> findByPhongKhamAndNgayKham(PhongKham phongKham, LocalDate ngayKham);
    List<LichKham> findByBenhNhan_MaBenhNhanAndNgayKham(String maBenhNhan, LocalDate ngayKham);
}
