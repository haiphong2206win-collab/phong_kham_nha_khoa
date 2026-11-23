
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoLoTrinhDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.LichBuoiDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiDieuTriResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LoTrinhDieuTriResponse;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiMau;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhMau;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.PhongKham;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiLoTrinh;
import com.example.clinic.demo_phongkham_nhakhoa.enums.LoaiThongBao;

import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiMauRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhMauRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional(readOnly = true)
public class LoTrinhDieuTriService {

        private static final Set<TrangThaiDatLich> TRANG_THAI_DANG_PHU_TRACH = Set.of(
                        TrangThaiDatLich.CHO_BENH_NHAN_XAC_NHAN,
                        TrangThaiDatLich.DA_XAC_NHAN,
                        TrangThaiDatLich.DA_DEN,
                        TrangThaiDatLich.DANG_KHAM,
                        TrangThaiDatLich.HOAN_THANH);

        private final LoTrinhDieuTriRepository loTrinhDieuTriRepository;
        private final BuoiDieuTriRepository buoiDieuTriRepository;
        private final BenhNhanRepository benhNhanRepository;
        private final LoTrinhMauRepository loTrinhMauRepository;
        private final BuoiMauRepository buoiMauRepository;
        private final LichKhamRepository lichKhamRepository;
        private final ThongBaoService thongBaoService;

        // Constructor Dependency Injection
        public LoTrinhDieuTriService(
                        LoTrinhDieuTriRepository loTrinhDieuTriRepository,
                        BuoiDieuTriRepository buoiDieuTriRepository,
                        BenhNhanRepository benhNhanRepository,
                        LoTrinhMauRepository loTrinhMauRepository,
                        BuoiMauRepository buoiMauRepository,
                        LichKhamRepository lichKhamRepository,
                        ThongBaoService thongBaoService) {

                this.loTrinhDieuTriRepository = loTrinhDieuTriRepository;
                this.buoiDieuTriRepository = buoiDieuTriRepository;
                this.benhNhanRepository = benhNhanRepository;
                this.loTrinhMauRepository = loTrinhMauRepository;
                this.buoiMauRepository = buoiMauRepository;
                this.lichKhamRepository = lichKhamRepository;
                this.thongBaoService = thongBaoService;
        }

        // ==================================================
        // KIEM TRA QUYEN TRUY CAP CUA BAC SI / CHU PHONG KHAM
        // ==================================================

