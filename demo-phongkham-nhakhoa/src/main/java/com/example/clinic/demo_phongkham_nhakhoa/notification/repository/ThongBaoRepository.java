package com.example.clinic.demo_phongkham_nhakhoa.notification.repository;
// dùng để đọc và lưu thông báo trong cơ sở dữ liệu H2.

/* 
GET   /api/v1/notifications/me
PATCH /api/v1/notifications/{id}/read
*/

import com.example.clinic.demo_phongkham_nhakhoa.notification.entity.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface ThongBaoRepository
        extends JpaRepository<ThongBao, String> {
    List<ThongBao> findByBenhNhanIdOrderByThoiGianTaoDesc(
            String benhNhanId);

    List<ThongBao> findByBenhNhanIdAndDaDocFalseOrderByThoiGianTaoDesc(
            String benhNhanId);

    long countByBenhNhanIdAndDaDocFalse(
            String benhNhanId);

    Optional<ThongBao> findByMaThongBaoAndBenhNhanId(
            String maThongBao,
            String benhNhanId);
}