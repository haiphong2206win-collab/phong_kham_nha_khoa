
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatBuoiDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThemBuoiDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiDieuTriResponse;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.CaLamViec;

import com.example.clinic.demo_phongkham_nhakhoa.enums.LoaiThongBao;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiLoTrinh;

import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@Transactional(readOnly = true)
public class BuoiDieuTriService {

        private final BuoiDieuTriRepository buoiDieuTriRepository;
        private final LoTrinhDieuTriRepository loTrinhDieuTriRepository;
        private final LoTrinhDieuTriService loTrinhDieuTriService;
        private final LichKhamRepository lichKhamRepository;
        private final ThongBaoService thongBaoService;

        private static final ZoneId MUI_GIO_VIET_NAM = ZoneId.of("Asia/Ho_Chi_Minh");
        private static final DateTimeFormatter DINH_DANG_NGAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        public BuoiDieuTriService(
                        BuoiDieuTriRepository buoiDieuTriRepository,
                        LoTrinhDieuTriRepository loTrinhDieuTriRepository,
                        LoTrinhDieuTriService loTrinhDieuTriService,
                        LichKhamRepository lichKhamRepository,
                        ThongBaoService thongBaoService) {

                this.buoiDieuTriRepository = buoiDieuTriRepository;
                this.loTrinhDieuTriRepository = loTrinhDieuTriRepository;
                this.loTrinhDieuTriService = loTrinhDieuTriService;
                this.lichKhamRepository = lichKhamRepository;
                this.thongBaoService = thongBaoService;
        }

        // ==================================================
        // 1. THEM BUOI DIEU TRI
        // ==================================================

