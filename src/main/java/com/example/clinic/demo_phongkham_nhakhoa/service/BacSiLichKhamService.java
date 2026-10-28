package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BenhNhanTrongLichResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LichKhamBacSiResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BacSiRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;
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

    public BacSiLichKhamService(
            BacSiRepository bacSiRepository,
            LichKhamRepository lichKhamRepository
    ) {
        this.bacSiRepository = bacSiRepository;
        this.lichKhamRepository = lichKhamRepository;
    }

    // 1. Bác sĩ xem danh sách lịch được phân công
    public List<LichKhamBacSiResponse> layLichCuaToi(
            String tenDangNhap
    ) {
        BacSi bacSi = bacSiRepository
                .findByTaiKhoan_TenDangNhap(tenDangNhap)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy hồ sơ bác sĩ"
                ));

        return lichKhamRepository
                .findByBacSi_MaBacSiOrderByNgayKhamAscGioBatDauAsc(
                        bacSi.getMaBacSi()
                )
                .stream()
                .map(this::chuyenSangLichKhamResponse)
                .toList();
    }

    // 2. Xem bệnh nhân trong một lịch thuộc bác sĩ đang đăng nhập
    public BenhNhanTrongLichResponse xemBenhNhanTrongLich(
            String tenDangNhap,
            String maLich
    ) {
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
                benhNhan.getDiUngThuoc()
        );
    }

    // 3. Bác sĩ cập nhật trạng thái lịch khám
    @Transactional
    public LichKhamBacSiResponse capNhatTrangThai(
            String tenDangNhap,
            String maLich,
            TrangThaiDatLich trangThaiMoi
    ) {
        LichKham lich = timLichCuaBacSi(tenDangNhap, maLich);

        TrangThaiDatLich trangThaiCu = lich.getTrangThai();

        if (!duocPhepChuyenTrangThai(trangThaiCu, trangThaiMoi)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Không thể chuyển trạng thái lịch khám từ "
                            + trangThaiCu + " sang " + trangThaiMoi
            );
        }

        lich.setTrangThai(trangThaiMoi);

        LichKham daLuu = lichKhamRepository.save(lich);

        return chuyenSangLichKhamResponse(daLuu);
    }

    // Kiểm tra lịch có thực sự thuộc bác sĩ đang đăng nhập không
    private LichKham timLichCuaBacSi(
            String tenDangNhap,
            String maLich
    ) {
        return lichKhamRepository
                .findByMaLichAndBacSi_TaiKhoan_TenDangNhap(
                        maLich,
                        tenDangNhap
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy lịch khám thuộc bác sĩ đang đăng nhập"
                ));
    }

    // Chỉ cho phép chuyển trạng thái theo quy trình khám
    private boolean duocPhepChuyenTrangThai(
            TrangThaiDatLich hienTai,
            TrangThaiDatLich moi
    ) {
        if (hienTai == null || moi == null || hienTai == moi) {
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

    // Chuyển Entity sang DTO, không trả trực tiếp Entity ra ngoài
    private LichKhamBacSiResponse chuyenSangLichKhamResponse(
            LichKham lich
    ) {
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
                benhNhan.getDiUngThuoc()
        );
    }
}
