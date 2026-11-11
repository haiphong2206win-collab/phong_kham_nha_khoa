
package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuoiDieuTriRepository
        extends JpaRepository<BuoiDieuTri, String> {

    // 1. Lay tat ca buoi cua mot lo trinh benh nhan
    // Sap xep theo thu tu tang dan.
    List<BuoiDieuTri> findByLoTrinhDieuTri_MaLoTrinhDieuTriOrderBySoThuTuAsc(
            String maLoTrinhDieuTri);

    // 2. Lay cac buoi theo trang thai.
    List<BuoiDieuTri> findByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThaiOrderBySoThuTuAsc(
            String maLoTrinhDieuTri,
            TrangThaiBuoiDieuTri trangThai);

    // 3. Kiem tra so thu tu da ton tai trong lo trinh.
    boolean existsByLoTrinhDieuTri_MaLoTrinhDieuTriAndSoThuTu(
            String maLoTrinhDieuTri,
            int soThuTu);

    // 4. Dem tong so buoi cua mot lo trinh.
    long countByLoTrinhDieuTri_MaLoTrinhDieuTri(
            String maLoTrinhDieuTri);

    // 5. Dem so buoi theo trang thai.
    long countByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThai(
            String maLoTrinhDieuTri,
            TrangThaiBuoiDieuTri trangThai);
}
