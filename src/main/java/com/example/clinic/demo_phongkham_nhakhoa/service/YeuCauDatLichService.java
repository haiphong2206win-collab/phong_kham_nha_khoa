package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoYeuCauDatLichRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.YeuCauDatLichResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.YeuCauDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiYeuCau;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.YeuCauDatLichRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class YeuCauDatLichService {

    private final YeuCauDatLichRepository repository;

    private final BenhNhanRepository benhNhanRepository;

    public YeuCauDatLichService(YeuCauDatLichRepository repository, BenhNhanRepository benhNhanRepository) {
        this.repository = repository;
        this.benhNhanRepository = benhNhanRepository;
    }

    // 1. Bệnh nhân gửi yêu cầu đặt lịch mới
    @Transactional
    public YeuCauDatLichResponse guiYeuCau(String tenDangNhap, TaoYeuCauDatLichRequest request) {

        BenhNhan benhNhan = benhNhanRepository.findByTaiKhoan_TenDangNhap(tenDangNhap)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin bệnh nhân"));

        // Kiểm tra xem bệnh nhân đã hoàn thiện thông tin bắt buộc chưa
        if (!benhNhan.daHoanThienThongTin()) {
            throw new IllegalStateException("Bạn cần hoàn thiện hồ sơ cá nhân (Họ tên, Ngày sinh, Số điện thoại) trước khi đặt lịch");
        }

        // Kiểm tra ngày mong muốn không ở quá khứ
        if (request.getNgayMongMuon().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày mong muốn không được ở quá khứ");
        }

        // Kiểm tra trùng yêu cầu hoạt động (CHO_PHAN_CONG hoặc DA_PHAN_CONG) cùng ngày và ca
        List<TrangThaiYeuCau> trangThaiHoatDong = List.of(TrangThaiYeuCau.CHO_PHAN_CONG, TrangThaiYeuCau.DA_PHAN_CONG);
        boolean biTrung = repository.tonTaiYeuCauHoatDong(
                benhNhan.getMaBenhNhan(),
                request.getNgayMongMuon(),
                request.getCaKham(),
                trangThaiHoatDong
        );
        if (biTrung) {
            throw new IllegalArgumentException("Bạn đã có một yêu cầu đặt lịch trùng ngày và ca khám này đang được xử lý");
        }

        String maYeuCau = "YC-" + UUID.randomUUID().toString().substring(0, 8);
        YeuCauDatLich yeuCauDatLich = new YeuCauDatLich(
                maYeuCau,
                benhNhan,
                request.getNgayMongMuon(),
                request.getCaKham(),
                request.getLyDoKham(),
                request.getGhiChu()
        );

        YeuCauDatLich daLuu = repository.save(yeuCauDatLich);
        return chuyenSangResponseDto(daLuu);
    }

    // 2. Lấy danh sách yêu cầu của bệnh nhân đang đăng nhập
    public List<YeuCauDatLichResponse> layDanhSachCuaToi(String tenDangNhap) {
        BenhNhan benhNhan = benhNhanRepository.findByTaiKhoan_TenDangNhap(tenDangNhap)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bệnh nhân"));

        List<YeuCauDatLich> danhSach = repository.findByBenhNhan_MaBenhNhanOrderByThoiGianGuiDesc(benhNhan.getMaBenhNhan());
        return danhSach.stream().map(this::chuyenSangResponseDto).toList();
    }

    // 3. Lấy chi tiết yêu cầu đặt lịch
    public YeuCauDatLichResponse layChiTiet(String maYeuCau) {
        YeuCauDatLich yeuCauDatLich = timTheoId(maYeuCau);
        return chuyenSangResponseDto(yeuCauDatLich);
    }

    // 4. Bệnh nhân tự hủy yêu cầu đang chờ xử lý
    @Transactional
    public YeuCauDatLichResponse huyYeuCau(String maYeuCau, String tenDangNhap, String lyDo) {
        YeuCauDatLich yeuCauDatLich = timTheoId(maYeuCau);

        if (!yeuCauDatLich.getBenhNhan().getTaiKhoan().getTenDangNhap().equals(tenDangNhap)) {
            throw new IllegalArgumentException("Bạn không có quyền hủy yêu cầu này");
        }

        yeuCauDatLich.huy(lyDo);
        YeuCauDatLich daLuu = repository.save(yeuCauDatLich);
        return chuyenSangResponseDto(daLuu);
    }

    // --- CÁC PHƯƠNG THỨC CHO BÁC SĨ CHỦ / QUẢN LÝ (NGƯỜI 2 SẼ GỌI) ---

    // 5. Bác sĩ chủ từ chối yêu cầu đặt lịch
    @Transactional
    public YeuCauDatLichResponse tuChoi(String maYeuCau, String lyDo) {
        YeuCauDatLich yeuCauDatLich = timTheoEntityId(maYeuCau);
        yeuCauDatLich.tuChoi(lyDo);
        return chuyenSangResponseDto(repository.save(yeuCauDatLich));
    }

    // 6. Bác sĩ chủ đánh dấu yêu cầu đã được phân công thành công
    @Transactional
    public YeuCauDatLichResponse phanCong(String maYeuCau) {
        YeuCauDatLich yeuCauDatLich = timTheoEntityId(maYeuCau);
        yeuCauDatLich.danhDauDaPhanCong();
        return chuyenSangResponseDto(repository.save(yeuCauDatLich));
    }

    // 7. Lấy danh sách toàn bộ yêu cầu (Cho Bác sĩ chủ quản lý)
    public List<YeuCauDatLichResponse> layDanhSach() {
        return repository.findAll().stream().map(this::chuyenSangResponseDto).toList();
    }

    // 8. Trả về Entity trực tiếp cho Người 2 dùng khi ghép nối tạo Lịch Khám
    public YeuCauDatLich timTheoEntityId(String maYeuCau) {
        return repository.findById(maYeuCau)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu đặt lịch với mã: " + maYeuCau));
    }

    // 9. Xóa yêu cầu theo ID
    @Transactional
    public void xoa(String maYeuCau) {
        YeuCauDatLich yeuCauDatLich = timTheoEntityId(maYeuCau);
        repository.delete(yeuCauDatLich);
    }

    // --- HÀM PHỤ TRỢ ---
    private YeuCauDatLichResponse chuyenSangResponseDto(YeuCauDatLich entity) {
        return new YeuCauDatLichResponse(
                entity.getMaYeuCau(),
                entity.getBenhNhan().getMaBenhNhan(),
                entity.getBenhNhan().getHoTen(),
                entity.getNgayMongMuon(),
                entity.getCaKham(),
                entity.getLyDoKham(),
                entity.getGhiChu(),
                entity.getThoiGianGui(),
                entity.getTrangThai(),
                entity.getLyDoTuChoi()
        );
    }

    // Tìm Entity YeuCauDatLich theo ID (trả về Entity trực tiếp cho Service khác / Người 2 gọi)
    public YeuCauDatLich timTheoId(String maYeuCau) {
        return repository.findById(maYeuCau)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu đặt lịch với mã: " + maYeuCau));
    }
}