        public void kiemTraQuyenTruyCapBenhNhan(String maBenhNhan) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null
                                || !authentication.isAuthenticated()
                                || "anonymousUser".equals(authentication.getPrincipal())) {
                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Nguoi dung chua dang nhap");
                }

                boolean laChuPhongKham = authentication.getAuthorities().stream()
                                .anyMatch(quyen -> "ROLE_CHU_PHONG_KHAM".equals(quyen.getAuthority()));
                if (laChuPhongKham) {
                        return;
                }

                boolean laBacSi = authentication.getAuthorities().stream()
                                .anyMatch(quyen -> "ROLE_BAC_SI".equals(quyen.getAuthority()));
                if (!laBacSi) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Khong co quyen quan ly lo trinh dieu tri");
                }

                String tenDangNhap = authentication.getName();
                boolean dangPhuTrach = lichKhamRepository
                                .existsByBacSi_TaiKhoan_TenDangNhapAndBenhNhan_MaBenhNhanAndTrangThaiIn(
                                                tenDangNhap,
                                                maBenhNhan,
                                                TRANG_THAI_DANG_PHU_TRACH);

                if (!dangPhuTrach) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Bac si khong co quyen thao tac tren lo trinh dieu tri cua benh nhan nay");
                }
        }

        // 1. TAO LO TRINH RIENG CHO BENH NHAN

        @Transactional
        public LoTrinhDieuTriResponse taoLoTrinhDieuTri(
                        TaoLoTrinhDieuTriRequest request) {

                if (request == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Du lieu tao lo trinh khong hop le");
                }

                // Kiem tra ma benh nhan
                String maBenhNhan = request.getMaBenhNhan();

                if (maBenhNhan == null || maBenhNhan.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ma benh nhan khong duoc de trong");
                }

                maBenhNhan = maBenhNhan.trim();
                kiemTraQuyenTruyCapBenhNhan(maBenhNhan);

                // Kiem tra ma lo trinh mau
                String maLoTrinhMau = request.getMaLoTrinhMau();

                if (maLoTrinhMau == null || maLoTrinhMau.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ma lo trinh mau khong duoc de trong");
                }

                maLoTrinhMau = maLoTrinhMau.trim();

                // Tim benh nhan co san trong MySQL
                BenhNhan benhNhan = benhNhanRepository
                                .findById(maBenhNhan)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Khong tim thay benh nhan"));

                // Tim lo trinh mau co san
                LoTrinhMau loTrinhMau = loTrinhMauRepository
                                .findById(maLoTrinhMau)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Khong tim thay lo trinh mau"));

                // Lay danh sach buoi mau theo thu tu
                List<BuoiMau> danhSachBuoiMau = buoiMauRepository
                                .findByLoTrinhMau_MaLoTrinhOrderBySoThuTuAsc(
                                                maLoTrinhMau);

                // Khong tao lo trinh neu mau chua du buoi
                if (danhSachBuoiMau.isEmpty()
                                || danhSachBuoiMau.size() != loTrinhMau.getTongSoBuoi()) {

                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Du lieu buoi mau chua day du");
                }

                // Xac dinh ten lo trinh
                String tenLoTrinh = request.getTenLoTrinh();

                if (tenLoTrinh == null || tenLoTrinh.isBlank()) {
                        tenLoTrinh = loTrinhMau.getTenLoTrinh();
                } else {
                        tenLoTrinh = tenLoTrinh.trim();
                }

                if (tenLoTrinh.length() > 200) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ten lo trinh vuot qua 200 ky tu");
                }

                String ghiChu = request.getGhiChu();

                if (ghiChu != null) {
                        ghiChu = ghiChu.trim();
                }

                if (ghiChu != null && ghiChu.length() > 2000) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ghi chu vuot qua 2000 ky tu");
                }

                // Tao lo trinh rieng
                LoTrinhDieuTri loTrinhMoi = new LoTrinhDieuTri(
                                benhNhan,
                                loTrinhMau,
                                tenLoTrinh,
                                ghiChu);

                // Luu va sinh ma UUID
                loTrinhMoi = loTrinhDieuTriRepository.saveAndFlush(
                                loTrinhMoi);

                // Sao chep tung buoi mau thanh buoi rieng
                List<BuoiDieuTri> danhSachBuoiMoi = new ArrayList<>();

                for (BuoiMau buoiMau : danhSachBuoiMau) {

                        BuoiDieuTri buoiMoi = new BuoiDieuTri(
                                        loTrinhMoi,
                                        buoiMau.getSoThuTu(),
                                        buoiMau.getTenBuoi(),
                                        buoiMau.getNoiDung(),
                                        buoiMau.getKhoangCachMin(),
                                        buoiMau.getKhoangCachMax(),
                                        buoiMau.getGhiChu(),
                                        false);

                        danhSachBuoiMoi.add(buoiMoi);
                }

                // Luu tat ca buoi trong cung transaction
                buoiDieuTriRepository.saveAll(
                                danhSachBuoiMoi);

                buoiDieuTriRepository.flush();

                if (laBacSiDangNhap() || request.getMaLichKhamBanDau() != null) {
                        lapLichChoToanBoLoTrinh(
                                        request,
                                        loTrinhMoi,
                                        danhSachBuoiMoi);
                }

                // Tra ve lo trinh vua tao
                return chuyenSangResponse(loTrinhMoi);
        }

        private void lapLichChoToanBoLoTrinh(
                        TaoLoTrinhDieuTriRequest request,
                        LoTrinhDieuTri loTrinh,
                        List<BuoiDieuTri> danhSachBuoi) {

                if (request.getMaLichKhamBanDau() == null
                                || request.getMaLichKhamBanDau().isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Bác sĩ phải chọn ca khám đầu tiên đã hoàn thành");
                }

                LichKham lichBanDau = lichKhamRepository
                                .findById(request.getMaLichKhamBanDau().trim())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy lịch khám ban đầu"));

                if (lichBanDau.getTrangThai() != TrangThaiDatLich.HOAN_THANH) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Chỉ được lập lộ trình sau khi hoàn thành buổi khám đầu tiên");
                }

                if (!lichBanDau.getBenhNhan().getMaBenhNhan()
                                .equals(loTrinh.getBenhNhan().getMaBenhNhan())) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Lịch khám ban đầu không thuộc bệnh nhân của lộ trình");
                }

                if (buoiDieuTriRepository.existsByLichKham_MaLich(lichBanDau.getMaLich())) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Lịch khám ban đầu đã thuộc một lộ trình điều trị khác");
                }

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (laBacSiDangNhap()
                                && !lichBanDau.getBacSi().getTaiKhoan().getTenDangNhap()
                                                .equals(authentication.getName())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Bác sĩ chỉ được lập lịch trình từ ca khám do mình phụ trách");
                }

                Map<Integer, BuoiDieuTri> buoiTheoThuTu = new HashMap<>();
                for (BuoiDieuTri buoi : danhSachBuoi) {
                        buoiTheoThuTu.put(buoi.getSoThuTu(), buoi);
                }

                BuoiDieuTri buoiDau = buoiTheoThuTu.get(1);
                if (buoiDau == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Phác đồ mẫu không có buổi điều trị đầu tiên");
                }
                buoiDau.ganLichKhamBanDauDaHoanThanh(lichBanDau);
                buoiDieuTriRepository.save(buoiDau);
                loTrinh.doiTrangThai(TrangThaiLoTrinh.DANG_DIEU_TRI);
                loTrinhDieuTriRepository.save(loTrinh);

                List<LichBuoiDieuTriRequest> lichTiepTheo = request.getLichCacBuoiTiepTheo();
                int soLichCanTao = Math.max(0, danhSachBuoi.size() - 1);
                if (lichTiepTheo == null || lichTiepTheo.size() != soLichCanTao) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Phải nhập ngày giờ chính xác cho đủ " + soLichCanTao + " buổi tiếp theo");
                }

                List<LichBuoiDieuTriRequest> lichDaSapXep = new ArrayList<>(lichTiepTheo);
                lichDaSapXep.sort(Comparator.comparingInt(LichBuoiDieuTriRequest::getSoThuTu));

                BacSi bacSi = lichBanDau.getBacSi();
                PhongKham phongKham = lichBanDau.getPhongKham();
                LocalDateTime mocThoiGianTruoc = LocalDateTime.of(
                                lichBanDau.getNgayKham(), lichBanDau.getGioKetThuc());
                LichKham lichTiepTheoDauTien = null;

                for (int index = 0; index < lichDaSapXep.size(); index++) {
                        LichBuoiDieuTriRequest lichRequest = lichDaSapXep.get(index);
                        int soThuTuMongDoi = index + 2;

                        if (lichRequest.getSoThuTu() == null
                                        || lichRequest.getSoThuTu() != soThuTuMongDoi
                                        || !buoiTheoThuTu.containsKey(soThuTuMongDoi)) {
                                throw new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "Lịch các buổi tiếp theo phải đủ và đúng thứ tự từ buổi 2");
                        }

                        LocalDateTime batDau = LocalDateTime.of(
                                        lichRequest.getNgayKham(), lichRequest.getGioBatDau());
                        LocalDateTime ketThuc = batDau.plusMinutes(lichRequest.getThoiLuongPhut());

                        if (!ketThuc.toLocalDate().equals(batDau.toLocalDate())) {
                                throw new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "Buổi " + soThuTuMongDoi + " phải kết thúc trong cùng ngày");
                        }
                        if (!batDau.isAfter(mocThoiGianTruoc)) {
                                throw new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "Ngày giờ buổi " + soThuTuMongDoi
                                                                + " phải sau buổi trước đó");
                        }
                        if (!batDau.isAfter(LocalDateTime.now())) {
                                throw new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "Ngày giờ các buổi tiếp theo phải ở tương lai");
                        }

                        kiemTraKhongTrungLich(
                                        bacSi,
                                        phongKham,
                                        loTrinh.getBenhNhan().getMaBenhNhan(),
                                        batDau,
                                        ketThuc,
                                        soThuTuMongDoi);

                        BuoiDieuTri buoi = buoiTheoThuTu.get(soThuTuMongDoi);
                        LichKham lichMoi = new LichKham();
                        lichMoi.setBenhNhan(loTrinh.getBenhNhan());
                        lichMoi.setBacSi(bacSi);
                        lichMoi.setPhongKham(phongKham);
                        lichMoi.setNgayKham(batDau.toLocalDate());
                        lichMoi.setGioBatDau(batDau.toLocalTime());
                        lichMoi.setGioKetThuc(ketThuc.toLocalTime());
                        lichMoi.setLyDoKham("Điều trị theo lộ trình " + loTrinh.getTenLoTrinh()
                                        + " - Buổi " + soThuTuMongDoi + ": " + buoi.getTenBuoi());
                        lichMoi.setTrangThai(TrangThaiDatLich.DA_XAC_NHAN);

                        lichMoi = lichKhamRepository.saveAndFlush(lichMoi);
                        buoi.ganLichKham(lichMoi);
                        buoiDieuTriRepository.save(buoi);

                        if (lichTiepTheoDauTien == null) {
                                lichTiepTheoDauTien = lichMoi;
                        }
                        mocThoiGianTruoc = ketThuc;
                }

                String noiDungThongBao = "Bác sĩ " + bacSi.getHoTen()
                                + " đã tạo lộ trình \"" + loTrinh.getTenLoTrinh() + "\" gồm "
                                + danhSachBuoi.size() + " buổi.";
                if (lichTiepTheoDauTien != null) {
                        noiDungThongBao += " Lịch tiếp theo: "
                                        + lichTiepTheoDauTien.getNgayKham()
                                                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                                        + " lúc " + lichTiepTheoDauTien.getGioBatDau();
                }
                noiDungThongBao += " Vui lòng xem chi tiết trong Lộ trình điều trị và Lịch khám của tôi.";

                thongBaoService.taoThongBao(
                                loTrinh.getBenhNhan().getTaiKhoan(),
                                lichTiepTheoDauTien != null ? lichTiepTheoDauTien : lichBanDau,
                                LoaiThongBao.LICH_DA_TAO,
                                "Bác sĩ đã lập lộ trình điều trị",
                                noiDungThongBao);
        }

        private void kiemTraKhongTrungLich(
                        BacSi bacSi,
                        PhongKham phongKham,
                        String maBenhNhan,
                        LocalDateTime batDau,
                        LocalDateTime ketThuc,
                        int soThuTu) {

                if (!bacSi.dangHoatDong()) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Bác sĩ đang ngừng hoạt động");
                }
                if (!phongKham.coTheXepLich()) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Phòng khám không sẵn sàng");
                }

                if (coLichGiaoNhau(lichKhamRepository.findByBacSiAndNgayKham(
                                bacSi, batDau.toLocalDate()), batDau, ketThuc)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Buổi " + soThuTu + " bị trùng lịch của bác sĩ");
                }
                if (coLichGiaoNhau(lichKhamRepository.findByPhongKhamAndNgayKham(
                                phongKham, batDau.toLocalDate()), batDau, ketThuc)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Buổi " + soThuTu + " bị trùng lịch phòng khám");
                }
                if (coLichGiaoNhau(lichKhamRepository.findByBenhNhan_MaBenhNhanAndNgayKham(
                                maBenhNhan, batDau.toLocalDate()), batDau, ketThuc)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Buổi " + soThuTu + " bị trùng lịch của bệnh nhân");
                }
        }

        private boolean coLichGiaoNhau(
                        List<LichKham> danhSach,
                        LocalDateTime batDau,
                        LocalDateTime ketThuc) {
                return danhSach.stream()
                                .filter(lich -> lich.getTrangThai() != TrangThaiDatLich.DA_HUY)
                                .anyMatch(lich -> batDau.isBefore(LocalDateTime.of(
                                                lich.getNgayKham(), lich.getGioKetThuc()))
                                                && ketThuc.isAfter(LocalDateTime.of(
                                                                lich.getNgayKham(), lich.getGioBatDau())));
        }

        private boolean laBacSiDangNhap() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                return authentication != null && authentication.getAuthorities().stream()
                                .anyMatch(quyen -> "ROLE_BAC_SI".equals(quyen.getAuthority()));
        }

        // 2. LAY THONG TIN LO TRINH THEO MA

        public LoTrinhDieuTriResponse layLoTrinhTheoMa(
                        String maLoTrinhDieuTri) {

                LoTrinhDieuTri loTrinh = timLoTrinhTheoMa(maLoTrinhDieuTri);
                kiemTraQuyenTruyCapBenhNhan(loTrinh.getBenhNhan().getMaBenhNhan());

                return chuyenSangResponse(loTrinh);
        }

        // 3. LAY DANH SACH LO TRINH CUA BENH NHAN

        public List<LoTrinhDieuTriResponse> layLoTrinhTheoBenhNhan(String maBenhNhan) {

                if (maBenhNhan == null || maBenhNhan.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ma benh nhan khong duoc de trong");
                }

                maBenhNhan = maBenhNhan.trim();
                kiemTraQuyenTruyCapBenhNhan(maBenhNhan);

                if (!benhNhanRepository.existsById(maBenhNhan)) {
                        throw new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Khong tim thay benh nhan");
                }

                List<LoTrinhDieuTri> danhSach = loTrinhDieuTriRepository
                                .findByBenhNhan_MaBenhNhanOrderByThoiGianTaoDesc(
                                                maBenhNhan);

                return danhSach.stream()
                                .map(this::chuyenSangResponse)
                                .toList();
        }

        // 4. LAY DANH SACH BUOI CUA MOT LO TRINH

        public List<BuoiDieuTriResponse> layDanhSachBuoi(
                        String maLoTrinhDieuTri) {

                LoTrinhDieuTri loTrinh = timLoTrinhTheoMa(maLoTrinhDieuTri);
                kiemTraQuyenTruyCapBenhNhan(loTrinh.getBenhNhan().getMaBenhNhan());

                List<BuoiDieuTri> danhSachBuoi = buoiDieuTriRepository
                                .findByLoTrinhDieuTri_MaLoTrinhDieuTriOrderBySoThuTuAsc(
                                                loTrinh.getMaLoTrinhDieuTri());

                return danhSachBuoi.stream()
                                .map(this::chuyenBuoiSangResponse)
                                .toList();
        }

        // 5. TIM LO TRINH, BAO LOI NEU KHONG TON TAI

        private LoTrinhDieuTri timLoTrinhTheoMa(
                        String maLoTrinhDieuTri) {

                if (maLoTrinhDieuTri == null
                                || maLoTrinhDieuTri.isBlank()) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ma lo trinh khong duoc de trong");
                }

                return loTrinhDieuTriRepository
                                .findById(maLoTrinhDieuTri.trim())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Khong tim thay lo trinh dieu tri"));
        }

        // 6. CHUYEN ENTITY LO TRINH SANG RESPONSE

        private LoTrinhDieuTriResponse chuyenSangResponse(
                        LoTrinhDieuTri loTrinh) {

                String maLoTrinh = loTrinh.getMaLoTrinhDieuTri();

                // Dem tat ca buoi ke ca buoi da bo
                long tongBanGhi = buoiDieuTriRepository
                                .countByLoTrinhDieuTri_MaLoTrinhDieuTri(
                                                maLoTrinh);

                // Dem so buoi da bo
                long soBuoiDaBo = buoiDieuTriRepository
                                .countByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThai(
                                                maLoTrinh,
                                                TrangThaiBuoiDieuTri.DA_BO);

                // Dem so buoi hoan thanh
                long soBuoiHoanThanh = buoiDieuTriRepository
                                .countByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThai(
                                                maLoTrinh,
                                                TrangThaiBuoiDieuTri.HOAN_THANH);

                // Tong buoi dang ap dung
                long tongSoBuoi = tongBanGhi - soBuoiDaBo;

                return new LoTrinhDieuTriResponse(
                                loTrinh.getMaLoTrinhDieuTri(),
                                loTrinh.getBenhNhan().getMaBenhNhan(),
                                loTrinh.getLoTrinhMau().getMaLoTrinh(),
                                loTrinh.getTenLoTrinh(),
                                loTrinh.getGhiChu(),
                                loTrinh.getTrangThai(),
                                tongSoBuoi,
                                soBuoiHoanThanh,
                                soBuoiDaBo,
                                loTrinh.getThoiGianTao(),
                                loTrinh.getThoiGianCapNhat(),
                                loTrinh.getVersion());
        }

        // 7. CHUYEN ENTITY BUOI SANG RESPONSE
        // GIAI DOAN 3 - BO SUNG MA LICH KHAM

        private BuoiDieuTriResponse chuyenBuoiSangResponse(
                        BuoiDieuTri buoi) {

                String maLichKham = null;

                if (buoi.getLichKham() != null) {
                        maLichKham = buoi.getLichKham().getMaLich();
                }

                return new BuoiDieuTriResponse(
                                buoi.getMaBuoiDieuTri(),
                                buoi.getLoTrinhDieuTri()
                                                .getMaLoTrinhDieuTri(),
                                buoi.getSoThuTu(),
                                buoi.getTenBuoi(),
                                buoi.getNoiDung(),
                                buoi.getKhoangCachMin(),
                                buoi.getKhoangCachMax(),
                                buoi.getGhiChu(),
                                buoi.getTrangThai(),
                                buoi.isBuoiBoSung(),
                                buoi.getLyDoBo(),
                                buoi.getThoiGianTao(),
                                buoi.getThoiGianCapNhat(),
                                buoi.getVersion(),
                                maLichKham,
                                buoi.getLichKham() != null ? buoi.getLichKham().getNgayKham() : null,
                                buoi.getLichKham() != null ? buoi.getLichKham().getGioBatDau() : null,
                                buoi.getLichKham() != null ? buoi.getLichKham().getGioKetThuc() : null,
                                buoi.getLichKham() != null ? buoi.getLichKham().getBacSi().getHoTen() : null,
                                buoi.getLichKham() != null ? buoi.getLichKham().getPhongKham().getTenPhong() : null);
        }
}