        @Transactional
        public BuoiDieuTriResponse themBuoi(
                        String maLoTrinhDieuTri,
                        ThemBuoiDieuTriRequest request) {

                LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

                loTrinhDieuTriService.kiemTraQuyenTruyCapBenhNhan(
                                loTrinh.getBenhNhan().getMaBenhNhan());

                kiemTraLoTrinhChoPhepChinhSua(loTrinh);

                if (request == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Du lieu them buoi khong hop le");
                }

                if (request.getSoThuTu() == null
                                || request.getSoThuTu() < 1) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "So thu tu phai lon hon 0");
                }

                kiemTraThongTinBuoi(
                                request.getTenBuoi(),
                                request.getNoiDung(),
                                request.getKhoangCachMin(),
                                request.getKhoangCachMax(),
                                request.getGhiChu());

                List<BuoiDieuTri> danhSach = buoiDieuTriRepository
                                .findByLoTrinhDieuTri_MaLoTrinhDieuTriOrderBySoThuTuAsc(
                                                loTrinh.getMaLoTrinhDieuTri());

                int viTriChen = request.getSoThuTu();

                // Lay thu tu lon nhat, bao gom ca buoi da bo.
                int thuTuLonNhat = danhSach.stream()
                                .mapToInt(BuoiDieuTri::getSoThuTu)
                                .max()
                                .orElse(0);

                if (viTriChen > thuTuLonNhat + 1) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Vi tri chen vuot qua danh sach buoi hien tai");
                }

                // Neu chen vao giua, cac buoi phia sau
                // can duoc doi thu tu.
                List<BuoiDieuTri> cacBuoiCanDich = new ArrayList<>();

                for (BuoiDieuTri buoi : danhSach) {

                        if (buoi.getSoThuTu() >= viTriChen) {

                                // Chi cho phep dich buoi chua len lich.
                                // Khong thay doi lich su hay lich hen.
                                if (buoi.getTrangThai() != TrangThaiBuoiDieuTri.CHUA_LEN_LICH) {

                                        throw new ResponseStatusException(
                                                        HttpStatus.CONFLICT,
                                                        "Khong the chen tai vi tri nay vi "
                                                                        + "co buoi da len lich, da thuc hien "
                                                                        + "hoac da thay doi trang thai");
                                }

                                cacBuoiCanDich.add(buoi);
                        }
                }

                // Dich tu cuoi ve dau de giu thu tu ro rang.
                cacBuoiCanDich.sort(
                                Comparator.comparingInt(
                                                BuoiDieuTri::getSoThuTu).reversed());

                for (BuoiDieuTri buoi : cacBuoiCanDich) {
                        buoi.capNhatSoThuTu(
                                        buoi.getSoThuTu() + 1);
                }

                // Tao buoi rieng, danh dau la buoi bo sung.
                BuoiDieuTri buoiMoi = new BuoiDieuTri(
                                loTrinh,
                                viTriChen,
                                request.getTenBuoi().trim(),
                                request.getNoiDung().trim(),
                                request.getKhoangCachMin(),
                                request.getKhoangCachMax(),
                                chuanHoaGhiChu(request.getGhiChu()),
                                true);

                // Luu thu tu moi va buoi moi trong 1 transaction.
                buoiDieuTriRepository.saveAll(cacBuoiCanDich);

                buoiMoi = buoiDieuTriRepository.save(buoiMoi);

                buoiDieuTriRepository.flush();

                return chuyenSangResponse(buoiMoi);
        }

        // ==================================================
        // 2. CAP NHAT THONG TIN VA LICH HEN CUA MOT BUOI SAP TOI
        // ==================================================

        @Transactional
        public BuoiDieuTriResponse capNhatBuoi(
                        String maLoTrinhDieuTri,
                        String maBuoiDieuTri,
                        CapNhatBuoiDieuTriRequest request) {

                LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

                loTrinhDieuTriService.kiemTraQuyenTruyCapBenhNhan(
                                loTrinh.getBenhNhan().getMaBenhNhan());

                kiemTraLoTrinhChoPhepChinhSua(loTrinh);

                BuoiDieuTri buoi = timBuoiThuocLoTrinh(
                                loTrinh,
                                maBuoiDieuTri);

                if (request == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Du lieu cap nhat khong hop le");
                }

                kiemTraThongTinBuoi(
                                request.getTenBuoi(),
                                request.getNoiDung(),
                                request.getKhoangCachMin(),
                                request.getKhoangCachMax(),
                                request.getGhiChu());

                boolean chuaLenLich = buoi.getTrangThai() == TrangThaiBuoiDieuTri.CHUA_LEN_LICH;
                boolean daLenLich = buoi.getTrangThai() == TrangThaiBuoiDieuTri.DA_LEN_LICH;

                if (!chuaLenLich && !daLenLich) {

                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Chi duoc sua buoi chua len lich hoac buoi da len lich trong tuong lai");
                }

                LichKham lichKham = buoi.getLichKham();
                if (daLenLich) {
                        kiemTraVaCapNhatLichTuongLai(lichKham, request);
                } else if (request.getNgayKham() != null
                                || request.getGioBatDau() != null
                                || request.getThoiLuongPhut() != null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Buoi chua len lich khong the cap nhat ngay gio tai API nay");
                }

                buoi.capNhatThongTin(
                                request.getTenBuoi().trim(),
                                request.getNoiDung().trim(),
                                request.getKhoangCachMin(),
                                request.getKhoangCachMax(),
                                chuanHoaGhiChu(request.getGhiChu()));

                buoi = buoiDieuTriRepository.saveAndFlush(buoi);

                taoThongBaoCapNhat(loTrinh, buoi, lichKham);

                return chuyenSangResponse(buoi);
        }

        private void kiemTraVaCapNhatLichTuongLai(
                        LichKham lichKham,
                        CapNhatBuoiDieuTriRequest request) {

                if (lichKham == null) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Buoi dieu tri khong co lich kham");
                }

                LocalDateTime lichHienTai = LocalDateTime.of(
                                lichKham.getNgayKham(), lichKham.getGioBatDau());
                LocalDateTime hienTai = LocalDateTime.now(MUI_GIO_VIET_NAM);
                if (!lichHienTai.isAfter(hienTai)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Chi duoc sua buoi dieu tri sap toi");
                }

                if (lichKham.getTrangThai() != TrangThaiDatLich.DA_XAC_NHAN
                                && lichKham.getTrangThai() != TrangThaiDatLich.CHO_BENH_NHAN_XAC_NHAN
                                && lichKham.getTrangThai() != TrangThaiDatLich.YEU_CAU_THAY_DOI) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Trang thai lich kham khong cho phep chinh sua");
                }

                boolean coTruongLich = request.getNgayKham() != null
                                || request.getGioBatDau() != null
                                || request.getThoiLuongPhut() != null;
                if (!coTruongLich) {
                        return;
                }
                if (request.getNgayKham() == null
                                || request.getGioBatDau() == null
                                || request.getThoiLuongPhut() == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Phai gui day du ngay kham, gio bat dau va thoi luong");
                }
                if (request.getThoiLuongPhut() > 480) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thoi luong kham khong duoc qua 480 phut");
                }

                LocalDateTime batDauMoi = LocalDateTime.of(request.getNgayKham(), request.getGioBatDau());
                LocalDateTime ketThucMoi = batDauMoi.plusMinutes(request.getThoiLuongPhut());
                if (!batDauMoi.isAfter(hienTai)) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lich kham moi phai nam trong tuong lai");
                }
                if (!batDauMoi.toLocalDate().equals(ketThucMoi.toLocalDate())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lich kham phai bat dau va ket thuc trong cung mot ngay");
                }

                boolean trongCaLamViec = lichKham.getBacSi().getDanhSachCaLam().stream()
                                .filter(CaLamViec::isDangHoatDong)
                                .filter(ca -> ca.getNgayLamViec().equals(batDauMoi.toLocalDate()))
                                .anyMatch(ca -> ca.chuaThoiGian(batDauMoi.toLocalTime(), ketThucMoi.toLocalTime()));
                if (!trongCaLamViec) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Thoi gian moi nam ngoai ca lam viec cua bac si");
                }

                kiemTraKhongTrungLich(lichKham, batDauMoi, ketThucMoi);

                lichKham.setNgayKham(batDauMoi.toLocalDate());
                lichKham.setGioBatDau(batDauMoi.toLocalTime());
                lichKham.setGioKetThuc(ketThucMoi.toLocalTime());
                lichKhamRepository.saveAndFlush(lichKham);
        }

        private void kiemTraKhongTrungLich(
                        LichKham lichHienTai,
                        LocalDateTime batDauMoi,
                        LocalDateTime ketThucMoi) {

                if (coLichGiaoNhau(lichKhamRepository.findByBacSiAndNgayKham(
                                lichHienTai.getBacSi(), batDauMoi.toLocalDate()), lichHienTai, batDauMoi, ketThucMoi)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Thoi gian moi bi trung lich cua bac si");
                }
                if (coLichGiaoNhau(lichKhamRepository.findByPhongKhamAndNgayKham(
                                lichHienTai.getPhongKham(), batDauMoi.toLocalDate()), lichHienTai, batDauMoi, ketThucMoi)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Thoi gian moi bi trung lich phong kham");
                }
                if (coLichGiaoNhau(lichKhamRepository.findByBenhNhan_MaBenhNhanAndNgayKham(
                                lichHienTai.getBenhNhan().getMaBenhNhan(), batDauMoi.toLocalDate()),
                                lichHienTai, batDauMoi, ketThucMoi)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Thoi gian moi bi trung lich cua benh nhan");
                }
        }

        private boolean coLichGiaoNhau(
                        List<LichKham> danhSach,
                        LichKham lichHienTai,
                        LocalDateTime batDauMoi,
                        LocalDateTime ketThucMoi) {
                return danhSach.stream()
                                .filter(lich -> !lich.getMaLich().equals(lichHienTai.getMaLich()))
                                .filter(lich -> lich.getTrangThai() != TrangThaiDatLich.DA_HUY)
                                .anyMatch(lich -> batDauMoi.isBefore(LocalDateTime.of(
                                                lich.getNgayKham(), lich.getGioKetThuc()))
                                                && ketThucMoi.isAfter(LocalDateTime.of(
                                                                lich.getNgayKham(), lich.getGioBatDau())));
        }

        private void taoThongBaoCapNhat(
                        LoTrinhDieuTri loTrinh,
                        BuoiDieuTri buoi,
                        LichKham lichKham) {

                String noiDung = "Buổi " + buoi.getSoThuTu() + " - " + buoi.getTenBuoi()
                                + " trong lộ trình \"" + loTrinh.getTenLoTrinh() + "\" đã được cập nhật.";
                if (lichKham != null) {
                        noiDung += " Lịch mới: " + lichKham.getNgayKham().format(DINH_DANG_NGAY)
                                        + " lúc " + lichKham.getGioBatDau() + "-" + lichKham.getGioKetThuc() + ".";
                }
                noiDung += " Vui lòng kiểm tra lại chi tiết lịch điều trị.";

                thongBaoService.taoThongBao(
                                loTrinh.getBenhNhan().getTaiKhoan(),
                                lichKham,
                                LoaiThongBao.LICH_DA_CAP_NHAT,
                                "Buổi điều trị đã được cập nhật",
                                noiDung);
        }

        // ==================================================
        // 3. BO BUOI - KHONG XOA BAN GHI
        // ==================================================

        @Transactional
        public BuoiDieuTriResponse boBuoi(
                        String maLoTrinhDieuTri,
                        String maBuoiDieuTri,
                        String lyDoBo) {

                LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

                loTrinhDieuTriService.kiemTraQuyenTruyCapBenhNhan(
                                loTrinh.getBenhNhan().getMaBenhNhan());

                kiemTraLoTrinhChoPhepChinhSua(loTrinh);

                BuoiDieuTri buoi = timBuoiThuocLoTrinh(
                                loTrinh,
                                maBuoiDieuTri);

                if (lyDoBo == null || lyDoBo.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Phai nhap ly do bo buoi");
                }

                if (lyDoBo.length() > 1000) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ly do bo buoi vuot qua 1000 ky tu");
                }

                // Chi cho bo buoi chua len lich.
                if (buoi.getTrangThai() != TrangThaiBuoiDieuTri.CHUA_LEN_LICH) {

                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Chi duoc bo buoi chua len lich");
                }

                // Entity doi trang thai thanh DA_BO
                // va luu ly do, khong delete du lieu.
                buoi.boBuoi(lyDoBo.trim());

                buoi = buoiDieuTriRepository.saveAndFlush(buoi);

                return chuyenSangResponse(buoi);
        }

        // ==================================================
        // 4. XEM CHI TIET MOT BUOI
        // ==================================================

        public BuoiDieuTriResponse layChiTietBuoi(
                        String maLoTrinhDieuTri,
                        String maBuoiDieuTri) {

                LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

                loTrinhDieuTriService.kiemTraQuyenTruyCapBenhNhan(
                                loTrinh.getBenhNhan().getMaBenhNhan());

                BuoiDieuTri buoi = timBuoiThuocLoTrinh(
                                loTrinh,
                                maBuoiDieuTri);

                return chuyenSangResponse(buoi);
        }

        // ==================================================
        // 5. TIM LO TRINH
        // ==================================================

        private LoTrinhDieuTri timLoTrinh(
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

        // ==================================================
        // 6. TIM BUOI VA KIEM TRA THUOC DUNG LO TRINH
        // ==================================================

        private BuoiDieuTri timBuoiThuocLoTrinh(
                        LoTrinhDieuTri loTrinh,
                        String maBuoiDieuTri) {

                if (maBuoiDieuTri == null
                                || maBuoiDieuTri.isBlank()) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ma buoi dieu tri khong duoc de trong");
                }

                BuoiDieuTri buoi = buoiDieuTriRepository
                                .findById(maBuoiDieuTri.trim())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Khong tim thay buoi dieu tri"));

                if (!buoi.getLoTrinhDieuTri()
                                .getMaLoTrinhDieuTri()
                                .equals(loTrinh.getMaLoTrinhDieuTri())) {

                        throw new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Buoi khong thuoc lo trinh nay");
                }

                return buoi;
        }

        // ==================================================
        // 7. KIEM TRA TRANG THAI LO TRINH
        // ==================================================

        private void kiemTraLoTrinhChoPhepChinhSua(
                        LoTrinhDieuTri loTrinh) {

                TrangThaiLoTrinh trangThai = loTrinh.getTrangThai();

                if (trangThai != TrangThaiLoTrinh.CHUA_BAT_DAU
                                && trangThai != TrangThaiLoTrinh.DANG_DIEU_TRI) {

                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Khong the chinh sua lo trinh "
                                                        + "dang tam dung, da hoan thanh hoac da huy");
                }
        }

        // ==================================================
        // 8. KIEM TRA NOI DUNG BUOI
        // ==================================================

        private void kiemTraThongTinBuoi(
                        String tenBuoi,
                        String noiDung,
                        Integer min,
                        Integer max,
                        String ghiChu) {

                if (tenBuoi == null || tenBuoi.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ten buoi khong duoc de trong");
                }

                if (noiDung == null || noiDung.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Noi dung khong duoc de trong");
                }

                if (tenBuoi.length() > 200
                                || noiDung.length() > 2000) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ten buoi hoac noi dung vuot qua gioi han");
                }

                if (ghiChu != null && ghiChu.length() > 1000) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Ghi chu vuot qua 1000 ky tu");
                }

                if ((min != null && min < 0)
                                || (max != null && max < 0)) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Khoang cach khong duoc am");
                }

                if (min != null && max != null && min > max) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Khoang cach min khong duoc lon hon max");
                }
        }

        // ==================================================
        // 9. CHUAN HOA GHI CHU
        // ==================================================

        private String chuanHoaGhiChu(String ghiChu) {

                if (ghiChu == null) {
                        return null;
                }

                return ghiChu.trim();
        }

        // ==================================================
        // 10. CHUYEN ENTITY SANG DTO RESPONSE
        // ==================================================

        private BuoiDieuTriResponse chuyenSangResponse(
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
