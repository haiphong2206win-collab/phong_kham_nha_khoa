
package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiLoTrinh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoTrinhDieuTriRepository
        extends JpaRepository<LoTrinhDieuTri, String> {

    // 1. Lay danh sach lo trinh cua mot benh nhan.
    // Sap xep moi nhat truoc.
    List<LoTrinhDieuTri> findByBenhNhan_MaBenhNhanOrderByThoiGianTaoDesc(
            String maBenhNhan);

    // 2. Lay lo trinh cua benh nhan theo trang thai.
    List<LoTrinhDieuTri> findByBenhNhan_MaBenhNhanAndTrangThai(
            String maBenhNhan,
            TrangThaiLoTrinh trangThai);

    // 3. Kiem tra mot lo trinh co thuoc
    // benh nhan duoc cung cap hay khong.
    boolean existsByMaLoTrinhDieuTriAndBenhNhan_MaBenhNhan(
            String maLoTrinhDieuTri,
            String maBenhNhan);

    // 4. Dem tong so lo trinh cua benh nhan.
    long countByBenhNhan_MaBenhNhan(
            String maBenhNhan);
}
