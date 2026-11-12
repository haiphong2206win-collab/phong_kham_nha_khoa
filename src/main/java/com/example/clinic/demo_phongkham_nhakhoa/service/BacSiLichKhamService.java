
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BenhNhanTrongLichResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LichKhamBacSiResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.event.LichKhamTrangThaiThayDoiEvent;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BacSiRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BacSiLichKhamService {

        private final BacSiRepository bacSiRepository;
        private final LichKhamRepository lichKhamRepository;

        // GIAI DOAN 3 - Bo sung Event Publisher
        private final ApplicationEventPublisher eventPublisher;

        public BacSiLichKhamService(
                        BacSiRepository bacSiRepository,
                        LichKhamRepository lichKhamRepository,
                        ApplicationEventPublisher eventPublisher) {
                this.bacSiRepository = bacSiRepository;
                this.lichKhamRepository = lichKhamRepository;
                this.eventPublisher = eventPublisher;
        }

        // ==================================================
        // 1. BAC SI XEM DANH SACH LICH DUOC PHAN CONG
        // ==================================================

        public List<LichKhamBacSiResponse> layLichCuaToi(
                        String tenDangNhap) {
                BacSi bacSi = bacSiRepository
                                .findByTaiKhoan_TenDangNhap(tenDangNhap)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy hồ sơ bác sĩ"));

                return lichKhamRepository
                                .findByBacSi_MaBacSiOrderByNgayKhamAscGioBatDauAsc(
                                                bacSi.getMaBacSi())
                                .stream()
                                .map(this::chuyenSangLichKhamResponse)
                                .toList();
        }

        // ==================================================
        // 2. XEM BENH NHAN TRONG LICH CUA BAC SI
        // ==================================================

        public BenhNhanTrongLichResponse xemBenhNhanTrongLich(
                        String tenDangNhap,
                        String maLich) {
                LichKham lich = timLichCuaBacSi(tenDangNhap, maLich);

                BenhNhan benhNhan = lich.getBenhNhan();

                return new BenhNhanTrongLichResponse(
                                lich.getMaLich(),
                                benhNhan.getMaBenhNhan(),
                                benhNhan.getHoTen(),
                                benhNhan.getNgaySinh(),
                                benhNhan.getGioiTinh(),
                                benhNhan.getSoDienThoai(),
                                benhNhan.getEmail(),
                                benhNhan.getDiaChi(),
                                benhNhan.getTienSuBenh(),
                                benhNhan.getDiUngThuoc());
        }

        // ==================================================
        // 3. BAC SI CAP NHAT TRANG THAI LICH KHAM
        // GIAI DOAN 3 - TU DONG PHAT SU KIEN DONG BO
        // ==================================================

        @Transactional
        public LichKhamBacSiResponse capNhatTrangThai(
                        String tenDangNhap,
                        String maLich,
                        TrangThaiDatLich trangThaiMoi) {

                // 1. Tim lich thuoc bac si dang dang nhap
                LichKham lich = timLichCuaBacSi(
                                tenDangNhap,
                                maLich);

                // 2. Luu trang thai cu
                TrangThaiDatLich trangThaiCu = lich.getTrangThai();

                // 3. Kiem tra quy tac chuyen trang thai
                if (!duocPhepChuyenTrangThai(
                                trangThaiCu,
                                trangThaiMoi)) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Không thể chuyển trạng thái lịch khám từ "
                                                        + trangThaiCu + " sang " + trangThaiMoi);
                }

                // 4. Cap nhat trang thai lich kham
                lich.setTrangThai(trangThaiMoi);

                // 5. Luu lich kham
                LichKham daLuu = lichKhamRepository.save(lich);

                // ==================================================
                // GIAI DOAN 3 - PHAT SU KIEN TU DONG DONG BO
                // ==================================================
                //
                // EventListener trong LienKetDieuTriService
                // se tim BuoiDieuTri lien ket voi maLich.
                //
                // Neu la lich kham thong thuong:
                // Khong co BuoiDieuTri -> khong thay doi gi.
                //
                // Neu lich thuoc lo trinh:
                // DANG_KHAM -> DANG_THUC_HIEN
                // HOAN_THANH -> HOAN_THANH
                // VANG_MAT -> TAM_HOAN
                //
                // Event duoc xu ly dong bo trong transaction
                // cua phuong thuc capNhatTrangThai.
                // ==================================================

                eventPublisher.publishEvent(
                                new LichKhamTrangThaiThayDoiEvent(
                                                daLuu.getMaLich(),
                                                trangThaiCu,
                                                trangThaiMoi));

                // 6. Tra ve DTO nhu logic cu cua nhom
                return chuyenSangLichKhamResponse(daLuu);
        }

        // ==================================================
        // 4. KIEM TRA LICH THUOC BAC SI DANG DANG NHAP
        // ==================================================

        private LichKham timLichCuaBacSi(
                        String tenDangNhap,
                        String maLich) {
                return lichKhamRepository
                                .findByMaLichAndBacSi_TaiKhoan_TenDangNhap(
                                                maLich,
                                                tenDangNhap)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy lịch khám thuộc bác sĩ đang đăng nhập"));
        }

        // ==================================================
        // 5. KIEM TRA QUY TAC CHUYEN TRANG THAI
        // GIU NGUYEN LOGIC CUA NHOM
        // ==================================================

        private boolean duocPhepChuyenTrangThai(
                        TrangThaiDatLich hienTai,
                        TrangThaiDatLich moi) {

                if (hienTai == null
                                || moi == null
                                || hienTai == moi) {

                        return false;
                }

                return switch (hienTai) {

                        case CHO_BENH_NHAN_XAC_NHAN, DA_XAC_NHAN ->
                                moi == TrangThaiDatLich.DA_DEN
                                                || moi == TrangThaiDatLich.VANG_MAT;

                        case DA_DEN ->
                                moi == TrangThaiDatLich.DANG_KHAM;

                        case DANG_KHAM ->
                                moi == TrangThaiDatLich.HOAN_THANH;

                        default -> false;
                };
        }

        // ==================================================
        // 6. CHUYEN ENTITY SANG DTO RESPONSE
        // GIU NGUYEN LOGIC CUA NHOM
        // ==================================================

        private LichKhamBacSiResponse chuyenSangLichKhamResponse(
                        LichKham lich) {

                BenhNhan benhNhan = lich.getBenhNhan();

                return new LichKhamBacSiResponse(
                                lich.getMaLich(),
                                lich.getNgayKham(),
                                lich.getGioBatDau(),
                                lich.getGioKetThuc(),
                                lich.getLyDoKham(),
                                lich.getTrangThai(),
                                lich.getPhongKham().getMaPhong(),
                                lich.getPhongKham().getTenPhong(),
                                benhNhan.getMaBenhNhan(),
                                benhNhan.getHoTen(),
                                benhNhan.getNgaySinh(),
                                benhNhan.getGioiTinh(),
                                benhNhan.getSoDienThoai(),
                                benhNhan.getEmail(),
                                benhNhan.getTienSuBenh(),
                                benhNhan.getDiUngThuoc());
        }
}
