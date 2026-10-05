package com.example.clinic.demo_phongkham_nhakhoa.notification.service;

// Service chứa các nghiệp vụ liên quan đến thông báo:

/*
GET  /api/v1/notifications/me
PATCH /api/v1/notifications/{id}/read
*/

import com.example.clinic.demo_phongkham_nhakhoa.notification.dto.response.NotificationResponse;
import com.example.clinic.demo_phongkham_nhakhoa.notification.entity.ThongBao;
import com.example.clinic.demo_phongkham_nhakhoa.notification.repository.ThongBaoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NotificationService {
        private final ThongBaoRepository thongBaoRepository;

        // Spring sẽ tự truyền ThongBaoRepository vào Service.
        public NotificationService(
                        ThongBaoRepository thongBaoRepository) {
                this.thongBaoRepository = thongBaoRepository;
        }

        @Transactional
        // Tạo một thông báo mới cho bệnh nhân.=>AppointmentService gọi nội bộ,
        public NotificationResponse taoThongBao(
                        String benhNhanId,
                        String maLich,
                        String tieuDe,
                        String noiDung,
                        String loaiThongBao) {
                // Kiểm tra các thông tin bắt buộc trước khi lưu.
                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");
                kiemTraKhongRong(maLich, "Mã lịch");
                kiemTraKhongRong(tieuDe, "Tiêu đề");
                kiemTraKhongRong(noiDung, "Nội dung");
                kiemTraKhongRong(loaiThongBao, "Loại thông báo");

                ThongBao thongBao = new ThongBao();

                thongBao.setBenhNhanId(benhNhanId);
                thongBao.setMaLich(maLich);
                thongBao.setTieuDe(tieuDe);
                thongBao.setNoiDung(noiDung);
                thongBao.setLoaiThongBao(loaiThongBao);

                ThongBao thongBaoDaLuu = thongBaoRepository.save(thongBao);

                return chuyenSangResponse(thongBaoDaLuu);
        }

        @Transactional(readOnly = true)
        // chỉ đọc dữ liệu và không thay đổi dữ liệu.
        public List<NotificationResponse> layThongBaoCuaBenhNhan(
                        String benhNhanId) {
                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");

                return thongBaoRepository
                                .findByBenhNhanIdOrderByThoiGianTaoDesc(benhNhanId)
                                .stream()
                                .map(this::chuyenSangResponse)
                                .toList();
        }

        /*
         * Chỉ lấy những thông báo chưa đọc của bệnh nhân.
         */
        @Transactional(readOnly = true)
        public List<NotificationResponse> layThongBaoChuaDoc(
                        String benhNhanId) {
                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");

                return thongBaoRepository
                                .findByBenhNhanIdAndDaDocFalseOrderByThoiGianTaoDesc(
                                                benhNhanId)
                                .stream()
                                .map(this::chuyenSangResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        // Đếm số thông báo chưa đọc.
        public long demThongBaoChuaDoc(
                        String benhNhanId) {
                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");

                return thongBaoRepository
                                .countByBenhNhanIdAndDaDocFalse(benhNhanId);
        }

        @Transactional
        public NotificationResponse danhDauDaDoc(
                        String maThongBao,
                        String benhNhanId) {
                kiemTraKhongRong(maThongBao, "Mã thông báo");
                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");

                ThongBao thongBao = thongBaoRepository
                                .findByMaThongBaoAndBenhNhanId(
                                                maThongBao,
                                                benhNhanId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy thông báo hoặc thông báo không thuộc bệnh nhân"));

                // Phương thức này được viết trong Entity ThongBao.java.
                thongBao.danhDauDaDoc();

                ThongBao thongBaoDaCapNhat = thongBaoRepository.save(thongBao);

                return chuyenSangResponse(thongBaoDaCapNhat);
        }

        // Chuyển Entity ThongBao thành NotificationResponse.
        private NotificationResponse chuyenSangResponse(
                        ThongBao thongBao) {
                NotificationResponse response = new NotificationResponse();

                response.setMaThongBao(thongBao.getMaThongBao());
                response.setMaLich(thongBao.getMaLich());
                response.setTieuDe(thongBao.getTieuDe());
                response.setNoiDung(thongBao.getNoiDung());
                response.setLoaiThongBao(thongBao.getLoaiThongBao());
                response.setDaDoc(thongBao.isDaDoc());
                response.setThoiGianTao(thongBao.getThoiGianTao());
                response.setThoiGianDoc(thongBao.getThoiGianDoc());

                return response;
        }

        private void kiemTraKhongRong(
                        String giaTri,
                        String tenTruong) {
                if (giaTri == null || giaTri.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        tenTruong + " không được để trống");
                }
        }

}