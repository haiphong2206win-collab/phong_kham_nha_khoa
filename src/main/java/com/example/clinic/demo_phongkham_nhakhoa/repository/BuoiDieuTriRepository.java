
package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BuoiDieuTriRepository
                extends JpaRepository<BuoiDieuTri, String> {

        // ==================================================
        // GIAI DOAN 2 - CAC PHUONG THUC CU - GIU NGUYEN
        // ==================================================

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

        // ==================================================
        // GIAI DOAN 3 - LIEN KET VOI LICH KHAM
        // ==================================================

        // 6. Tim buoi dieu tri theo ma lich kham.
        // Tra ve Optional vi lich kham co the
        // khong thuoc bat ky buoi dieu tri nao.
        Optional<BuoiDieuTri> findByLichKham_MaLich(
                        String maLich);

        // 7. Kiem tra mot lich kham da duoc
        // lien ket voi buoi dieu tri nao chua.
        // Dung de tranh gan cung mot lich cho nhieu buoi.
        boolean existsByLichKham_MaLich(
                        String maLich);
}
