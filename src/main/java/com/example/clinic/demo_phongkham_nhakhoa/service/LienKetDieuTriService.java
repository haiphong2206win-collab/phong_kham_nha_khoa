
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LienKetDieuTriService {

    private final BuoiDieuTriRepository buoiDieuTriRepository;
    private final LichKhamRepository lichKhamRepository;

    public LienKetDieuTriService(
            BuoiDieuTriRepository buoiDieuTriRepository,
            LichKhamRepository lichKhamRepository) {

        this.buoiDieuTriRepository = buoiDieuTriRepository;
        this.lichKhamRepository = lichKhamRepository;
    }

    // ==================================================
    // 1. KIEM TRA QUYEN NGUOI DUNG
    // ==================================================

    private void kiemTraQuyen(LichKham lichKham) {

        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new SecurityException(
                    "Nguoi dung chua dang nhap");
        }

        boolean laChuPhongKham = authentication
                .getAuthorities()
                .stream()
                .anyMatch(quyen -> "ROLE_CHU_PHONG_KHAM"
                        .equals(quyen.getAuthority()));

        if (laChuPhongKham) {
            return;
        }

        boolean laBacSi = authentication
                .getAuthorities()
                .stream()
                .anyMatch(quyen -> "ROLE_BAC_SI"
                        .equals(quyen.getAuthority()));

        if (!laBacSi) {
            throw new SecurityException(
                    "Khong co quyen quan ly lich dieu tri");
        }

        if (lichKham.getBacSi() == null
                || lichKham.getBacSi().getTaiKhoan() == null) {

            throw new IllegalStateException(
                    "Lich kham chua co thong tin bac si");
        }

        String tenDangNhapBacSi = lichKham
                .getBacSi()
                .getTaiKhoan()
                .getTenDangNhap();

        if (!authentication.getName()
                .equals(tenDangNhapBacSi)) {

            throw new SecurityException(
                    "Bac si khong duoc phan cong lich nay");
        }
    }

    // ==================================================
    // 2. TIM BUOI THUOC DUNG LO TRINH
    // ==================================================

    private BuoiDieuTri timBuoi(
            String maLoTrinhDieuTri,
            String maBuoiDieuTri) {

        BuoiDieuTri buoi = buoiDieuTriRepository
                .findById(maBuoiDieuTri)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Khong tim thay buoi dieu tri"));

        String maLoTrinhThucTe = buoi
                .getLoTrinhDieuTri()
                .getMaLoTrinhDieuTri();

        if (!maLoTrinhThucTe.equals(maLoTrinhDieuTri)) {
            throw new IllegalArgumentException(
                    "Buoi dieu tri khong thuoc lo trinh nay");
        }

        return buoi;
    }

    // ==================================================
    // 3. LIEN KET BUOI VOI LICH KHAM CO SAN
    // ==================================================

    @Transactional
    public BuoiDieuTri lienKetBuoiVoiLich(
            String maLoTrinhDieuTri,
            String maBuoiDieuTri,
            String maLichKham) {

        if (maLichKham == null || maLichKham.isBlank()) {
            throw new IllegalArgumentException(
                    "Ma lich kham khong duoc de trong");
        }

        BuoiDieuTri buoi = timBuoi(
                maLoTrinhDieuTri,
                maBuoiDieuTri);

        LichKham lichKham = lichKhamRepository
                .findById(maLichKham)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Khong tim thay lich kham"));

        kiemTraQuyen(lichKham);

        if (buoiDieuTriRepository
                .existsByLichKham_MaLich(maLichKham)) {

            throw new IllegalStateException(
                    "Lich kham da duoc lien ket voi buoi khac");
        }

        // Chi lien ket lich dang cho xac nhan
        // hoac da duoc benh nhan xac nhan.
        TrangThaiDatLich trangThaiLich = lichKham.getTrangThai();

        if (trangThaiLich != TrangThaiDatLich.CHO_BENH_NHAN_XAC_NHAN
                && trangThaiLich != TrangThaiDatLich.DA_XAC_NHAN) {

            throw new IllegalStateException(
                    "Trang thai lich kham khong phu hop "
                            + "de lien ket buoi dieu tri");
        }

        // Entity BuoiDieuTri tu kiem tra
        // benh nhan va trang thai buoi.
        buoi.ganLichKham(lichKham);

        return buoiDieuTriRepository.save(buoi);
    }

    // ==================================================
    // 4. GO LICH KHAM KHOI BUOI
    // ==================================================

    @Transactional
    public BuoiDieuTri goLichKhoiBuoi(
            String maLoTrinhDieuTri,
            String maBuoiDieuTri) {

        BuoiDieuTri buoi = timBuoi(
                maLoTrinhDieuTri,
                maBuoiDieuTri);

        LichKham lichKham = buoi.getLichKham();

        if (lichKham == null) {
            throw new IllegalStateException(
                    "Buoi dieu tri chua co lich kham");
        }

        kiemTraQuyen(lichKham);

        // Entity chi cho phep go lich
        // da huy hoac benh nhan vang mat.
        buoi.goLichKham();

        return buoiDieuTriRepository.save(buoi);
    }

    // ==================================================
    // 5. DONG BO TRANG THAI TU LICH KHAM
    // ==================================================

    @Transactional
    public BuoiDieuTri dongBoTrangThai(
            String maLoTrinhDieuTri,
            String maBuoiDieuTri) {

        BuoiDieuTri buoi = timBuoi(
                maLoTrinhDieuTri,
                maBuoiDieuTri);

        LichKham lichKham = buoi.getLichKham();

        if (lichKham == null) {
            throw new IllegalStateException(
                    "Buoi dieu tri chua co lich kham");
        }

        kiemTraQuyen(lichKham);

        TrangThaiDatLich trangThaiLich = lichKham.getTrangThai();

        TrangThaiBuoiDieuTri trangThaiBuoi = buoi.getTrangThai();

        // Lich bi huy hoac benh nhan vang mat
        if (trangThaiLich == TrangThaiDatLich.DA_HUY
                || trangThaiLich == TrangThaiDatLich.VANG_MAT) {

            buoi.goLichKham();
            return buoiDieuTriRepository.save(buoi);
        }

        // Bac si dang kham
        if (trangThaiLich == TrangThaiDatLich.DANG_KHAM) {

            if (trangThaiBuoi == TrangThaiBuoiDieuTri.DA_LEN_LICH) {

                buoi.doiTrangThai(
                        TrangThaiBuoiDieuTri.DANG_THUC_HIEN);
            }
        }

        // Bac si hoan thanh lich kham
        if (trangThaiLich == TrangThaiDatLich.HOAN_THANH) {

            if (trangThaiBuoi == TrangThaiBuoiDieuTri.DANG_THUC_HIEN
                    || trangThaiBuoi == TrangThaiBuoiDieuTri.DA_LEN_LICH) {

                buoi.doiTrangThai(
                        TrangThaiBuoiDieuTri.HOAN_THANH);
            }
        }

        return buoiDieuTriRepository.save(buoi);
    }
}
