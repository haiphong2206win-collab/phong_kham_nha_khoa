package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.KetQuaPhanCongResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.*;
import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.LoaiThongBao;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.exception.*;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BacSiRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.PhongKhamRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.YeuCauDatLichRepository;
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
    private final ThongBaoService thongBaoService;

    // Sử dụng Constructor Injection
    public PhanCongLichService(BacSiRepository bacSiRepository,
                               PhongKhamRepository phongKhamRepository,
                               YeuCauDatLichRepository yeuCauRepository,
                               LichKhamRepository lichKhamRepository, ThongBaoService thongBaoService) {
        this.bacSiRepository = bacSiRepository;
        this.phongKhamRepository = phongKhamRepository;
        this.yeuCauRepository = yeuCauRepository;
        this.lichKhamRepository = lichKhamRepository;
        this.thongBaoService = thongBaoService;
    }

    @Transactional
    public KetQuaPhanCongResponse phanCong(String maChuPhongKham, String maYeuCau, String maBacSi,
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

        if (gioBatDau == null) {
            throw new IllegalArgumentException("Giờ bắt đầu không được để trống.");
        }

        if (thoiLuongPhut <= 0) {
            throw new IllegalArgumentException("Thời lượng khám phải lớn hơn 0.");
        }

        if (ngayKham == null) {
            throw new IllegalArgumentException("Ngày khám không được để trống.");
        }

        LocalTime gioKetThuc = gioBatDau.plusMinutes(thoiLuongPhut);

        if (!gioKetThuc.isAfter(gioBatDau)) {
            throw new IllegalArgumentException(
                    "Giờ kết thúc phải sau giờ bắt đầu trong cùng ngày."
            );
        }

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

        // 1. Tạo lịch khám chính thức từ yêu cầu đặt lịch
        LichKham lichKham = new LichKham();

        lichKham.setYeuCauGoc(yeuCau);
        lichKham.setBenhNhan(yeuCau.getBenhNhan());
        lichKham.setBacSi(bacSiDuocChon);
        lichKham.setPhongKham(phongDuocChon);
        lichKham.setNgayKham(ngayKham);
        lichKham.setGioBatDau(gioBatDau);
        lichKham.setGioKetThuc(gioKetThuc);
        lichKham.setLyDoKham(yeuCau.getLyDoKham());

        // Chờ bệnh nhân xác nhận lịch được phân công
        lichKham.setTrangThai(
                TrangThaiDatLich.CHO_BENH_NHAN_XAC_NHAN
        );

        // 2. Lưu lịch khám vào database
        lichKhamRepository.save(lichKham);

        // 3. Cập nhật trạng thái yêu cầu gốc
        yeuCau.danhDauDaPhanCong();
        yeuCauRepository.save(yeuCau);

        // 4. Thông báo cho bệnh nhân
        thongBaoService.taoThongBao(
                yeuCau.getBenhNhan().getTaiKhoan(),
                lichKham,
                LoaiThongBao.LICH_DA_PHAN_CONG,
                "Lịch khám đã được phân công",
                "Phòng khám đã phân công bác sĩ và giờ khám cho yêu cầu đặt lịch của bạn. "
                        + "Vui lòng đăng nhập để xác nhận hoặc hủy lịch."
        );

        // 5. Trả kết quả phân công
        return new KetQuaPhanCongResponse(
                bacSiDuocChon,
                phongDuocChon,
                ngayKham,
                gioBatDau,
                gioKetThuc,
                chuPhongKham
        );
    }

    @Transactional
    public void tuChoiYeuCau(
            String maChuPhongKham,
            String maYeuCau,
            String lyDo
    ) {
        // 1. Tìm chủ phòng khám và yêu cầu
        BacSi chuPhongKham = bacSiRepository
                .findById(maChuPhongKham)
                .orElse(null);

        YeuCauDatLich yeuCau = yeuCauRepository
                .findById(maYeuCau)
                .orElse(null);

        if (chuPhongKham == null || yeuCau == null) {
            throw new RuntimeException(
                    "Dữ liệu đầu vào không tồn tại."
            );
        }

        // 2. Kiểm tra quyền từ chối
        if (!chuPhongKham.laChuPhongKham()) {
            throw new KhongCoQuyenException(
                    "Chỉ chủ phòng khám mới được từ chối yêu cầu."
            );
        }

        // 3. Cập nhật trạng thái và lý do từ chối
        yeuCau.tuChoi(lyDo);

        // 4. Lưu thay đổi vào database
        yeuCauRepository.save(yeuCau);
    }


    private boolean kiemTraGiaoNhau(
            List<LichKham> danhSachLich,
            LocalDateTime batDauMoi,
            LocalDateTime ketThucMoi
    ) {
        for (LichKham lichCu : danhSachLich) {

            if (lichCu.getTrangThai() == TrangThaiDatLich.DA_HUY) {
                continue;
            }

            LocalDateTime batDauCu = LocalDateTime.of(
                    lichCu.getNgayKham(),
                    lichCu.getGioBatDau()
            );

            LocalDateTime ketThucCu = LocalDateTime.of(
                    lichCu.getNgayKham(),
                    lichCu.getGioKetThuc()
            );

            if (batDauMoi.isBefore(ketThucCu)
                    && ketThucMoi.isAfter(batDauCu)) {
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
