package com.example.clinic.demo_phongkham_nhakhoa.appointment.service;

// xử lý nghiệp vụ lịch khám.

import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request.CancelAppointmentRequest;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request.RequestChangeAppointmentRequest;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request.RescheduleAppointmentRequest;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.response.AppointmentResponse;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.repository.LichKhamRepository;
import com.example.clinic.demo_phongkham_nhakhoa.notification.service.NotificationService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

        private static final String DA_TAO = "DA_TAO";
        private static final String DA_XAC_NHAN = "DA_XAC_NHAN";
        private static final String YEU_CAU_DOI_LICH = "YEU_CAU_DOI_LICH";
        private static final String DA_HUY = "DA_HUY";
        private static final String DA_DEN = "DA_DEN";
        private static final String DANG_KHAM = "DANG_KHAM";
        private static final String HOAN_THANH = "HOAN_THANH";
        private static final String VANG_MAT = "VANG_MAT";

        private final LichKhamRepository lichKhamRepository;
        private final NotificationService notificationService;

        public AppointmentService(
                        LichKhamRepository lichKhamRepository,
                        NotificationService notificationService) {
                this.lichKhamRepository = lichKhamRepository;
                this.notificationService = notificationService;
        }

        // Service này kiểm tra lại dữ liệu trước khi lưu.
        // Người thứ 2 chịu trách nhiệm chọn bác sĩ và phòng phù hợp.

        @Transactional
        public AppointmentResponse taoLichKhamTuPhanCong(
                        String yeuCauDatLichId,
                        String benhNhanId,
                        String bacSiId,
                        String phongId,
                        LocalDate ngayKham,
                        LocalTime gioBatDau,
                        int thoiLuongPhut,
                        String lyDoKham) {

                kiemTraKhongRong(yeuCauDatLichId, "Mã yêu cầu đặt lịch");
                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");
                kiemTraKhongRong(bacSiId, "Mã bác sĩ");
                kiemTraKhongRong(phongId, "Mã phòng");
                kiemTraKhongRong(lyDoKham, "Lý do khám");

                // Một yêu cầu đặt lịch chỉ được tạo thành một lịch khám.
                if (lichKhamRepository.existsByYeuCauDatLichId(
                                yeuCauDatLichId)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Yêu cầu đặt lịch này đã được tạo thành lịch khám");
                }

                LocalTime gioKetThuc = kiemTraVaTinhGioKetThuc(
                                ngayKham,
                                gioBatDau,
                                thoiLuongPhut);

                // Kiểm tra lần cuối trước khi ghi lịch vào H2.
                damBaoKhongTrungLich(
                                null,
                                bacSiId,
                                phongId,
                                ngayKham,
                                gioBatDau,
                                gioKetThuc);

                LichKham lichKham = new LichKham();

                lichKham.setYeuCauDatLichId(yeuCauDatLichId);
                lichKham.setBenhNhanId(benhNhanId);
                lichKham.setBacSiId(bacSiId);
                lichKham.setPhongId(phongId);
                lichKham.setNgayKham(ngayKham);
                lichKham.setGioBatDau(gioBatDau);
                lichKham.setGioKetThuc(gioKetThuc);
                lichKham.setLyDoKham(lyDoKham);
                lichKham.setTrangThai(DA_TAO);

                LichKham lichDaLuu = lichKhamRepository.save(lichKham);

                notificationService.taoThongBao(
                                lichDaLuu.getBenhNhanId(),
                                lichDaLuu.getMaLich(),
                                "Lịch khám đã được tạo",
                                "Bạn có lịch khám lúc "
                                                + lichDaLuu.getGioBatDau()
                                                + " ngày "
                                                + lichDaLuu.getNgayKham()
                                                + ". Vui lòng kiểm tra và xác nhận.",
                                "TAO_LICH");

                return chuyenSangResponse(lichDaLuu);
        }

        // Bệnh nhân xem toàn bộ lịch sử lịch khám của mình.
        @Transactional(readOnly = true)
        public List<AppointmentResponse> layLichCuaBenhNhan(
                        String benhNhanId) {

                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");

                return lichKhamRepository
                                .findByBenhNhanIdOrderByNgayKhamDescGioBatDauDesc(
                                                benhNhanId)
                                .stream()
                                .map(this::chuyenSangResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<AppointmentResponse> layLichSapToiCuaBacSi(
                        String bacSiId) {

                kiemTraKhongRong(bacSiId, "Mã bác sĩ");

                return lichKhamRepository
                                .findByBacSiIdAndNgayKhamGreaterThanEqualOrderByNgayKhamAscGioBatDauAsc(
                                                bacSiId,
                                                LocalDate.now())
                                .stream()
                                .filter(lichKham -> !DA_HUY.equals(lichKham.getTrangThai())
                                                && !VANG_MAT.equals(lichKham.getTrangThai())
                                                && !HOAN_THANH.equals(lichKham.getTrangThai()))
                                .map(this::chuyenSangResponse)
                                .toList();
        }

        // Chủ phòng khám xem lịch của một ngày.
        @Transactional(readOnly = true)
        public List<AppointmentResponse> layLichTrongNgay(
                        LocalDate ngayKham) {

                if (ngayKham == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ngày khám không được để trống");
                }

                return lichKhamRepository
                                .findByNgayKhamOrderByGioBatDauAsc(ngayKham)
                                .stream()
                                .map(this::chuyenSangResponse)
                                .toList();
        }

        // Bệnh nhân chỉ được xem chi tiết lịch thuộc về mình.
        @Transactional(readOnly = true)
        public AppointmentResponse xemChiTietCuaBenhNhan(
                        String maLich,
                        String benhNhanId) {

                return chuyenSangResponse(
                                timLichCuaBenhNhan(maLich, benhNhanId));
        }

        @Transactional(readOnly = true)
        public AppointmentResponse xemChiTietCuaBacSi(
                        String maLich,
                        String bacSiId) {

                return chuyenSangResponse(
                                timLichCuaBacSi(maLich, bacSiId));
        }

        // Bệnh nhân xác nhận sẽ đến khám.
        @Transactional
        public AppointmentResponse xacNhanLich(
                        String maLich,
                        String benhNhanId) {

                LichKham lichKham = timLichCuaBenhNhan(maLich, benhNhanId);

                // Gọi lại API nhiều lần không làm thay đổi kết quả.
                if (DA_XAC_NHAN.equals(lichKham.getTrangThai())) {
                        return chuyenSangResponse(lichKham);
                }

                damBaoLichChuaBatDau(lichKham);

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "xác nhận lịch",
                                DA_TAO);

                lichKham.setTrangThai(DA_XAC_NHAN);

                LichKham lichDaLuu = lichKhamRepository.save(lichKham);

                notificationService.taoThongBao(
                                lichDaLuu.getBenhNhanId(),
                                lichDaLuu.getMaLich(),
                                "Xác nhận lịch thành công",
                                "Bạn đã xác nhận lịch khám lúc "
                                                + lichDaLuu.getGioBatDau()
                                                + " ngày "
                                                + lichDaLuu.getNgayKham()
                                                + ".",
                                "XAC_NHAN_LICH");

                return chuyenSangResponse(lichDaLuu);
        }

        @Transactional
        public AppointmentResponse yeuCauDoiLich(
                        String maLich,
                        String benhNhanId,
                        RequestChangeAppointmentRequest request) {

                if (request == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Thông tin yêu cầu đổi lịch không được để trống");
                }

                kiemTraKhongRong(request.getLyDo(), "Lý do đổi lịch");

                LichKham lichKham = timLichCuaBenhNhan(maLich, benhNhanId);

                damBaoLichChuaBatDau(lichKham);

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "yêu cầu đổi lịch",
                                DA_TAO,
                                DA_XAC_NHAN);

                lichKham.setTrangThai(YEU_CAU_DOI_LICH);
                lichKham.setLyDoThayDoi(request.getLyDo());

                LichKham lichDaLuu = lichKhamRepository.save(lichKham);

                notificationService.taoThongBao(
                                lichDaLuu.getBenhNhanId(),
                                lichDaLuu.getMaLich(),
                                "Đã tiếp nhận yêu cầu đổi lịch",
                                "Phòng khám đã nhận yêu cầu đổi lịch của bạn. "
                                                + "Lý do: "
                                                + request.getLyDo(),
                                "YEU_CAU_DOI_LICH");

                return chuyenSangResponse(lichDaLuu);
        }

        // Bệnh nhân hủy lịch trước khi buổi khám bắt đầu.
        @Transactional
        public AppointmentResponse huyLich(
                        String maLich,
                        String benhNhanId,
                        CancelAppointmentRequest request) {

                if (request == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Thông tin hủy lịch không được để trống");
                }

                kiemTraKhongRong(request.getLyDo(), "Lý do hủy lịch");

                LichKham lichKham = timLichCuaBenhNhan(maLich, benhNhanId);

                // Hủy lại lịch đã hủy không tạo thêm thay đổi.
                if (DA_HUY.equals(lichKham.getTrangThai())) {
                        return chuyenSangResponse(lichKham);
                }

                damBaoLichChuaBatDau(lichKham);

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "hủy lịch",
                                DA_TAO,
                                DA_XAC_NHAN,
                                YEU_CAU_DOI_LICH);

                lichKham.setTrangThai(DA_HUY);
                lichKham.setLyDoThayDoi(request.getLyDo());

                LichKham lichDaLuu = lichKhamRepository.save(lichKham);

                notificationService.taoThongBao(
                                lichDaLuu.getBenhNhanId(),
                                lichDaLuu.getMaLich(),
                                "Lịch khám đã được hủy",
                                "Lịch khám ngày "
                                                + lichDaLuu.getNgayKham()
                                                + " đã được hủy. Lý do: "
                                                + request.getLyDo(),
                                "HUY_LICH");

                return chuyenSangResponse(lichDaLuu);
        }

        @Transactional
        public AppointmentResponse doiLich(
                        String maLich,
                        RescheduleAppointmentRequest request) {

                if (request == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Thông tin đổi lịch không được để trống");
                }

                kiemTraKhongRong(request.getBacSiId(), "Mã bác sĩ");
                kiemTraKhongRong(request.getPhongId(), "Mã phòng");
                kiemTraKhongRong(request.getLyDo(), "Lý do đổi lịch");

                LichKham lichKham = timLichTheoMa(maLich);

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "xếp lại lịch",
                                DA_TAO,
                                DA_XAC_NHAN,
                                YEU_CAU_DOI_LICH);

                LocalTime gioKetThuc = kiemTraVaTinhGioKetThuc(
                                request.getNgayKham(),
                                request.getGioBatDau(),
                                request.getThoiLuongPhut());

                /*
                 * Bỏ qua chính lịch đang đổi khi kiểm tra trùng.
                 */
                damBaoKhongTrungLich(
                                lichKham.getMaLich(),
                                request.getBacSiId(),
                                request.getPhongId(),
                                request.getNgayKham(),
                                request.getGioBatDau(),
                                gioKetThuc);

                lichKham.setBacSiId(request.getBacSiId());
                lichKham.setPhongId(request.getPhongId());
                lichKham.setNgayKham(request.getNgayKham());
                lichKham.setGioBatDau(request.getGioBatDau());
                lichKham.setGioKetThuc(gioKetThuc);
                lichKham.setLyDoThayDoi(request.getLyDo());
                lichKham.setTrangThai(DA_TAO);

                LichKham lichDaLuu = lichKhamRepository.save(lichKham);

                notificationService.taoThongBao(
                                lichDaLuu.getBenhNhanId(),
                                lichDaLuu.getMaLich(),
                                "Lịch khám đã được thay đổi",
                                "Lịch mới của bạn là "
                                                + lichDaLuu.getGioBatDau()
                                                + " ngày "
                                                + lichDaLuu.getNgayKham()
                                                + ". Vui lòng kiểm tra và xác nhận lại.",
                                "DOI_LICH");

                return chuyenSangResponse(lichDaLuu);
        }

        // Chủ phòng khám đánh dấu bệnh nhân đã đến.
        @Transactional
        public AppointmentResponse danhDauBenhNhanDaDen(
                        String maLich) {

                LichKham lichKham = timLichTheoMa(maLich);

                if (DA_DEN.equals(lichKham.getTrangThai())) {
                        return chuyenSangResponse(lichKham);
                }

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "đánh dấu bệnh nhân đã đến",
                                DA_TAO,
                                DA_XAC_NHAN);

                if (!LocalDate.now().equals(lichKham.getNgayKham())) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Chỉ được đánh dấu đã đến trong đúng ngày khám");
                }

                lichKham.setTrangThai(DA_DEN);

                return chuyenSangResponse(
                                lichKhamRepository.save(lichKham));
        }

        // bd kham
        @Transactional
        public AppointmentResponse batDauKham(
                        String maLich,
                        String bacSiId) {

                LichKham lichKham = timLichCuaBacSi(maLich, bacSiId);

                if (DANG_KHAM.equals(lichKham.getTrangThai())) {
                        return chuyenSangResponse(lichKham);
                }

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "bắt đầu khám",
                                DA_DEN);

                if (!LocalDate.now().equals(lichKham.getNgayKham())) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Chỉ được bắt đầu khám trong đúng ngày đã xếp lịch");
                }

                lichKham.setTrangThai(DANG_KHAM);

                return chuyenSangResponse(
                                lichKhamRepository.save(lichKham));
        }

        // done kham
        @Transactional
        public AppointmentResponse hoanThanhKham(
                        String maLich,
                        String bacSiId) {

                LichKham lichKham = timLichCuaBacSi(maLich, bacSiId);

                if (HOAN_THANH.equals(lichKham.getTrangThai())) {
                        return chuyenSangResponse(lichKham);
                }

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "hoàn thành buổi khám",
                                DANG_KHAM);

                lichKham.setTrangThai(HOAN_THANH);

                LichKham lichDaLuu = lichKhamRepository.save(lichKham);

                notificationService.taoThongBao(
                                lichDaLuu.getBenhNhanId(),
                                lichDaLuu.getMaLich(),
                                "Buổi khám đã hoàn thành",
                                "Buổi khám ngày "
                                                + lichDaLuu.getNgayKham()
                                                + " đã được bác sĩ hoàn thành.",
                                "HOAN_THANH_KHAM");

                return chuyenSangResponse(lichDaLuu);
        }

        // Chủ phòng khám đánh dấu bệnh nhân vắng mặt
        @Transactional
        public AppointmentResponse danhDauVangMat(
                        String maLich) {

                LichKham lichKham = timLichTheoMa(maLich);

                if (VANG_MAT.equals(lichKham.getTrangThai())) {
                        return chuyenSangResponse(lichKham);
                }

                damBaoTrangThaiChoPhep(
                                lichKham,
                                "đánh dấu vắng mặt",
                                DA_TAO,
                                DA_XAC_NHAN);

                LocalDateTime thoiDiemBatDau = LocalDateTime.of(
                                lichKham.getNgayKham(),
                                lichKham.getGioBatDau());

                if (LocalDateTime.now().isBefore(thoiDiemBatDau)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Chưa đến giờ khám nên không thể đánh dấu vắng mặt");
                }

                lichKham.setTrangThai(VANG_MAT);

                LichKham lichDaLuu = lichKhamRepository.save(lichKham);

                notificationService.taoThongBao(
                                lichDaLuu.getBenhNhanId(),
                                lichDaLuu.getMaLich(),
                                "Bạn đã được ghi nhận vắng mặt",
                                "Bạn không có mặt vào lịch khám lúc "
                                                + lichDaLuu.getGioBatDau()
                                                + " ngày "
                                                + lichDaLuu.getNgayKham()
                                                + ".",
                                "VANG_MAT");

                return chuyenSangResponse(lichDaLuu);
        }

        // Chỉ tìm lịch có mã lịch và mã bệnh nhân cùng khớp.
        // Nếu không tìm thấy, trả HTTP 404 cho website.
        private LichKham timLichCuaBenhNhan(
                        String maLich,
                        String benhNhanId) {

                kiemTraKhongRong(maLich, "Mã lịch");
                kiemTraKhongRong(benhNhanId, "Mã bệnh nhân");

                return lichKhamRepository
                                .findByMaLichAndBenhNhanId(maLich, benhNhanId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy lịch khám của bệnh nhân"));
        }

        // Chỉ tìm lịch được phân công cho bác sĩ này.
        // Không tìm thấy lịch phù hợp thì trả HTTP 404.
        private LichKham timLichCuaBacSi(
                        String maLich,
                        String bacSiId) {

                kiemTraKhongRong(maLich, "Mã lịch");
                kiemTraKhongRong(bacSiId, "Mã bác sĩ");

                return lichKhamRepository
                                .findByMaLichAndBacSiId(maLich, bacSiId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy lịch khám được phân công cho bác sĩ"));
        }

        // Chủ phòng khám tìm lịch theo mã.
        private LichKham timLichTheoMa(
                        String maLich) {

                kiemTraKhongRong(maLich, "Mã lịch");

                return lichKhamRepository
                                .findById(maLich)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy lịch khám: " + maLich));
        }

        /*
         * Kiểm tra ngày, giờ và tính giờ kết thúc.
         */
        private LocalTime kiemTraVaTinhGioKetThuc(
                        LocalDate ngayKham,
                        LocalTime gioBatDau,
                        int thoiLuongPhut) {

                if (ngayKham == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ngày khám không được để trống");
                }

                if (gioBatDau == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Giờ bắt đầu không được để trống");
                }

                if (thoiLuongPhut <= 0) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Thời lượng khám phải lớn hơn 0");
                }

                LocalDateTime thoiDiemBatDau = LocalDateTime.of(
                                ngayKham,
                                gioBatDau);

                if (!thoiDiemBatDau.isAfter(LocalDateTime.now())) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Thời điểm khám phải nằm trong tương lai");
                }

                LocalDateTime thoiDiemKetThuc = thoiDiemBatDau.plusMinutes(thoiLuongPhut);

                // Không cho một lịch kéo dài sang ngày hôm sau.
                if (!thoiDiemKetThuc.toLocalDate().equals(ngayKham)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Giờ kết thúc phải sau giờ bắt đầu và trong cùng một ngày");
                }

                return thoiDiemKetThuc.toLocalTime();
        }

        // Kiểm tra bác sĩ và phòng có bị trùng giờ hay không
        private void damBaoKhongTrungLich(
                        String maLichBoQua,
                        String bacSiId,
                        String phongId,
                        LocalDate ngayKham,
                        LocalTime gioBatDauMoi,
                        LocalTime gioKetThucMoi) {

                List<LichKham> lichCuaBacSi = lichKhamRepository
                                .findByBacSiIdAndNgayKhamOrderByGioBatDauAsc(
                                                bacSiId,
                                                ngayKham);

                if (coLichBiTrung(
                                lichCuaBacSi,
                                maLichBoQua,
                                gioBatDauMoi,
                                gioKetThucMoi)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Bác sĩ đã có lịch khác trong khoảng thời gian này");
                }

                List<LichKham> lichCuaPhong = lichKhamRepository
                                .findByPhongIdAndNgayKhamOrderByGioBatDauAsc(
                                                phongId,
                                                ngayKham);

                if (coLichBiTrung(
                                lichCuaPhong,
                                maLichBoQua,
                                gioBatDauMoi,
                                gioKetThucMoi)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Phòng khám đã được sử dụng trong khoảng thời gian này");
                }
        }

        // Kiểm tra trong danh sách có lịch giao nhau hay không.
        private boolean coLichBiTrung(
                        List<LichKham> danhSachLich,
                        String maLichBoQua,
                        LocalTime gioBatDauMoi,
                        LocalTime gioKetThucMoi) {

                for (LichKham lichCu : danhSachLich) {

                        // Khi đổi lịch, bỏ qua chính lịch đang được cập nhật.
                        if (maLichBoQua != null
                                        && maLichBoQua.equals(lichCu.getMaLich())) {
                                continue;
                        }

                        /*
                         * Lịch đã hủy, vắng mặt hoặc hoàn thành
                         * không còn chiếm bác sĩ và phòng.
                         */
                        if (DA_HUY.equals(lichCu.getTrangThai())
                                        || VANG_MAT.equals(lichCu.getTrangThai())
                                        || HOAN_THANH.equals(lichCu.getTrangThai())) {
                                continue;
                        }

                        boolean biTrung = gioBatDauMoi.isBefore(lichCu.getGioKetThuc())
                                        && gioKetThucMoi.isAfter(lichCu.getGioBatDau());

                        if (biTrung) {
                                return true;
                        }
                }

                return false;
        }

        // Không cho bệnh nhân xác nhận, đổi hoặc hủy

        private void damBaoLichChuaBatDau(
                        LichKham lichKham) {

                LocalDateTime thoiDiemBatDau = LocalDateTime.of(
                                lichKham.getNgayKham(),
                                lichKham.getGioBatDau());

                if (!LocalDateTime.now().isBefore(thoiDiemBatDau)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Buổi khám đã đến giờ hoặc đã bắt đầu");
                }
        }

        private void damBaoTrangThaiChoPhep(
                        LichKham lichKham,
                        String hanhDong,
                        String... cacTrangThaiChoPhep) {

                for (String trangThai : cacTrangThaiChoPhep) {
                        if (trangThai.equals(lichKham.getTrangThai())) {
                                return;
                        }
                }

                throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Không thể "
                                                + hanhDong
                                                + " khi lịch đang ở trạng thái "
                                                + lichKham.getTrangThai());
        }

        // Chuyển Entity thành DTO trả về cho website.

        private AppointmentResponse chuyenSangResponse(
                        LichKham lichKham) {

                AppointmentResponse response = new AppointmentResponse();

                response.setMaLich(lichKham.getMaLich());
                response.setMaBenhNhan(lichKham.getBenhNhanId());

                /*
                 * Tên bệnh nhân, bác sĩ và phòng sẽ được bổ sung
                 * khi ghép Entity của người thứ 1 và người thứ 2.
                 */
                response.setTenBenhNhan(null);

                response.setMaBacSi(lichKham.getBacSiId());
                response.setTenBacSi(null);

                response.setMaPhong(lichKham.getPhongId());
                response.setTenPhong(null);

                response.setNgayKham(lichKham.getNgayKham());
                response.setGioBatDau(lichKham.getGioBatDau());
                response.setGioKetThuc(lichKham.getGioKetThuc());
                response.setLyDoKham(lichKham.getLyDoKham());
                response.setTrangThai(lichKham.getTrangThai());
                response.setLyDoThayDoi(lichKham.getLyDoThayDoi());
                response.setThoiGianTao(lichKham.getThoiGianTao());

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