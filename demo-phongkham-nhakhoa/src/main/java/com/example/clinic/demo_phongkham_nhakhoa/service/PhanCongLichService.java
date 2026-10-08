package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.entity.*;
import com.example.clinic.demo_phongkham_nhakhoa.dto.*;
import com.example.clinic.demo_phongkham_nhakhoa.repository.*;
import com.example.clinic.demo_phongkham_nhakhoa.exception.*;
import com.example.clinic.demo_phongkham_nhakhoa.enums.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class PhanCongLichService {

    private final BacSiRepository bacSiRepository;
    private final PhongKhamRepository phongKhamRepository;
    private final YeuCauDatLichRepository yeuCauRepository;
    private final LichKhamRepository lichKhamRepository;

    // Sử dụng Constructor Injection
    public PhanCongLichService(BacSiRepository bacSiRepository,
                               PhongKhamRepository phongKhamRepository,
                               YeuCauDatLichRepository yeuCauRepository,
                               LichKhamRepository lichKhamRepository) {
        this.bacSiRepository = bacSiRepository;
        this.phongKhamRepository = phongKhamRepository;
        this.yeuCauRepository = yeuCauRepository;
        this.lichKhamRepository = lichKhamRepository;
    }

    @Transactional
    public KetQuaPhanCong phanCong(String maChuPhongKham, String maYeuCau, String maBacSi,
                                   String maPhong, LocalTime gioBatDau, int thoiLuongPhut) {

        // JPA findById trả về Optional, cần gọi orElse(null)
        BacSi chuPhongKham = bacSiRepository.findById(maChuPhongKham).orElse(null);
        YeuCauDatLich yeuCau = yeuCauRepository.findById(maYeuCau).orElse(null);
        BacSi bacSiDuocChon = bacSiRepository.findById(maBacSi).orElse(null);
        PhongKham phongDuocChon = phongKhamRepository.findById(maPhong).orElse(null);

        if (chuPhongKham == null || yeuCau == null || bacSiDuocChon == null || phongDuocChon == null) {
            throw new RuntimeException("Dữ liệu đầu vào không tồn tại trong hệ thống.");
        }

        if (!chuPhongKham.laChuPhongKham()) {
            throw new KhongCoQuyenException("Chỉ bác sĩ chủ phòng khám mới được phân công.");
        }

        if (!yeuCau.dangChoPhanCong()) {
            throw new YeuCauDaDuocXuLyException("Yêu cầu không ở trạng thái chờ phân công.");
        }

        LocalDate ngayKham = yeuCau.getNgayMongMuon();
        LocalTime gioKetThuc = gioBatDau.plusMinutes(thoiLuongPhut);
        LocalDateTime thoiGianBatDau = LocalDateTime.of(ngayKham, gioBatDau);
        LocalDateTime thoiGianKetThuc = LocalDateTime.of(ngayKham, gioKetThuc);

        if (!phongDuocChon.coTheXepLich()) {
            throw new TrungLichPhongException("Phòng khám không sẵn sàng (Bảo trì/Tạm ngừng).");
        }

        List<LichKham> lichCuaPhong = lichKhamRepository.findByPhongKhamAndNgayKham(phongDuocChon, ngayKham);
        if (!kiemTraGiaoNhau(lichCuaPhong, thoiGianBatDau, thoiGianKetThuc)) {
            throw new TrungLichPhongException("Trùng lịch phòng khám.");
        }

        if (!bacSiDuocChon.dangHoatDong()) {
            throw new RuntimeException("Bác sĩ không hoạt động.");
        }
        if (!bacSiDuocChon.coCaLamViec(ngayKham, yeuCau.getCaKham())) {
            throw new BacSiKhongCoCaException("Bác sĩ không có ca làm việc vào buổi này.");
        }
        if (!namTrongCaLamViec(bacSiDuocChon, ngayKham, yeuCau.getCaKham(), gioBatDau, gioKetThuc)) {
            throw new BacSiKhongCoCaException("Giờ bắt đầu không nằm trong ca làm việc của bác sĩ.");
        }

        List<LichKham> lichCuaBacSi = lichKhamRepository.findByBacSiAndNgayKham(bacSiDuocChon, ngayKham);
        if (!kiemTraGiaoNhau(lichCuaBacSi, thoiGianBatDau, thoiGianKetThuc)) {
            throw new TrungLichBacSiException("Trùng lịch bác sĩ.");
        }

        // Đảm bảo tên phương thức trong LichKhamRepository là findByBenhNhan_MaBenhNhanAndNgayKham
        List<LichKham> lichCuaBenhNhan = lichKhamRepository.findByBenhNhan_MaBenhNhanAndNgayKham(yeuCau.getBenhNhan().getMaBenhNhan(), ngayKham);
        if (!kiemTraGiaoNhau(lichCuaBenhNhan, thoiGianBatDau, thoiGianKetThuc)) {
            throw new TrungLichBenhNhanException("Bệnh nhân bị trùng lịch với ca khám khác.");
        }

        yeuCau.danhDauDaPhanCong();
        // Nhờ có @Transactional, thay đổi của yeuCau sẽ tự động được lưu xuống DB

        return new KetQuaPhanCong(bacSiDuocChon, phongDuocChon, ngayKham, gioBatDau, gioKetThuc, chuPhongKham);
    }

    @Transactional
    public void tuChoiYeuCau(String maChuPhongKham, String maYeuCau, String lyDo) {
        BacSi chuPhongKham = bacSiRepository.findById(maChuPhongKham).orElse(null);
        YeuCauDatLich yeuCau = yeuCauRepository.findById(maYeuCau).orElse(null);

        if (chuPhongKham == null || yeuCau == null) {
            throw new RuntimeException("Dữ liệu đầu vào không tồn tại.");
        }

        if (!chuPhongKham.laChuPhongKham()) {
            throw new KhongCoQuyenException("Chỉ chủ phòng khám mới được từ chối yêu cầu.");
        }
        yeuCau.tuChoi(lyDo);
    }

    private boolean kiemTraGiaoNhau(List<LichKham> danhSachLich, LocalDateTime batDauMoi, LocalDateTime ketThucMoi) {
        for (LichKham lichCu : danhSachLich) {
            LocalDateTime batDauCu = LocalDateTime.of(lichCu.getNgayKham(), lichCu.getGioBatDau());
            LocalDateTime ketThucCu = LocalDateTime.of(lichCu.getNgayKham(), lichCu.getGioKetThuc());

            if (batDauMoi.isBefore(ketThucCu) && ketThucMoi.isAfter(batDauCu)) {
                return false;
            }
        }
        return true;
    }

    private boolean namTrongCaLamViec(BacSi bacSi, LocalDate ngay, CaKham ca, LocalTime batDau, LocalTime ketThuc) {
        for (CaLamViec clv : bacSi.getDanhSachCaLam()) {
            if (clv.getNgayLamViec().equals(ngay) && clv.getCaKham() == ca && clv.isDangHoatDong()) {
                return clv.chuaThoiGian(batDau, ketThuc);
            }
        }
        return false;
    }
}