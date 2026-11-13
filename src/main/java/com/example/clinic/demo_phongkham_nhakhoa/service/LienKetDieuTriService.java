
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiLoTrinh;
import com.example.clinic.demo_phongkham_nhakhoa.event.LichKhamTrangThaiThayDoiEvent;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;

import org.springframework.context.event.EventListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

                Authentication authentication = SecurityContextHolder
                                .getContext()
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

                if (!tenDangNhapBacSi.equals(
                                authentication.getName())) {

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

                if (!maLoTrinhThucTe.equals(
                                maLoTrinhDieuTri)) {

                        throw new IllegalArgumentException(
                                        "Buoi dieu tri khong thuoc lo trinh nay");
                }

                return buoi;
        }

        // ==================================================
        // 3. KIEM TRA LO TRINH CO THE TIEP TUC
        // ==================================================

        private void kiemTraLoTrinhDangHoatDong(
                        LoTrinhDieuTri loTrinh) {

                TrangThaiLoTrinh trangThai = loTrinh.getTrangThai();

                if (trangThai != TrangThaiLoTrinh.CHUA_BAT_DAU
                                && trangThai != TrangThaiLoTrinh.DANG_DIEU_TRI) {

                        throw new IllegalStateException(
                                        "Lo trinh dang tam dung, "
                                                        + "da hoan thanh hoac da huy");
                }
        }

        // ==================================================
        // 4. LIEN KET BUOI VOI LICH KHAM CO SAN
        // ==================================================

        @Transactional
        public BuoiDieuTri lienKetBuoiVoiLich(
                        String maLoTrinhDieuTri,
                        String maBuoiDieuTri,
                        String maLichKham) {

                if (maLichKham == null
                                || maLichKham.isBlank()) {

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

                kiemTraLoTrinhDangHoatDong(
                                buoi.getLoTrinhDieuTri());

                if (buoiDieuTriRepository
                                .existsByLichKham_MaLich(maLichKham)) {

                        throw new IllegalStateException(
                                        "Lich kham da duoc lien ket voi buoi khac");
                }

                TrangThaiDatLich trangThaiLich = lichKham.getTrangThai();

                if (trangThaiLich != TrangThaiDatLich.CHO_BENH_NHAN_XAC_NHAN
                                && trangThaiLich != TrangThaiDatLich.DA_XAC_NHAN) {

                        throw new IllegalStateException(
                                        "Trang thai lich kham khong phu hop "
                                                        + "de lien ket buoi dieu tri");
                }

                buoi.ganLichKham(lichKham);

                return buoiDieuTriRepository.save(buoi);
        }

        // ==================================================
        // 5. GO LICH KHAM KHOI BUOI
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

                buoi.goLichKham();

                return buoiDieuTriRepository.save(buoi);
        }

        // ==================================================
        // 6. DONG BO THU CONG - GIU NGUYEN API CU
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

                return xuLyDongBo(
                                buoi,
                                lichKham.getTrangThai());
        }

        // ==================================================
        // 7. LANG NGHE SU KIEN DOI TRANG THAI LICH
        // ==================================================

        @EventListener
        @Transactional(propagation = Propagation.MANDATORY)
        public void khiLichKhamThayDoi(
                        LichKhamTrangThaiThayDoiEvent event) {

                if (event.maLich() == null
                                || event.maLich().isBlank()
                                || event.trangThaiMoi() == null) {

                        throw new IllegalArgumentException(
                                        "Su kien lich kham khong hop le");
                }

                Optional<BuoiDieuTri> ketQua = buoiDieuTriRepository
                                .findByLichKham_MaLich(
                                                event.maLich());

                // Lich kham thong thuong, khong thuoc lo trinh.
                if (ketQua.isEmpty()) {
                        return;
                }

                BuoiDieuTri buoi = ketQua.get();

                // Dam bao su kien phan anh trang thai hien tai.
                if (buoi.getLichKham() == null
                                || buoi.getLichKham().getTrangThai() != event.trangThaiMoi()) {

                        throw new IllegalStateException(
                                        "Trang thai lich kham khong khop su kien");
                }

                // Luong noi bo, khong kiem tra lai quyen bac si.
                // Quyen da duoc kiem tra tai service tao su kien.
                xuLyDongBo(buoi, event.trangThaiMoi());
        }

        // ==================================================
        // 8. LOGIC DONG BO DUNG CHUNG
        // ==================================================

        private BuoiDieuTri xuLyDongBo(
                        BuoiDieuTri buoi,
                        TrangThaiDatLich trangThaiLich) {

                if (trangThaiLich == null) {
                        throw new IllegalStateException(
                                        "Lich kham chua co trang thai");
                }

                TrangThaiBuoiDieuTri trangThaiBuoi = buoi.getTrangThai();

                // Lich huy hoac benh nhan vang mat:
                // Go lien ket de co the dat lich lai.
                if (trangThaiLich == TrangThaiDatLich.DA_HUY
                                || trangThaiLich == TrangThaiDatLich.VANG_MAT) {

                        buoi.goLichKham();

                        return buoiDieuTriRepository.save(buoi);
                }

                boolean coThayDoi = false;

                // Bac si bat dau kham.
                if (trangThaiLich == TrangThaiDatLich.DANG_KHAM) {

                        if (trangThaiBuoi == TrangThaiBuoiDieuTri.DA_LEN_LICH) {

                                kiemTraLoTrinhDangHoatDong(
                                                buoi.getLoTrinhDieuTri());

                                buoi.doiTrangThai(
                                                TrangThaiBuoiDieuTri.DANG_THUC_HIEN);

                                coThayDoi = true;

                        } else if (trangThaiBuoi != TrangThaiBuoiDieuTri.DANG_THUC_HIEN) {

                                throw new IllegalStateException(
                                                "Trang thai buoi khong phu hop "
                                                                + "de bat dau kham");
                        }
                }

                // Bac si hoan thanh kham.
                if (trangThaiLich == TrangThaiDatLich.HOAN_THANH) {

                        if (trangThaiBuoi == TrangThaiBuoiDieuTri.DANG_THUC_HIEN
                                        || trangThaiBuoi == TrangThaiBuoiDieuTri.DA_LEN_LICH) {

                                kiemTraLoTrinhDangHoatDong(
                                                buoi.getLoTrinhDieuTri());

                                buoi.doiTrangThai(
                                                TrangThaiBuoiDieuTri.HOAN_THANH);

                                coThayDoi = true;

                        } else if (trangThaiBuoi != TrangThaiBuoiDieuTri.HOAN_THANH) {

                                throw new IllegalStateException(
                                                "Trang thai buoi khong phu hop "
                                                                + "de hoan thanh kham");
                        }
                }

                // DA_DEN, DA_XAC_NHAN va cac trang thai khac:
                // Khong can thay doi trang thai buoi.
                if (!coThayDoi) {
                        return buoi;
                }

                BuoiDieuTri daLuu = buoiDieuTriRepository.save(buoi);

                // Sau khi buoi thay doi, tinh lai lo trinh.
                capNhatTrangThaiLoTrinh(
                                daLuu.getLoTrinhDieuTri());

                return daLuu;
        }

        // ==================================================
        // 9. TU DONG CAP NHAT TRANG THAI LO TRINH
        // ==================================================

        @Transactional(propagation = Propagation.MANDATORY)
        public void capNhatTrangThaiLoTrinh(
                        LoTrinhDieuTri loTrinh) {

                if (loTrinh == null) {
                        throw new IllegalArgumentException(
                                        "Lo trinh khong duoc de trong");
                }

                TrangThaiLoTrinh trangThaiHienTai = loTrinh.getTrangThai();

                // Khong tu dong mo lai lo trinh da dong.
                if (trangThaiHienTai == TrangThaiLoTrinh.TAM_DUNG
                                || trangThaiHienTai == TrangThaiLoTrinh.DA_HUY
                                || trangThaiHienTai == TrangThaiLoTrinh.HOAN_THANH) {
                        return;
                }

                List<BuoiDieuTri> danhSachBuoi = buoiDieuTriRepository
                                .findByLoTrinhDieuTri_MaLoTrinhDieuTriOrderBySoThuTuAsc(
                                                loTrinh.getMaLoTrinhDieuTri());

                int soBuoiDangApDung = 0;
                int soBuoiHoanThanh = 0;
                boolean coBuoiDangThucHien = false;

                for (BuoiDieuTri buoi : danhSachBuoi) {

                        if (buoi.getTrangThai() == TrangThaiBuoiDieuTri.DA_BO) {
                                continue;
                        }

                        soBuoiDangApDung++;

                        if (buoi.getTrangThai() == TrangThaiBuoiDieuTri.HOAN_THANH) {
                                soBuoiHoanThanh++;
                        }

                        if (buoi.getTrangThai() == TrangThaiBuoiDieuTri.DANG_THUC_HIEN) {
                                coBuoiDangThucHien = true;
                        }
                }

                // Chi hoan thanh neu con it nhat 1 buoi ap dung
                // va tat ca cac buoi do deu da hoan thanh.
                if (soBuoiDangApDung > 0
                                && soBuoiHoanThanh == soBuoiDangApDung) {

                        loTrinh.doiTrangThai(
                                        TrangThaiLoTrinh.HOAN_THANH);

                        return;
                }

                // Da bat dau hoac da hoan thanh it nhat 1 buoi.
                if (coBuoiDangThucHien
                                || soBuoiHoanThanh > 0) {

                        if (trangThaiHienTai != TrangThaiLoTrinh.DANG_DIEU_TRI) {

                                loTrinh.doiTrangThai(
                                                TrangThaiLoTrinh.DANG_DIEU_TRI);
                        }
                }

                // Khong dua lo trinh da bat dau
                // quay lai CHUA_BAT_DAU.
                // Entity lo trinh duoc JPA theo doi va luu
                // trong transaction dang hoat dong.
        }
}
